import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { toAr, timeRemaining, formatTime } from "@/lib/waqd";

type Props = {
  time: string;
  today: string;
  done: boolean;
};

export function TimeRunner({ time, today, done }: Props) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  // Suppress unused warning — `now` triggers re-render on interval
  void now;

  const remaining = timeRemaining(time, today);
  const formattedTime = formatTime(time);

  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1 text-xs text-success">
        <span className="size-1.5 rounded-full bg-success" />
        {formattedTime} · تم
      </span>
    );
  }

  if (remaining.isOverdue) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose/10 px-2.5 py-1 text-xs text-rose">
        <span className="size-1.5 rounded-full bg-rose animate-timer-pulse" />
        {formattedTime} · فات الموعد
      </span>
    );
  }

  if (remaining.totalMinutes <= 30) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-brass/10 px-2.5 py-1 text-xs text-brass">
        <span className="size-1.5 rounded-full bg-brass animate-timer-pulse" />
        {formattedTime} · {remaining.totalMinutes > 0 ? `${toAr(remaining.minutes)} د` : "الآن"}
      </span>
    );
  }

  return (
    <span className={clsx(
      "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs",
      remaining.totalMinutes <= 60 ? "bg-ember/10 text-ember-light" : "bg-surface text-clay"
    )}>
      <span className={clsx(
        "size-1.5 rounded-full",
        remaining.totalMinutes <= 60 ? "bg-ember-light" : "bg-clay/50"
      )} />
      {formattedTime}
      {remaining.hours > 0 ? ` · ${toAr(remaining.hours)} س` : ""}
      {remaining.minutes > 0 ? ` ${toAr(remaining.minutes)} د` : ""}
    </span>
  );
}

export function TimeProgressBar({ time, today, done }: Props) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  void now;

  const remaining = timeRemaining(time, today);

  if (done) return null;

  return (
    <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-line/30">
      <div
        className={clsx(
          "h-full rounded-full transition-all duration-1000 animate-progress-fill",
          remaining.isOverdue
            ? "bg-rose"
            : remaining.totalMinutes <= 30
              ? "bg-brass"
              : remaining.totalMinutes <= 60
                ? "bg-ember"
                : "bg-clay/30",
        )}
        style={{ width: `${remaining.percent}%` }}
      />
    </div>
  );
}

