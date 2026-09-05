import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, Panel, Table } from "@/components/saha/admin";
import { Pill, Stat } from "@/components/saha/shell";
import { aiInsights, demandZones, inr, workers } from "@/lib/sahaseva-data";
import { useRequireRole } from "@/lib/session";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Super admin · SahaSeva command centre" },
      {
        name: "description",
        content:
          "Platform-wide oversight of workers, customers, societies, bookings, payments, welfare, complaints, fraud flags and AI analytics.",
      },
      { property: "og:title", content: "Super admin · SahaSeva" },
      { property: "og:description", content: "The SahaSeva platform command centre." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});

const complaints = [
  { id: "C-2201", by: "Customer", type: "Unexpected charge", ref: "SS-B-90155", state: "Under review" },
  { id: "C-2198", by: "Worker", type: "Customer unavailable", ref: "SS-B-90102", state: "Decision" },
  { id: "C-2190", by: "Customer", type: "No-show", ref: "SS-B-90088", state: "Resolved" },
];

const fraud = [
  "Account C-4471: 5 cancellations in 7 days — flagged for admin review.",
  "Worker W-1355: 3 five-star reviews from one device — flagged for admin review.",
  "Payment anomaly: repeated failed UPI attempts on booking SS-B-90211.",
];

function Admin() {
  const session = useRequireRole("SUPER_ADMIN");
  if (!session) return null;

  return (
    <AdminShell title={session.name} subtitle="Platform command centre">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total workers" value="1,284" />
        <Stat label="Total customers" value="18,940" />
        <Stat label="Societies" value="37" />
        <Stat label="Bookings (MTD)" value="9,412" />
        <Stat label="Emergency requests" value="286" tone="danger" />
        <Stat label="Transactions" value={inr(11840000)} />
        <Stat label="Open complaints" value="24" tone="warning" />
        <Stat label="Active users now" value="1,109" tone="success" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Worker verification queue">
          <Table
            head={["Worker", "Society", "Checks", "Action"]}
            rows={workers
              .filter((w) => w.status === "Pending" || !w.verified.certificate)
              .map((w) => [
                <span className="font-semibold">{w.name}</span>,
                w.society,
                <span className="flex flex-wrap gap-1">
                  <Pill tone={w.verified.identity ? "success" : "warning"}>ID</Pill>
                  <Pill tone={w.verified.member ? "success" : "warning"}>Member</Pill>
                  <Pill tone={w.verified.skill ? "success" : "warning"}>Skill</Pill>
                  <Pill tone={w.verified.certificate ? "success" : "warning"}>Cert</Pill>
                </span>,
                <button
                  onClick={() => toast.success(`Review opened for ${w.name}`)}
                  className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground"
                >
                  Review
                </button>,
              ])}
          />
        </Panel>

        <Panel title="Complaints & disputes">
          <Table
            head={["ID", "Raised by", "Type", "Booking", "Stage"]}
            rows={complaints.map((c) => [
              c.id,
              c.by,
              c.type,
              c.ref,
              <Pill tone={c.state === "Resolved" ? "success" : "warning"}>{c.state}</Pill>,
            ])}
          />
        </Panel>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Fraud monitoring">
          <ul className="space-y-2">
            {fraud.map((f) => (
              <li
                key={f}
                className="flex gap-2 rounded-xl bg-destructive/8 p-3 text-xs text-destructive"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Flags are advisory only — no account is ever suspended automatically.
          </p>
        </Panel>

        <Panel title="AI analytics">
          <ul className="space-y-2">
            {aiInsights.map((i) => (
              <li key={i} className="flex gap-2 rounded-xl bg-secondary p-3 text-xs text-secondary-foreground">
                <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {i}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Live demand map">
        <div className="grid gap-2 md:grid-cols-3">
          {demandZones.map((z) => (
            <div key={z.area + z.category} className="rounded-xl border p-3 text-xs">
              <p className="font-bold">{z.area}</p>
              <p className="text-muted-foreground">{z.category}</p>
              <p className="mt-1">
                <Pill tone={z.level === "High" ? "danger" : z.level === "Medium" ? "warning" : "success"}>
                  {z.level} demand
                </Pill>
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </AdminShell>
  );
}
