import { createFileRoute, useRouter } from "@tanstack/react-router";

import { TrajectoryView } from "@/components/ridge/TrajectoryView";
import { getTrajectory } from "@/lib/ridge/server";
import type { TrajectoryView as TrajectoryData } from "@/lib/ridge/views";

export const Route = createFileRoute("/app/")({
  loader: async () => {
    try {
      const trajectory = await getTrajectory();
      return { trajectory, error: null as string | null };
    } catch (err) {
      return {
        trajectory: null as TrajectoryData | null,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
  head: () => ({
    meta: [{ title: "Where am I going? · Ridge" }],
  }),
  component: TrajectoryHome,
});

function TrajectoryHome() {
  const { trajectory, error } = Route.useLoaderData();
  const router = useRouter();

  if (error || !trajectory) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display text-3xl">Where am I going?</h1>
        <p className="mt-3 text-sm text-danger">{error ?? "Vault not found"}</p>
      </div>
    );
  }

  return (
    <TrajectoryView
      data={trajectory}
      onChanged={() => {
        void router.invalidate();
      }}
    />
  );
}
