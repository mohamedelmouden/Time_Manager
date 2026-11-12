import { clsx } from "clsx";

const HEIGHT = {
  0: "h-28",
  1: "h-36",
  2: "h-44",
  3: "h-52",
  4: "h-60",
} as const;

export function FlameMark({ level, alive }: { level: 0 | 1 | 2 | 3 | 4; alive: boolean }) {
  const hot = alive && level > 0;
  return (
    <div className="pointer-events-none relative grid place-items-center" aria-hidden="true">
      {hot ? (
        <>
          <div className="ember-glow absolute size-48 rounded-full bg-ember/20 blur-3xl" />
          <div className="waqd-pulse-ring absolute size-36 rounded-full border border-ember/20" />
        </>
      ) : null}
      <svg viewBox="0 0 120 160" className={clsx("relative w-auto drop-shadow-lg", HEIGHT[level])}>
        <defs>
          <linearGradient id="fg-outer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="fg-inner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="fb">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
        <ellipse cx="60" cy="148" rx="24" ry="7" className={hot ? "fill-ember/40" : "fill-line"} filter="url(#fb)" />
        <path
          className={clsx(hot ? "flame-outer" : "fill-clay/30")}
          fill={hot ? "url(#fg-outer)" : undefined}
          d="M60 146c-22 0-40-20-36-48 3-22-4-34 4-50 6-14 14-22 10-36 8 16 14 18 22 16 8 2 14 0 22-16-4 14 4 22 10 36 8 16 1 28 4 50 4 28-14 48-36 48z"
        />
        <path
          className={clsx(hot ? "flame-inner" : "fill-clay/20")}
          fill={hot ? "url(#fg-inner)" : undefined}
          d="M60 128c-14-2-26-18-22-40 3-16-2-24 4-36 6 10 12 12 18 10 6 2 12 0 18-10 6 12 1 20 4 36 4 22-8 38-22 40z"
        />
        {hot ? <path className="fill-ivory/90" d="M60 108c-6 2-10 12-8 24 6-8 10-8 16 0 2-12-2-22-8-24z" /> : null}
      </svg>
    </div>
  );
}
