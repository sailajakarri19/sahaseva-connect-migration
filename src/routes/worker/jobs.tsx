import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import { AppHeader, Pill } from "@/components/saha/shell";
import { inr } from "@/lib/sahaseva-data";

export const Route = createFileRoute("/worker/jobs")({
  head: () => ({
    meta: [
      { title: "My jobs · SahaSeva Worker" },
      {
        name: "description",
        content:
          "Manage upcoming, active and completed jobs and move through accept, on the way, arrived, start and complete steps.",
      },
      { property: "og:title", content: "My jobs · SahaSeva Worker" },
      { property: "og:description", content: "Job workflow and calendar for cooperative workers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Jobs,
});

const steps = ["Accepted", "On The Way", "Arrived", "In Service", "Completed"];

const jobs = {
  Upcoming: [
    { id: "SS-B-90503", s: "Light installation", c: "Zilla School", when: "Tomorrow · 10–12", amt: 450, where: "Jogipet Town" },
  ],
  Active: [
    { id: "SS-B-90412", s: "Fan repair", c: "Lakshmi Devi", when: "Today · 4–6 PM", amt: 300, where: "Kondapur Village" },
  ],
  Completed: [
    { id: "SS-B-90155", s: "Electrical maintenance", c: "Sunrise Clinic", when: "02 Aug", amt: 900, where: "Sangareddy Town" },
    { id: "SS-B-90101", s: "Inverter service", c: "Ramesh K.", when: "28 Jul", amt: 520, where: "Kondapur Village" },
  ],
} as const;

function Jobs() {
  const [tab, setTab] = useState<keyof typeof jobs>("Active");
  const [step, setStep] = useState(1);

  return (
    <>
      <AppHeader title="My jobs" subtitle="Double bookings are blocked automatically" />

      <div className="sticky top-[57px] z-10 grid grid-cols-3 gap-1 border-b bg-card px-4 py-2 text-xs font-bold">
        {(Object.keys(jobs) as (keyof typeof jobs)[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full py-2 ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3 p-4">
        {jobs[tab].map((j) => (
          <article key={j.id} className="rounded-2xl border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold">{j.s}</p>
                <p className="text-xs text-muted-foreground">
                  {j.c} · {j.id}
                </p>
              </div>
              <span className="text-sm font-extrabold">{inr(j.amt)}</span>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" /> {j.when}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {j.where}
            </p>

            {tab === "Active" && (
              <>
                <div className="mt-3 flex flex-wrap gap-1 text-[10px]">
                  {steps.map((s, i) => (
                    <span
                      key={s}
                      className={`rounded-full px-2 py-1 font-semibold ${
                        i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      const next = Math.min(step + 1, steps.length - 1);
                      setStep(next);
                      toast.success(`Status updated: ${steps[next]}`);
                    }}
                    className="flex-1 rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground"
                  >
                    Move to {steps[Math.min(step + 1, steps.length - 1)]}
                  </button>
                  <button
                    onClick={() => toast("Opening navigation")}
                    className="flex items-center gap-1.5 rounded-lg border px-3 text-xs font-bold"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Navigate
                  </button>
                </div>
              </>
            )}

            {tab === "Completed" && <Pill tone="success">Paid to cooperative account</Pill>}
          </article>
        ))}
      </div>

      <section className="px-4 pb-8">
        <div className="rounded-2xl border bg-card p-4 shadow-card">
          <h2 className="text-sm font-bold">Availability & calendar</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Working days: Mon–Sat · Hours: 8 AM – 8 PM · Blocked: 15 Aug
          </p>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px]">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div
                key={i}
                className={`rounded-lg py-2 font-bold ${i === 6 ? "bg-muted text-muted-foreground" : "bg-secondary text-secondary-foreground"}`}
              >
                {d}
              </div>
            ))}
          </div>
          <button
            onClick={() => toast.success("Date blocked")}
            className="mt-3 text-xs font-bold text-primary"
          >
            Block a date
          </button>
        </div>
      </section>
    </>
  );
}
