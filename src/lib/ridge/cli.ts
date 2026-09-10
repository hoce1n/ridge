import { createCore, type Core } from "./core.ts";
import { isKind, type Kind } from "./kinds.ts";
import { localUtcOffset } from "./time.ts";

export type CliIo = {
  log: (s: string) => void;
  err: (s: string) => void;
};

type Flags = {
  vault?: string;
  kinds?: string;
  keep?: string;
  projects?: string;
  save?: string;
  offset?: string;
  rest: string[];
};

function parseArgs(argv: string[]): { command: string; flags: Flags } {
  const restPositional: string[] = [];
  const flags: Flags = { rest: [] };
  let i = 0;
  const command = argv[0] ?? "";
  i = command ? 1 : 0;
  while (i < argv.length) {
    const arg = argv[i];
    if (arg === "--vault") {
      flags.vault = argv[++i] ?? "";
    } else if (arg === "--kinds") {
      flags.kinds = argv[++i] ?? "";
    } else if (arg === "--keep") {
      flags.keep = argv[++i] ?? "";
    } else if (arg === "--projects") {
      flags.projects = argv[++i] ?? "";
    } else if (arg === "--save") {
      flags.save = argv[++i] ?? "";
    } else if (arg === "--offset") {
      flags.offset = argv[++i] ?? "";
    } else if (arg.startsWith("--")) {
      flags.rest.push(arg);
    } else {
      restPositional.push(arg);
    }
    i += 1;
  }
  flags.rest = restPositional;
  return { command, flags };
}

function splitList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function vaultRoot(flags: Flags, env: NodeJS.ProcessEnv): string | undefined {
  return flags.vault || env.RIDGE_VAULT;
}

function usage(): string {
  return [
    "ridge add <body> [--kinds k1,k2] [--offset +HH:MM] [--vault path]",
    "ridge interpret <id> --keep a,b [--projects p] [--vault path]",
    "ridge trajectory [--vault path]",
    "ridge timeline [--vault path]",
    "ridge stack <name> [--vault path]",
    "ridge destination <text> [--vault path]",
    "ridge next <text> [--vault path]",
    "ridge accept-next [--vault path]",
    "ridge reflect [--save YYYY-name.md] [--vault path]",
  ].join("\n");
}

async function withCore(
  flags: Flags,
  env: NodeJS.ProcessEnv,
): Promise<Core> {
  const root = vaultRoot(flags, env);
  if (!root) {
    throw Object.assign(new Error("missing --vault or RIDGE_VAULT"), { code: 1 });
  }
  return createCore(root);
}

export async function runCli(
  argv: string[],
  env: NodeJS.ProcessEnv,
  io: CliIo,
): Promise<number> {
  const { command, flags } = parseArgs(argv);
  if (!command || command === "help" || command === "--help") {
    io.log(usage());
    return command ? 0 : 1;
  }

  try {
    if (command === "add") {
      const body = flags.rest.join(" ").trim();
      if (!body) {
        io.err("usage: ridge add <body>");
        return 1;
      }
      const kinds = splitList(flags.kinds).filter(isKind) as Kind[];
      const core = await withCore(flags, env);
      const { event, proposals } = await core.capture({
        body,
        kinds: kinds.length ? kinds : undefined,
        offset: flags.offset || localUtcOffset(),
      });
      io.log(event.id);
      io.log(event.path);
      if (proposals.length) {
        io.log(proposals.map((p) => p.name).join(", "));
      }
      return 0;
    }

    if (command === "interpret") {
      const id = flags.rest[0];
      if (!id) {
        io.err("usage: ridge interpret <id> --keep a,b");
        return 1;
      }
      const core = await withCore(flags, env);
      const event = await core.confirm(id, {
        concepts: splitList(flags.keep),
        projects: splitList(flags.projects),
      });
      io.log(event.id);
      io.log(event.interpretation);
      return 0;
    }

    if (command === "trajectory") {
      const core = await withCore(flags, env);
      const t = await core.trajectory();
      io.log(t.position.text);
      io.log(`destination: ${t.destination || "(none)"}`);
      io.log(`next: ${t.next_step || "(none)"}`);
      io.log(t.what_changed.interpretation);
      return 0;
    }

    if (command === "timeline") {
      const core = await withCore(flags, env);
      const t = await core.timeline();
      for (const event of t.events) {
        io.log(`${event.created} ${event.id} ${event.body.split("\n")[0]}`);
      }
      return 0;
    }

    if (command === "stack") {
      const name = flags.rest[0];
      if (!name) {
        io.err("usage: ridge stack <name>");
        return 1;
      }
      const core = await withCore(flags, env);
      const stack = await core.stack(name);
      const count = stack.groups.reduce((n, g) => n + g.events.length, 0);
      io.log(`${stack.name}: ${count}`);
      return 0;
    }

    if (command === "destination") {
      const text = flags.rest.join(" ").trim();
      if (!text) {
        io.err("usage: ridge destination <text>");
        return 1;
      }
      const core = await withCore(flags, env);
      const config = await core.setDestination(text);
      io.log(config.destination);
      return 0;
    }

    if (command === "next") {
      const text = flags.rest.join(" ").trim();
      if (!text) {
        io.err("usage: ridge next <text>");
        return 1;
      }
      const core = await withCore(flags, env);
      const config = await core.setNextStep(text);
      io.log(config.next_step);
      return 0;
    }

    if (command === "accept-next") {
      const core = await withCore(flags, env);
      const config = await core.acceptProposedNextStep();
      io.log(config.next_step || "(none)");
      return 0;
    }

    if (command === "reflect") {
      const core = await withCore(flags, env);
      const draft = await core.draftReflection();
      if (flags.save) {
        const path = await core.saveReflection(flags.save, draft);
        io.log(path);
      } else {
        io.log(draft);
      }
      return 0;
    }

    io.err(usage());
    return 1;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    io.err(message);
    if (message.includes("Vault not found")) return 2;
    const code = (err as { code?: number }).code;
    if (code === 1 || code === 2) return code;
    return 1;
  }
}

const isEntry =
  typeof process !== "undefined" &&
  process.argv[1] &&
  (process.argv[1].endsWith("/cli.ts") || process.argv[1].endsWith("/cli.js"));

if (isEntry) {
  runCli(process.argv.slice(2), process.env, {
    log: (s) => console.log(s),
    err: (s) => console.error(s),
  }).then((code) => process.exit(code));
}
