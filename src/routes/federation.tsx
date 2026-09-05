import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit } from "lucide-react";
import { AdminShell, Panel, Table } from "@/components/saha/admin";
import { Pill, Stat } from "@/components/saha/shell";
import { aiInsights, demandZones, inr } from "@/lib/sahaseva-data";
import { useRequireRole } from "@/lib/session";

export const Route = createFileRoute("/federation")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Federation dashboard · SahaSeva" },
      {
        name: "description",
        content:
          "Federation-level oversight of member societies, workers, bookings, demand maps and district performance.",
      },
      { property: "og:title", content: "Federation dashboard · SahaSeva" },
      { property: "og:description", content: "Multi-society cooperative management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Federation,
});

const societies = [
  { name: "Sangareddy Labour Co-op Society", district: "Sangareddy", workers: 42, bookings: 318, rating: 4.7, payout: 437400 },
  { name: "Zaheerabad Rural Workers Society", district: "Sangareddy", workers: 31, bookings: 204, rating: 4.6, payout: 286100 },
  { name: "Medak Skilled Trades Co-op", district: "Medak", workers: 27, bookings: 176, rating: 4.5, payout: 241900 },
  { name: "Narayankhed Community Services Society", district: "Sangareddy", workers: 19, bookings: 92, rating: 4.4, payout: 118700 },
];

const levelTone = { High: "danger", Medium: "warning", Low: "success" } as const;

function Federation() {
  const session = useRequireRole("FEDERATION_ADMIN");
  if (!session) return null;

  return (
    <AdminShell title={session.name} subtitle={session.org}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Societies" value="4" />
        <Stat label="Workers" value="119" />
        <Stat label="Active workers" value="86" tone="success" />
        <Stat label="Bookings (MTD)" value="790" />
        <Stat label="Payouts (MTD)" value={inr(1084100)} />
      </div>

      <Panel title="Member societies" action={<Pill tone="primary">Telangana federation</Pill>}>
        <Table
          head={["Society", "District", "Workers", "Bookings", "Rating", "Payouts"]}
          rows={societies.map((s) => [
            <span className="font-semibold">{s.name}</span>,
            s.district,
            s.workers,
            s.bookings,
            s.rating,
            inr(s.payout),
          ])}
        />
        <p className="mt-3 text-[11px] text-muted-foreground">
          Federation admins can only access societies assigned to their federation.
        </p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Demand map">
          <ul className="space-y-2">
            {demandZones.map((z) => (
              <li
                key={z.area + z.category}
                className="flex items-center justify-between rounded-xl border p-3 text-xs"
              >
                <span>
                  <b>{z.category}</b> · {z.area}
                  <span className="block text-muted-foreground">
                    {z.jobs} requests · {z.workers} active workers
                  </span>
                </span>
                <Pill tone={levelTone[z.level]}>{z.level}</Pill>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="AI insights">
          <ul className="space-y-2">
            {aiInsights.map((i) => (
              <li key={i} className="flex gap-2 rounded-xl bg-secondary p-3 text-xs text-secondary-foreground">
                <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {i}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Forecasts and allocation suggestions are advisory. Federation and society admins make
            all final decisions.
          </p>
        </Panel>
      </div>

      <Panel title="Welfare across the federation">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Insured workers" value="104 / 119" />
          <Stat label="Renewals due" value="9" tone="warning" />
          <Stat label="Open welfare cases" value="6" />
          <Stat label="Training completions" value="48" tone="success" />
        </div>
      </Panel>
    </AdminShell>
  );
}
