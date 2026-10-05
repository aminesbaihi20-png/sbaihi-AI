import { useState, type FormEvent } from "react";
import {
  Code,
  Cpu,
  Eye,
  EyeOff,
  Globe,
  Monitor,
  Shield,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

type Provider = {
  name: string;
  icon: LucideIcon;
};

const providers: Provider[] = [
  { name: "Google", icon: Globe },
  { name: "Microsoft", icon: Monitor },
  { name: "Apple", icon: Shield },
  { name: "Android", icon: Smartphone },
  { name: "Facebook", icon: Cpu },
  { name: "GitHub", icon: Code },
];

export default function LampLoginAnimationV3() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lampOn, setLampOn] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setLampOn(false);

    window.setTimeout(() => {
      setIsLoading(false);
      setLampOn(true);
    }, 2000);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.8)] md:grid-cols-2">
        <section className="relative flex flex-col items-center justify-center overflow-hidden bg-slate-900/50 p-8 md:p-10">
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
              lampOn ? "opacity-100" : "opacity-20"
            }`}
          >
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`flex h-28 w-28 items-center justify-center rounded-full border-4 border-slate-700 shadow-2xl transition-all duration-500 ${
                lampOn
                  ? "bg-white shadow-[0_0_50px_rgba(255,255,255,0.8)]"
                  : "bg-slate-800"
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full transition-colors duration-500 ${
                  lampOn ? "animate-pulse bg-cyan-200" : "bg-slate-600"
                }`}
              />
            </div>
            <p className="mt-6 text-sm font-mono tracking-[0.25em] text-slate-400">
              {lampOn ? "PURE WHITE GLOW" : "LIGHT OFF"}
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center bg-slate-900 p-8 md:p-12">
          <div className="mb-6">
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
            <p className="text-sm text-slate-400">Choose your preferred provider to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 pr-10 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-[2.45rem] text-slate-400 transition hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-xl bg-yellow-400 px-4 py-3 font-bold text-slate-950 shadow-lg transition-all hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center py-2">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="mx-4 flex-shrink text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Or connect with
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {providers.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-2 py-2 text-[11px] font-semibold text-slate-200 transition-colors hover:bg-slate-700"
                >
                  <Icon size={14} className="text-slate-300" />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
