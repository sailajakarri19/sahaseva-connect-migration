/**
 * SahaSeva centralized persistent data layer.
 *
 * Single source of truth for bookings, payments, messages, reviews and
 * notifications. Records are persisted to localStorage and broadcast to every
 * open view (customer + worker) through BroadcastChannel + storage events, so
 * status changes appear immediately without a refresh.
 *
 * The module is deliberately modular: `persist()` / `load()` are the only
 * storage touch points, so a hosted backend adapter can replace them later
 * without changing any screen.
 */
import { useCallback, useSyncExternalStore } from "react";
import { bookings as demoBookings, workers, type BookingStatus as LegacyStatus } from "./sahaseva-data";

export type LiveStatus =
  | "Pending"
  | "Accepted"
  | "On The Way"
  | "Arrived"
  | "In Service"
  | "Completed"
  | "Cancelled"
  | "Rejected";

export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded" | "Disputed";

export type PaymentMethod = "UPI" | "Card" | "Net Banking" | "Wallet" | "Cash after service";

export type Coords = { lat: number; lng: number; accuracy?: number };

export type TimelineEntry = { status: LiveStatus; at: number; note?: string };

export type BookingRecord = {
  id: string;
  createdAt: number;
  customerEmail: string;
  customerName: string;
  workerId: string;
  categoryId: string;
  subservice: string;
  problem: string;
  /** yyyy-mm-dd */
  date: string;
  /** Human label for the chosen window, e.g. "4–6 PM" or "5:30 PM". */
  slot: string;
  /** Exact start time as an epoch ms value. */
  startAt: number;
  address: string;
  coords?: Coords;
  locationSource: "manual" | "gps";
  distanceKm: number;
  emergency: boolean;
  recurring: string;
  status: LiveStatus;
  amount: number;
  materials: number;
  coopFee: number;
  platformFee: number;
  payment: PaymentStatus;
  paymentMethod?: PaymentMethod;
  txn?: string;
  paidAt?: number;
  demoPayment?: boolean;
  rating?: number;
  review?: string;
  timeline: TimelineEntry[];
};

export type MessageRecord = {
  id: string;
  bookingId: string;
  from: "customer" | "worker";
  text: string;
  at: number;
};

export type ReviewRecord = {
  id: string;
  bookingId: string;
  workerId: string;
  customerName: string;
  stars: number;
  comment: string;
  at: number;
};

export type NotificationRecord = {
  id: string;
  audience: "customer" | "worker";
  /** customer email or worker id */
  target: string;
  title: string;
  body: string;
  tag: string;
  bookingId?: string;
  at: number;
  read: boolean;
};

export type DB = {
  version: number;
  bookings: BookingRecord[];
  messages: MessageRecord[];
  reviews: ReviewRecord[];
  notifications: NotificationRecord[];
};

const KEY = "sahaseva.db.v2";
const CHANNEL = "sahaseva-db";

export const bookingTotal = (b: BookingRecord) =>
  b.amount + b.materials + b.coopFee + b.platformFee;

export const isActive = (s: LiveStatus) =>
  s === "On The Way" || s === "Arrived" || s === "In Service";

export const isUpcoming = (s: LiveStatus) => s === "Accepted" || isActive(s);

const legacyToLive = (s: LegacyStatus): LiveStatus => (s === "Requested" ? "Pending" : s);

