import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";
import { Logo } from "@/components/saha/shell";
import { signIn } from "@/lib/session";
import { demoAccounts, roleHome, roleLabel } from "@/lib/sahaseva-data";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to SahaSeva" },
      {
        name: "description",
        content:
          "Sign in to SahaSeva as a customer, cooperative worker, society admin, federation admin or platform admin.",
      },
      { property: "og:title", content: "Sign in to SahaSeva" },
      {
        property: "og:description",
        content: "Role-based access for customers, workers, societies and federations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("lakshmi@sahaseva.in");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = signIn(email, password);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    navigate({ to: roleHome[res.role] });
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] px-5 py-8">
      <Logo />

      <h1 className="mt-8 text-2xl font-extrabold tracking-tight">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Trusted services. Empowered workers. Stronger communities.
      </p>

      <div className="mt-5 grid grid-cols-2 rounded-full border bg-muted p-1 text-sm font-semibold">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full py-2 transition-colors ${
              mode === m ? "bg-card text-foreground shadow-card" : "text-muted-foreground"
            }`}
          >
            {m === "login" ? "Sign in" : "Register"}
          </button>
        ))}
      </div>

      {mode === "login" ? (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <label className="flex items-center gap-2 rounded-xl border bg-card px-3 py-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <label className="flex items-center gap-2 rounded-xl border bg-card px-3 py-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          {error && (
            <p className="flex items-center gap-2 text-xs font-medium text-destructive">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
          <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-card">
            Sign in <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Forgot password? A reset link is sent to your registered email or mobile.
          </p>
        </form>
      ) : (
        <div className="mt-6 space-y-3">
          <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
            Registration collects your name, mobile, email, password, address (state, district,
            mandal, village, pincode, landmark) and preferred language. Workers additionally
            submit skills, experience, certificates, cooperative society and membership ID, KYC,
            availability and payout details — then go through identity, membership, skill and
            certificate verification by the society before approval.
          </p>
          <p className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-xs font-medium text-warning-foreground">
            Super Admin accounts are never created through public signup.
          </p>
        </div>
      )}

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Demo accounts (password: demo1234)
        </p>
        <div className="mt-3 space-y-2">
          {demoAccounts.map((a) => (
            <button
              key={a.email}
              onClick={() => {
                setMode("login");
                setEmail(a.email);
                setPassword(a.password);
                setError(null);
              }}
              className="flex w-full items-center justify-between rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted"
            >
              <span>
                <span className="block text-sm font-semibold">{a.name}</span>
                <span className="block text-xs text-muted-foreground">{a.email}</span>
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                {roleLabel[a.role]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
