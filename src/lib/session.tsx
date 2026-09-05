import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { demoAccounts, roleHome, type DemoAccount, type Role } from "./sahaseva-data";

const KEY = "sahaseva.session";

export type Session = Omit<DemoAccount, "password"> & { verified?: boolean };

function read(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string, password: string): Session | { error: string } {
  const acc = demoAccounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!acc) return { error: "No account found with that email." };
  if (acc.password !== password) return { error: "Incorrect password." };
  const { password: _pw, ...session } = acc;
  window.localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("sahaseva-session"));
  return session;
}

export function signOut() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("sahaseva-session"));
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setSession(read());
    sync();
    setReady(true);
    window.addEventListener("sahaseva-session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sahaseva-session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { session, ready };
}

/** Client-side route guard: redirects to /auth or to the correct role home. */
export function useRequireRole(role: Role) {
  const { session, ready } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      navigate({ to: "/auth" });
    } else if (session.role !== role) {
      navigate({ to: roleHome[session.role] });
    }
  }, [ready, session, role, navigate]);

  return session && session.role === role ? session : null;
}

export function useSignOut() {
  const navigate = useNavigate();
  return useCallback(() => {
    signOut();
    navigate({ to: "/auth" });
  }, [navigate]);
}