function seed(): DB {
  const now = Date.now();
  const day = 86_400_000;
  const list: BookingRecord[] = demoBookings.map((b, i) => {
    const startAt =
      b.date === "Today" ? now + 2 * 3_600_000 : b.date === "Tomorrow" ? now + day : now - (i + 2) * day;
    const status = legacyToLive(b.status);
    return {
      id: b.id,
      createdAt: startAt - 3_600_000,
      customerEmail: b.customer === "Lakshmi Devi" ? "lakshmi@sahaseva.in" : "guest@sahaseva.in",
      customerName: b.customer,
      workerId: b.workerId,
      categoryId: b.categoryId,
      subservice: b.subservice,
      problem: "",
      date: new Date(startAt).toISOString().slice(0, 10),
      slot: b.slot,
      startAt,
      address: b.address,
      locationSource: "manual",
      distanceKm: workers.find((w) => w.id === b.workerId)?.distanceKm ?? 0,
      emergency: Boolean(b.emergency),
      recurring: b.recurring ?? "One-time",
      status,
      amount: b.amount,
      materials: b.materials,
      coopFee: b.coopFee,
      platformFee: b.platformFee,
      payment: b.payment,
      ...(b.txn ? { txn: b.txn } : {}),
      ...(b.rating ? { rating: b.rating } : {}),
      timeline: [{ status, at: startAt - 3_600_000 }],
    };
  });
  return { version: 2, bookings: list, messages: [], reviews: [], notifications: [] };
}

let db: DB | null = null;
const listeners = new Set<() => void>();
let channel: BroadcastChannel | null = null;

function load(): DB {
  if (typeof window === "undefined") return { version: 2, bookings: [], messages: [], reviews: [], notifications: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    /* corrupted storage -> reseed */
  }
  const fresh = seed();
  try {
    window.localStorage.setItem(KEY, JSON.stringify(fresh));
  } catch {
    /* storage unavailable: run in-memory */
  }
  return fresh;
}

function getDB(): DB {
  if (!db) db = load();
  return db;
}

function emit() {
  for (const l of listeners) l();
}

function persist(next: DB, broadcast = true) {
  db = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors, keep in-memory state */
    }
    if (broadcast) {
      if (!channel && "BroadcastChannel" in window) channel = new BroadcastChannel(CHANNEL);
      channel?.postMessage("sync");
    }
  }
  emit();
}

function update(fn: (current: DB) => DB) {
  persist(fn(getDB()));
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (typeof window !== "undefined") {
    if (!channel && "BroadcastChannel" in window) {
      channel = new BroadcastChannel(CHANNEL);
      channel.onmessage = () => {
        db = null;
        emit();
      };
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        db = null;
        emit();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", onStorage);
    };
  }
  return () => listeners.delete(cb);
}

const SERVER_SNAPSHOT: DB = { version: 2, bookings: [], messages: [], reviews: [], notifications: [] };

/** Live, realtime-synced view of the database. */
export function useDB(): DB {
  return useSyncExternalStore(subscribe, getDB, () => SERVER_SNAPSHOT);
}

export function useReset() {
  return useCallback(() => persist(seed()), []);
}

/* ---------------------------------------------------------------- helpers */

