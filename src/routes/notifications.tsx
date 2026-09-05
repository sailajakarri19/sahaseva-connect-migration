import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Bell } from "lucide-react";
import { Phone, AppHeader, Pill } from "@/components/saha/shell";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · SahaSeva" },
      {
        name: "description",
        content:
          "Booking, payment, verification, welfare and demand alerts for every SahaSeva role.",
      },
      { property: "og:title", content: "Notifications · SahaSeva" },
      { property: "og:description", content: "Role-aware notification centre." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Notifications,
});

const feed = {
  CUSTOMER: [
    { t: "Booking accepted", d: "Suresh Yadav accepted your tap repair booking.", tag: "Booking", time: "2 min ago" },
    { t: "Worker is on the way", d: "ETA 16 minutes · 2.6 km away.", tag: "Booking", time: "1 min ago" },
    { t: "Invoice ready", d: "Deep cleaning invoice SS-B-90201 · ₹1,850 paid.", tag: "Payment", time: "Yesterday" },
  ],
  WORKER: [
    { t: "New job request", d: "Fan repair · Kondapur · 1.8 km · ₹300 est.", tag: "Job", time: "Just now" },
    { t: "Payment received", d: "₹1,450 credited to your cooperative payout account.", tag: "Payment", time: "3 h ago" },
    { t: "Insurance renewal reminder", d: "Group insurance renews in 42 days.", tag: "Welfare", time: "2 d ago" },
  ],
  SOCIETY_ADMIN: [
    { t: "Worker verification pending", d: "Ganesh Rathod — skill & certificate review needed.", tag: "Verification", time: "20 min ago" },
    { t: "Emergency request", d: "Electrical emergency in Sangareddy Town.", tag: "Emergency", time: "1 h ago" },
    { t: "Welfare issue", d: "Kavitha Naik raised an insurance renewal case.", tag: "Welfare", time: "Today" },
  ],
  FEDERATION_ADMIN: [
    { t: "High demand alert", d: "Plumbing demand HIGH in Sangareddy Town.", tag: "AI", time: "30 min ago" },
    { t: "Society report ready", d: "Monthly performance for 4 societies.", tag: "Report", time: "Today" },
  ],
  SUPER_ADMIN: [
    { t: "Fraud pattern flagged", d: "3 repeated cancellations from one account.", tag: "Fraud", time: "15 min ago" },
    { t: "Complaint escalated", d: "Unexpected charge dispute · SS-B-90155.", tag: "Complaint", time: "2 h ago" },
  ],
} as const;

function Notifications() {
  const { session } = useSession();
  const router = useRouter();
  const items = session ? feed[session.role] : feed.CUSTOMER;

  return (
    <Phone>
      <AppHeader
        title="Notifications"
        subtitle="Alerts in your preferred language"
        right={
          <button
            onClick={() => router.history.back()}
            className="grid h-9 w-9 place-items-center rounded-full border bg-background"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        }
      />
      <ul className="space-y-2 p-4">
        {items.map((n) => (
          <li key={n.t} className="rounded-2xl border bg-card p-4 shadow-card">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold">{n.t}</p>
                  <Pill tone="primary">{n.tag}</Pill>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.d}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="px-4 pb-8 text-xs text-muted-foreground">
        Notification preferences: booking, payment, welfare and announcement alerts can be turned
        on or off per channel from your profile settings.
      </p>
    </Phone>
  );
}
