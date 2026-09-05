import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminShell, Panel, Table } from "@/components/saha/admin";
import { Pill, Stat } from "@/components/saha/shell";
import { bookings, categories, inr, workers } from "@/lib/sahaseva-data";
import { useRequireRole } from "@/lib/session";

export const Route = createFileRoute("/society")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Society dashboard · SahaSeva" },
      {
        name: "description",
        content:
          "Cooperative society dashboard for worker verification, booking oversight, finance splits and welfare tracking.",
      },
      { property: "og:title", content: "Society dashboard · SahaSeva" },
      { property: "og:description", content: "Run your cooperative society workforce." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Society,
});

function Society() {
  const session = useRequireRole("SOCIETY_ADMIN");
  if (!session) return null;

  return (
    <AdminShell title={session.name} subtitle={session.org}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total workers" value="42" hint="8 joined this quarter" />
        <Stat label="Active today" value="27" tone="success" />
        <Stat label="Pending verification" value="3" tone="warning" />
        <Stat label="Avg. rating" value="4.7" />
      </div>

      <Panel title="Worker management" action={<Pill tone="warning">3 need review</Pill>}>
        <Table
          head={["Worker", "Category", "Society status", "Rating", "Jobs", "Actions"]}
          rows={workers.map((w) => [
            <span className="font-semibold">{w.name}</span>,
            categories.find((c) => c.id === w.categoryId)?.name,
            w.status === "Verified" ? (
              <Pill tone="success">Verified</Pill>
            ) : (
              <Pill tone="warning">Pending</Pill>
            ),
            w.rating,
            w.jobs,
            <span className="flex gap-1.5">
              <button
                onClick={() => toast.success(`${w.name} approved`)}
                className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground"
              >
                Approve
              </button>
              <button
                onClick={() => toast("Changes requested")}
                className="rounded-full border px-2.5 py-1 text-[11px] font-bold"
              >
                Request changes
              </button>
              <button
                onClick={() => toast.error("Suspension recorded for review")}
                className="rounded-full border border-destructive/40 px-2.5 py-1 text-[11px] font-bold text-destructive"
              >
                Suspend
              </button>
            </span>,
          ])}
        />
        <p className="mt-3 text-[11px] text-muted-foreground">
          Verification covers identity, cooperative membership, skills and certificates. Every
          decision is logged with reviewer, date and reason.
        </p>
      </Panel>

      <Panel title="Bookings">
        <Table
          head={["Booking", "Service", "Worker", "Customer", "Status", "Payment"]}
          rows={bookings.map((b) => [
            b.id,
            b.subservice,
            workers.find((w) => w.id === b.workerId)?.name,
            b.customer,
            b.emergency ? <Pill tone="danger">Emergency</Pill> : <Pill tone="primary">{b.status}</Pill>,
            <Pill tone={b.payment === "Paid" ? "success" : "warning"}>{b.payment}</Pill>,
          ])}
        />
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Finance (configurable shares)">
          <div className="space-y-1.5 text-sm">
            <Row k="Customer paid" v={inr(500)} />
            <Row k="Worker earnings (90%)" v={inr(450)} />
            <Row k="Cooperative contribution (6%)" v={inr(30)} />
            <Row k="Platform fee (4%)" v={inr(20)} />
            <div className="flex justify-between border-t pt-2 font-extrabold">
              <span>Total</span>
              <span>{inr(500)}</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Month to date: service value {inr(486000)} · payouts {inr(437400)} · pending{" "}
            {inr(24500)} · refunds {inr(3200)}.
          </p>
        </Panel>

        <Panel title="Welfare status">
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between">
              <span>Insured workers</span> <b>39 / 42</b>
            </li>
            <li className="flex justify-between">
              <span>Insurance renewals due (30 d)</span> <b className="text-warning-foreground">4</b>
            </li>
            <li className="flex justify-between">
              <span>Open welfare cases</span> <b>2</b>
            </li>
            <li className="flex justify-between">
              <span>Training enrolments</span> <b>11</b>
            </li>
          </ul>
        </Panel>
      </div>
    </AdminShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