let counter = 0;
const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}${(counter++).toString(36).toUpperCase()}`;

export const newBookingId = () =>
  `SS-B-${Math.floor(100000 + Math.random() * 899999)}`;

function notify(
  current: DB,
  n: Omit<NotificationRecord, "id" | "at" | "read">,
): DB {
  return {
    ...current,
    notifications: [
      { ...n, id: uid("N"), at: Date.now(), read: false },
      ...current.notifications,
    ],
  };
}

function patch(
  current: DB,
  id: string,
  fn: (b: BookingRecord) => BookingRecord,
): DB {
  return { ...current, bookings: current.bookings.map((b) => (b.id === id ? fn(b) : b)) };
}

const withStep = (b: BookingRecord, status: LiveStatus, note?: string): BookingRecord => ({
  ...b,
  status,
  timeline: [...b.timeline, { status, at: Date.now(), ...(note ? { note } : {}) }],
});

/* ---------------------------------------------------------------- actions */

export type NewBookingInput = Omit<
  BookingRecord,
  "id" | "createdAt" | "status" | "timeline" | "payment"
> & { payment?: PaymentStatus };

/** Returns the created booking, or an error when the slot conflicts. */
export function createBooking(
  input: NewBookingInput,
): { booking: BookingRecord } | { error: string } {
  const current = getDB();
  const clash = current.bookings.find(
    (b) =>
      b.workerId === input.workerId &&
      b.date === input.date &&
      b.slot === input.slot &&
      !["Cancelled", "Rejected", "Completed"].includes(b.status),
  );
  if (clash) {
    return {
      error: `This worker already has a booking in the ${input.slot} window on that day. Please pick another slot or worker.`,
    };
  }
  const booking: BookingRecord = {
    ...input,
    payment: input.payment ?? "Pending",
    id: newBookingId(),
    createdAt: Date.now(),
    status: "Pending",
    timeline: [{ status: "Pending", at: Date.now() }],
  };
  const worker = workers.find((w) => w.id === booking.workerId);
  let next: DB = { ...current, bookings: [booking, ...current.bookings] };
  next = notify(next, {
    audience: "worker",
    target: booking.workerId,
    title: booking.emergency ? "Emergency job request" : "New job request",
    body: `${booking.subservice} · ${booking.customerName} · ${booking.distanceKm} km · ₹${bookingTotal(booking)}`,
    tag: booking.emergency ? "Emergency" : "Job",
    bookingId: booking.id,
  });
  next = notify(next, {
    audience: "customer",
    target: booking.customerEmail,
    title: "Booking requested",
    body: `${booking.id} · ${booking.subservice} sent to ${worker?.name ?? "worker"}. Waiting for acceptance.`,
    tag: "Booking",
    bookingId: booking.id,
  });
  persist(next);
  return { booking };
}

export function acceptBooking(id: string) {
  update((current) => {
    const b = current.bookings.find((x) => x.id === id);
    if (!b) return current;
    const worker = workers.find((w) => w.id === b.workerId);
    let next = patch(current, id, (x) => withStep(x, "Accepted"));
    next = notify(next, {
      audience: "customer",
      target: b.customerEmail,
      title: "Booking accepted",
      body: `${worker?.name ?? "The worker"} accepted ${b.id} · ${b.subservice}. It is now in Upcoming.`,
      tag: "Booking",
      bookingId: id,
    });
    return next;
  });
}

export function rejectBooking(id: string, reason = "Worker is unavailable for this slot.") {
  update((current) => {
    const b = current.bookings.find((x) => x.id === id);
    if (!b) return current;
    const worker = workers.find((w) => w.id === b.workerId);
    let next = patch(current, id, (x) => withStep(x, "Rejected", reason));
    next = notify(next, {
      audience: "customer",
      target: b.customerEmail,
      title: "Booking not accepted",
      body: `${worker?.name ?? "The worker"} could not take ${b.id} · ${b.subservice}. ${reason} You can book another worker.`,
      tag: "Booking",
      bookingId: id,
    });
    return next;
  });
}

export const workerSteps: LiveStatus[] = [
  "Accepted",
  "On The Way",
  "Arrived",
  "In Service",
  "Completed",
];

export function advanceBooking(id: string, to: LiveStatus) {
  update((current) => {
    const b = current.bookings.find((x) => x.id === id);
    if (!b) return current;
    const worker = workers.find((w) => w.id === b.workerId);
    let next = patch(current, id, (x) => withStep(x, to));
    next = notify(next, {
      audience: "customer",
      target: b.customerEmail,
      title: to === "Completed" ? "Service completed" : `Worker update: ${to}`,
      body:
        to === "Completed"
          ? `${b.subservice} (${b.id}) is complete. Please rate ${worker?.name ?? "your worker"} and view the invoice.`
          : `${worker?.name ?? "Your worker"} is now "${to}" for ${b.subservice} (${b.id}).`,
      tag: "Booking",
      bookingId: id,
    });
    return next;
  });
}

export function cancelBooking(id: string, by: "customer" | "worker") {
  update((current) => {
    const b = current.bookings.find((x) => x.id === id);
    if (!b) return current;
    let next = patch(current, id, (x) =>
      withStep(
        { ...x, payment: x.payment === "Paid" ? "Refunded" : x.payment },
        "Cancelled",
        `Cancelled by ${by}`,
      ),
    );
    next = notify(next, {
      audience: by === "customer" ? "worker" : "customer",
      target: by === "customer" ? b.workerId : b.customerEmail,
      title: "Booking cancelled",
      body: `${b.id} · ${b.subservice} was cancelled by the ${by}.`,
      tag: "Booking",
      bookingId: id,
    });
    return next;
  });
}

export function setPayment(
  id: string,
  payload: {
    status: PaymentStatus;
    method?: PaymentMethod;
    txn?: string;
    demo?: boolean;
  },
) {
  update((current) => {
    const b = current.bookings.find((x) => x.id === id);
    if (!b) return current;
    let next = patch(current, id, (x) => ({
      ...x,
      payment: payload.status,
      ...(payload.method ? { paymentMethod: payload.method } : {}),
      ...(payload.txn ? { txn: payload.txn } : {}),
      ...(payload.status === "Paid" ? { paidAt: Date.now() } : {}),
      ...(payload.demo !== undefined ? { demoPayment: payload.demo } : {}),
    }));
    if (payload.status === "Paid") {
      next = notify(next, {
        audience: "worker",
        target: b.workerId,
        title: "Payment received",
        body: `₹${bookingTotal(b)} recorded for ${b.id} · ${b.subservice}.`,
        tag: "Payment",
        bookingId: id,
      });
    }
    return next;
  });
}

export function sendMessage(bookingId: string, from: "customer" | "worker", text: string) {
  update((current) => {
    const b = current.bookings.find((x) => x.id === bookingId);
    let next: DB = {
      ...current,
      messages: [...current.messages, { id: uid("M"), bookingId, from, text, at: Date.now() }],
    };
    if (b) {
      next = notify(next, {
        audience: from === "customer" ? "worker" : "customer",
        target: from === "customer" ? b.workerId : b.customerEmail,
        title: "New message",
        body: text.slice(0, 90),
        tag: "Message",
        bookingId,
      });
    }
    return next;
  });
}

export function addReview(bookingId: string, stars: number, comment: string) {
  update((current) => {
    const b = current.bookings.find((x) => x.id === bookingId);
    if (!b) return current;
    let next = patch(current, bookingId, (x) => ({ ...x, rating: stars, review: comment }));
    next = {
      ...next,
      reviews: [
        {
          id: uid("R"),
          bookingId,
          workerId: b.workerId,
          customerName: b.customerName,
          stars,
          comment,
          at: Date.now(),
        },
        ...next.reviews,
      ],
    };
    next = notify(next, {
      audience: "worker",
      target: b.workerId,
      title: `New ${stars}-star rating`,
      body: comment ? comment.slice(0, 90) : `Rated for ${b.subservice} (${b.id}).`,
      tag: "Rating",
      bookingId,
    });
    return next;
  });
}

export function markNotificationsRead(audience: "customer" | "worker", target: string) {
  update((current) => ({
    ...current,
    notifications: current.notifications.map((n) =>
      n.audience === audience && n.target === target ? { ...n, read: true } : n,
    ),
  }));
}

/** Worker rating recalculated from the base profile plus live reviews. */
export function workerRating(workerId: string, reviews: ReviewRecord[]) {
  const base = workers.find((w) => w.id === workerId);
  if (!base) return { rating: 0, count: 0 };
  const mine = reviews.filter((r) => r.workerId === workerId);
  if (mine.length === 0) return { rating: base.rating, count: base.jobs };
  const total = base.rating * base.jobs + mine.reduce((s, r) => s + r.stars, 0);
  const count = base.jobs + mine.length;
  return { rating: Math.round((total / count) * 10) / 10, count };
}
