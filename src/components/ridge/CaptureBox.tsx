import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { KINDS, type Kind } from "@/lib/ridge/kinds";
import type { Proposal } from "@/lib/ridge/types";
import { postCapture, postConfirm } from "@/lib/ridge/server";

type CaptureBoxProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCaptured: () => void;
};

export function CaptureBox({ open, onOpenChange, onCaptured }: CaptureBoxProps) {
  const [body, setBody] = useState("");
  const [kinds, setKinds] = useState<Kind[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [kept, setKept] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setBody("");
      setKinds([]);
      setBusy(false);
      setError(null);
      setPendingId(null);
      setProposals([]);
      setKept([]);
    }
  }, [open]);

  function toggleKind(kind: Kind) {
    setKinds((current) =>
      current.includes(kind) ? current.filter((k) => k !== kind) : [...current, kind],
    );
  }

  function toggleKeep(name: string) {
    setKept((current) =>
      current.includes(name) ? current.filter((n) => n !== name) : [...current, name],
    );
  }

  async function submit() {
    const text = body.trim();
    if (!text || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await postCapture({
        data: { body: text, kinds: kinds.length ? kinds : undefined },
      });
      onCaptured();
      setPendingId(result.event.id);
      setProposals(result.proposals);
      setKept([]);
      setBody("");
      setKinds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function confirmKept() {
    if (!pendingId) return;
    setBusy(true);
    setError(null);
    try {
      await postConfirm({
        data: { id: pendingId, concepts: kept, projects: [] },
      });
      onCaptured();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  function skipMeaning() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-5">
        <DialogTitle>Capture</DialogTitle>
        <DialogDescription>
          One box. Write what happened. Meaning can wait.
        </DialogDescription>
        {pendingId ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted">
              Saved. Keep names to place it on the map, or skip to leave it pending.
            </p>
            {proposals.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {proposals.map((proposal) => {
                  const on = kept.includes(proposal.name);
                  return (
                    <button
                      key={proposal.name}
                      type="button"
                      onClick={() => toggleKeep(proposal.name)}
                      className={
                        on
                          ? "rounded-full border border-accent bg-accent-soft px-3 py-1 text-xs text-foreground"
                          : "rounded-full border border-border px-3 py-1 text-xs text-muted hover:text-foreground"
                      }
                    >
                      {proposal.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted">No names guessed.</p>
            )}
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={skipMeaning} disabled={busy}>
                Skip
              </Button>
              <Button size="sm" onClick={() => void confirmKept()} disabled={busy}>
                Confirm
              </Button>
            </div>
          </div>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <textarea
              autoFocus
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={4}
              placeholder="What happened?"
              className="w-full resize-none rounded-[var(--radius-sm)] border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
            <div className="flex flex-wrap gap-1.5">
              {KINDS.map((kind) => {
                const on = kinds.includes(kind);
                return (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => toggleKind(kind)}
                    className={
                      on
                        ? "rounded-full border border-accent bg-accent-soft px-2.5 py-0.5 text-[11px] text-foreground"
                        : "rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted hover:text-foreground"
                    }
                  >
                    {kind}
                  </button>
                );
              })}
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={busy || !body.trim()}>
                Save
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
