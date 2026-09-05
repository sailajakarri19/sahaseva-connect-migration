import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Repeat,
  Scale,
  Star,
} from "lucide-react";
import { AppHeader, Pill } from "@/components/saha/shell";
import { categories, fairWage, inr, workers } from "@/lib/sahaseva-data";
import { toast } from "sonner";

const search = z.object({
  category: z.string().optional(),
  sub: z.string().optional(),
});

export const Route = createFileRoute("/app/book")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Book a service · SahaSeva" },
      {
        name: "description",
        content:
          "Pick a service and subservice, describe the problem, choose a verified worker, slot and address, and see transparent pricing before you confirm.",
      },
      { property: "og:title", content: "Book a service · SahaSeva" },
      { property: "og:description", content: "Transparent, fair-wage booking in a few steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Book,
});

const slots = ["8–10 AM", "10 AM–12 PM", "12–2 PM", "2–4 PM", "4–6 PM", "6–8 PM"];
const recurrences = ["One-time", "Weekly", "Biweekly", "Monthly"];

function Book() {
  const { category, sub } = Route.useSearch();
  const navigate = useNavigate();

  const [catId, setCatId] = useState(category ?? "");
  const [subName, setSubName] = useState(sub ?? "");
  const [problem, setProblem] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [day, setDay] = useState("Today");
  const [slot, setSlot] = useState(slots[3]!);
  const [recurring, setRecurring] = useState("One-time");
  const [address, setAddress] = useState("H.No 4-21, Kondapur Village, Sangareddy – 502285");
  const [done, setDone] = useState<string | null>(null);

  const cat = categories.find((c) => c.id === catId);
  const subservice = cat?.subservices.find((s) => s.name === subName);
  const candidates = useMemo(
    () =>
      workers
        .filter((w) => w.status === "Verified" && (!catId || w.categoryId === catId))
        .sort((a, b) => a.distanceKm - b.distanceKm),
    [catId],
  );
  const worker = workers.find((w) => w.id === workerId);

  const serviceCharge = subservice?.base ?? 0;
  const materials = subservice ? Math.round(subservice.base * 0.25) : 0;
  const coopFee = Math.round(serviceCharge * 0.07);
  const platformFee = Math.round(serviceCharge * 0.05);
  const total = serviceCharge + materials + coopFee + platformFee;
  const wage = subservice ? fairWage(serviceCharge, subservice.range) : null;

  if (done) {
    return (
      <>
        <AppHeader title="Booking confirmed" subtitle={done} />
        <div className="space-y-4 p-4">
          <div className="rounded-2xl border bg-card p-6 text-center shadow-card">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <p className="mt-3 text-lg font-extrabold">Your booking is requested</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {worker?.name} will confirm shortly. You can track status, chat and reschedule from
              Bookings.
            </p>
            <button
              onClick={() => navigate({ to: "/app/bookings" })}
              className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
            >
              Go to my bookings
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader
        title="Book a service"
        subtitle="Transparent pricing · fair wages"
        right={
          <button
            onClick={() => navigate({ to: "/app" })}
            className="grid h-9 w-9 place-items-center rounded-full border bg-background"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        }
      />

      <div className="space-y-4 p-4">
        <Card title="1 · Select service">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Chip
                key={c.id}
                active={catId === c.id}
                onClick={() => {
                  setCatId(c.id);
                  setSubName("");
                  setWorkerId("");
                }}
              >
                {c.name}
              </Chip>
            ))}
          </div>
        </Card>

        {cat && (
          <Card title="2 · Select subservice">
            <div className="space-y-2">
              {cat.subservices.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSubName(s.name)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm ${
                    subName === s.name ? "border-primary bg-secondary" : "bg-background"
                  }`}
                >
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {inr(s.range[0])} – {inr(s.range[1])}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {subservice && (
          <>
            <Card title="3 · Describe the problem">
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={3}
                placeholder="E.g. kitchen tap has been dripping since yesterday"
                className="w-full rounded-xl border bg-background p-3 text-sm outline-none"
              />
              <button className="mt-2 flex items-center gap-2 rounded-xl border border-dashed px-3 py-2 text-xs font-semibold text-muted-foreground">
                <Camera className="h-4 w-4" /> Add photo or video (optional)
              </button>
            </Card>

            <Card title="4 · Select a verified worker">
              <div className="space-y-2">
                {candidates.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWorkerId(w.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left ${
                      workerId === w.id ? "border-primary bg-secondary" : "bg-background"
                    }`}
                  >
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold text-primary-foreground"
                      style={{ backgroundColor: w.photoTint }}
                    >
                      {w.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 text-sm font-bold">
                        {w.name} <BadgeCheck className="h-3.5 w-3.5 text-success" />
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        <Star className="mr-1 inline h-3 w-3 fill-accent text-accent" />
                        {w.rating} · {w.distanceKm} km · {w.society}
                      </span>
                    </span>
                    {w.availableNow && <Pill tone="success">Now</Pill>}
                  </button>
                ))}
              </div>
            </Card>

            <Card title="5 · Date & time slot">
              <div className="flex gap-2">
                {["Today", "Tomorrow", "Pick date"].map((d) => (
                  <Chip key={d} active={day === d} onClick={() => setDay(d)}>
                    <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
                    {d}
                  </Chip>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {slots.map((s) => (
                  <Chip key={s} active={slot === s} onClick={() => setSlot(s)}>
                    <Clock className="mr-1 inline h-3.5 w-3.5" />
                    {s}
                  </Chip>
                ))}
              </div>
              <div className="mt-3">
                <p className="mb-1.5 flex items-center gap-1 text-xs font-bold text-muted-foreground">
                  <Repeat className="h-3.5 w-3.5" /> Repeat booking
                </p>
                <div className="flex flex-wrap gap-2">
                  {recurrences.map((r) => (
                    <Chip key={r} active={recurring === r} onClick={() => setRecurring(r)}>
                      {r}
                    </Chip>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="6 · Service address">
              <label className="flex items-start gap-2 rounded-xl border bg-background p-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
              <button
                onClick={() => toast.success("Using your current GPS location")}
                className="mt-2 text-xs font-bold text-primary"
              >
                Use current location
              </button>
            </Card>

            <Card title="7 · Price estimate">
              <Row label="Service charge" value={inr(serviceCharge)} />
              <Row label="Estimated materials" value={inr(materials)} />
              <Row label="Cooperative fee (7%)" value={inr(coopFee)} />
              <Row label="Platform fee (5%)" value={inr(platformFee)} />
              <div className="mt-2 flex items-center justify-between border-t pt-2 text-sm font-extrabold">
                <span>Estimated total</span>
                <span>{inr(total)}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Estimated range {inr(subservice.range[0])} – {inr(subservice.range[1])}. Final
                amount may vary with actual work and materials. No hidden fees.
              </p>
              {wage && (
                <div
                  className={`mt-3 flex items-start gap-2 rounded-xl p-3 text-xs font-medium ${
                    wage.ok ? "bg-success/10 text-success" : "bg-warning/15 text-warning-foreground"
                  }`}
                >
                  <Scale className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <b>Fair Wage Check:</b> {wage.text}
                  </span>
                </div>
              )}
              <p className="mt-3 rounded-xl bg-muted p-3 text-[11px] text-muted-foreground">
                Cancellation policy: free cancellation up to 2 hours before the slot. Later
                cancellations may carry a ₹50 visit-protection charge paid to the worker.
              </p>
            </Card>

            <button
              disabled={!workerId}
              onClick={() => {
                setDone(`${subservice.name} · ${day}, ${slot}`);
                toast.success("Booking requested");
              }}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-card disabled:opacity-40"
            >
              {workerId ? `Confirm booking · ${inr(total)}` : "Select a worker to continue"}
            </button>
          </>
        )}
      </div>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-4 shadow-card">
      <h2 className="mb-3 text-sm font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
        active ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
