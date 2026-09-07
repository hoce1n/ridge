import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createCore } from "./core.ts";
import { KINDS } from "./kinds.ts";
import { vaultRoot } from "./paths.ts";

const kindSchema = z.enum(KINDS);

async function core() {
  try {
    return await createCore(vaultRoot());
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("Vault not found")) {
      throw new Error("Vault not found");
    }
    throw err;
  }
}

export const getTrajectory = createServerFn({ method: "GET" }).handler(async () => {
  return (await core()).trajectory();
});

export const getTimeline = createServerFn({ method: "GET" }).handler(async () => {
  return (await core()).timeline();
});

export const getStack = createServerFn({ method: "GET" })
  .validator(z.object({ name: z.string().min(1) }))
  .handler(async ({ data }) => {
    return (await core()).stack(data.name);
  });

export const getEvent = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    return (await core()).event(data.id);
  });

export const postCapture = createServerFn({ method: "POST" })
  .validator(
    z.object({
      body: z.string().min(1),
      kinds: z.array(kindSchema).optional(),
    }),
  )
  .handler(async ({ data }) => {
    return (await core()).capture({
      body: data.body,
      kinds: data.kinds,
    });
  });

export const postConfirm = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      concepts: z.array(z.string()),
      projects: z.array(z.string()),
    }),
  )
  .handler(async ({ data }) => {
    return (await core()).confirm(data.id, {
      concepts: data.concepts,
      projects: data.projects,
    });
  });

export const postSetDestination = createServerFn({ method: "POST" })
  .validator(z.object({ text: z.string() }))
  .handler(async ({ data }) => {
    return (await core()).setDestination(data.text);
  });

export const postSetNextStep = createServerFn({ method: "POST" })
  .validator(z.object({ text: z.string() }))
  .handler(async ({ data }) => {
    return (await core()).setNextStep(data.text);
  });

export const postAcceptNext = createServerFn({ method: "POST" }).handler(async () => {
  return (await core()).acceptProposedNextStep();
});

export const postSetMilestone = createServerFn({ method: "POST" })
  .validator(z.object({ text: z.string() }))
  .handler(async ({ data }) => {
    return (await core()).setMilestone(data.text);
  });
