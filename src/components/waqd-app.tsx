import { useEffect, useState } from "react";
import { Check, Circle, Lock, Plus, Flame, Trophy, Calendar, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { clsx } from "clsx";
import { FlameMark } from "@/components/flame-mark";
import { PlanSheet } from "@/components/plan-sheet";
import { TimeRunner, TimeProgressBar } from "@/components/time-runner";
import {
  addDays,
  correctStart,
  dateKey,
  dayMark,
  describeFlame,
  doneCount,
  formatDay,
  formatTime,
  lightFlame,
  loadStore,
  recentDays,
  relativeDay,
  removePlan,
  savePlan,
  saveStore,
  slipFlame,
  sortByTime,
  splitPlans,
  STORAGE_KEY,
  taskCountPhrase,
  toAr,
  toggleTask,
  undoSlip,
  weekdayLetter,
  type DayPlan,
  type StoreData,
  emptyStore,
} from "@/lib/waqd";

export function WaqdApp() {
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState<string | null>(null);
  const [data, setData] = useState<StoreData>(emptyStore());
  const [sheetDate, setSheetDate] = useState<string | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [wasteAsk, setWasteAsk] = useState(false);
  const [startAsk, setStartAsk] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [flameError, setFlameError] = useState<string | null>(null);

  useEffect(() => {
    setData(loadStore());
    setToday(dateKey());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveStore(data);
  }, [data, ready]);

  useEffect(() => {
    const syncDay = () => setToday(dateKey());
    const onVisible = () => {
      if (document.visibilityState === "visible") syncDay();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setData(loadStore());
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("storage", onStorage);
    const timer = window.setInterval(syncDay, 30_000);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
    };
  }, []);

  if (!ready || !today) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-5">
        <div className="animate-float">
          <Flame className="size-12 text-ember" />
        </div>
        <p className="font-display text-5xl leading-none mt-4">وَقْد</p>
        <p className="mt-3 text-sm text-clay">صُن وقتك من التفاهة</p>
      </main>
    );
  }

  const view = describeFlame(data.flame, today);
  const { todayPlan, upcoming, history } = splitPlans(data.plans, today);
  const shownHistory = showAllHistory ? history : history.slice(0, 4);

  function light(start: string) {
    const result = view.canCorrect ? correctStart(data, today!, start) : lightFlame(data, today!, start);
    setData(result.data);
    setFlameError(result.error);
    if (!result.error) {
      setStartAsk(false);
      setWasteAsk(false);
    }
  }

  function openSheet(date?: string) {
    setSheetDate(date ?? addDays(today!, 1));
  }


  return (
    <div className="min-h-dvh overflow-x-hidden bg-ink text-ivory">
      <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pt-6 pb-32">
        {/* ─── Header ─── */}
        <header className="flex items-end justify-between gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl gradient-ember shadow-lg shadow-ember/20">
              <Flame className="size-5 text-ink" />
            </div>
            <div>
              <h1 className="font-display text-3xl leading-none">وَقْد</h1>
              <p className="text-xs text-clay mt-0.5">صُن وقتك من التفاهة</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5 pb-1">
            <p className="text-sm font-medium text-ivory/90">{formatDay(today)}</p>
          </div>
        </header>

        {/* ─── Flame Section ─── */}
        <section aria-labelledby="flame-heading" className="flex flex-col items-center animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h2 id="flame-heading" className="sr-only">شعلة الأيام</h2>
          
          <div className="relative flex w-full flex-col items-center">
            <FlameMark level={view.level} alive={view.alive} />
            <div
              className={clsx(
                "relative z-10 -mt-8 flex size-48 flex-col items-center justify-center rounded-full border-2 bg-ink shadow-2xl transition-all duration-500",
                view.alive
                  ? "border-ember/60 shadow-ember/10"
                  : "border-line/40 shadow-none",
              )}
            >
              {/* Inner ring */}
              <div
                className={clsx(
                  "absolute inset-2 rounded-full border transition-colors duration-500",
                  view.alive ? "border-brass/20" : "border-line/20",
                )}
              />
              {/* Shimmer effect */}
              {view.alive ? <div className="absolute inset-2 rounded-full shimmer" /> : null}
              
              <p
                data-testid="streak-count"
                className={clsx(
                  "font-display text-6xl leading-none transition-colors duration-300",
                  view.alive ? "text-ivory" : "text-clay/70",
                )}
              >
                {toAr(view.count)}
              </p>
              <p className="mt-2 text-xs text-clay/80">يوم بلا تفاهة</p>
            </div>
          </div>
          
          {/* Motivational text */}
          <p className="mt-5 max-w-xs text-center text-sm leading-relaxed text-clay">{view.copy}</p>
          {view.anchor ? (
            <p className="mt-1.5 text-center text-xs text-brass-dim">مشتعلة منذ {formatDay(view.anchor)}</p>
          ) : null}

          {/* ─── Week dots ─── */}
          <ol className="mt-6 flex w-full justify-between gap-1 rounded-2xl gradient-card border border-line/30 px-4 py-3">
            {recentDays(today).map((key) => {
              const mark = dayMark(data.flame, key, today);
              const isToday = key === today;
              return (
                <li key={key} className="flex flex-1 flex-col items-center gap-2">
                  <span
                    className={clsx(
                      "size-3.5 rounded-full transition-all duration-300",
                      mark === "clean" && "bg-ember shadow-sm shadow-ember/30",
                      mark === "slip" && "bg-line/60",
                      mark === "idle" && isToday && "border-2 border-brass",
                      mark === "idle" && !isToday && "border border-line/40",
                    )}
                  />
                  <span className={clsx("text-xs font-medium", isToday ? "text-ivory" : "text-clay/60")}>{weekdayLetter(key)}</span>
                </li>
              );
            })}
          </ol>

          {/* ─── Stats ─── */}
          <dl className="mt-4 grid w-full grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-2xl gradient-card border border-line/30 px-4 py-3.5">
              <div className="grid size-9 place-items-center rounded-xl bg-brass/10">
                <Trophy className="size-4 text-brass" />
              </div>
              <div>
                <dt className="text-xs text-clay">أفضل وهج</dt>
                <dd className="font-display text-2xl leading-none mt-0.5">{toAr(view.best)}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl gradient-card border border-line/30 px-4 py-3.5">
              <div className="grid size-9 place-items-center rounded-xl bg-ember/10">
                <Calendar className="size-4 text-ember" />
              </div>
              <div>
                <dt className="text-xs text-clay">أيام مصونة</dt>
                <dd className="font-display text-2xl leading-none mt-0.5">{toAr(view.total)}</dd>
              </div>
            </div>
          </dl>

          {/* ─── Flame actions ─── */}
          <div className="mt-5 flex w-full flex-col gap-2">
            {!view.alive && !view.slippedToday ? (
              <>
                <button
                  type="button"
                  data-testid="light-flame"
                  onClick={() => light(today)}
                  className="h-12 rounded-full gradient-ember text-base font-semibold text-ink shadow-lg shadow-ember/20 transition-all hover:shadow-xl hover:shadow-ember/30 active:scale-[0.98]"
                >
                  أُشعل الشعلة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartAsk((open) => !open);
                    setStartDate(addDays(today, -1));
                    setFlameError(null);
                  }}
                  className="h-11 text-sm text-clay transition-colors hover:text-ivory"
                >
                  بدأت قبل اليوم
                </button>
                {startAsk ? (
                  <form
                    className="flex flex-col gap-3 rounded-2xl gradient-card border border-line/30 p-4 animate-scale-in"
                    onSubmit={(event) => {
                      event.preventDefault();
                      light(startDate);
                    }}
                  >
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-clay font-medium">أول يوم لم يضع بعده وقتك</span>
                      <input
                        type="date"
                        max={today}
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                        className="h-12 rounded-xl border border-line/40 bg-surface/50 px-4 text-base outline-none transition-all focus-visible:border-brass focus-visible:ring-1 focus-visible:ring-brass/30"
                      />
                    </label>
                    <button type="submit" className="h-12 rounded-full border border-brass/60 text-sm text-brass font-medium transition-all hover:bg-brass/10">
                      اعتماد هذا البدء
                    </button>
                  </form>
                ) : null}
              </>
            ) : null}

            {view.slippedToday ? (
              <button
                type="button"
                onClick={() => {
                  setData(undoSlip(data, today));
                  setFlameError(null);
                }}
                className="h-12 rounded-full border border-brass/60 text-sm text-brass font-medium transition-all hover:bg-brass/10"
              >
                تراجع — أعد الشعلة
              </button>
            ) : null}

            {view.alive && view.canCorrect ? (
              <button
                type="button"
                onClick={() => {
                  setStartAsk((open) => !open);
                  setStartDate(view.anchor ?? today);
                  setFlameError(null);
                }}
                className="h-11 text-sm text-clay transition-colors hover:text-ivory"
              >
                تصحيح البداية، هذا اليوم فقط
              </button>
            ) : null}
            {view.alive && view.canCorrect && startAsk ? (
              <form
                className="flex flex-col gap-3 rounded-2xl gradient-card border border-line/30 p-4 animate-scale-in"
                onSubmit={(event) => {
                  event.preventDefault();
                  light(startDate);
                }}
              >
                <input
                  type="date"
                  max={today}
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  aria-label="تاريخ بداية الشعلة"
                  className="h-12 rounded-xl border border-line/40 bg-surface/50 px-4 text-base outline-none transition-all focus-visible:border-brass focus-visible:ring-1 focus-visible:ring-brass/30"
                />
                <button type="submit" className="h-12 rounded-full border border-brass/60 text-sm text-brass font-medium transition-all hover:bg-brass/10">
                  حدّث البداية
                </button>
              </form>
            ) : null}

            {view.alive ? (
              wasteAsk ? (
                <div className="rounded-2xl gradient-card border border-line/30 p-4 animate-scale-in">
                  <p className="text-sm leading-relaxed text-clay">
                    إطفاء اليوم يُسقطه من السلسلة. الأيام التي قبله تبقى في رصيدك.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWasteAsk(false)}
                      className="h-12 flex-1 rounded-full border border-line/40 text-sm transition-colors hover:bg-surface"
                    >
                      أبقِها
                    </button>
                    <button
                      type="button"
                      data-testid="confirm-slip"
                      onClick={() => {
                        setData(slipFlame(data, today));
                        setWasteAsk(false);
                        setFlameError(null);
                      }}
                      className="h-12 flex-1 rounded-full bg-rose/20 text-sm font-medium text-rose transition-colors hover:bg-rose/30"
                    >
                      نعم، انطفأت
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setWasteAsk(true)} className="h-11 text-sm text-clay transition-colors hover:text-rose">
                  ضاع الوقت اليوم
                </button>
              )
            ) : null}
            {flameError ? (
              <p role="alert" className="rounded-xl bg-rose/10 px-4 py-2.5 text-center text-sm text-rose">
                {flameError}
              </p>
            ) : null}
          </div>
        </section>

        {/* ─── Today's Tasks ─── */}
        <section aria-labelledby="today-heading" className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between gap-3">
            <h2 id="today-heading" className="text-lg font-semibold flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-ember" />
              عهد اليوم
            </h2>
            {todayPlan ? (
              <span className="flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1 text-xs text-clay">
                <Lock className="size-3" />
                مقفل
              </span>
            ) : null}
          </div>
          {todayPlan ? (
            <TodayCard plan={todayPlan} today={today} onToggle={(taskId) => setData(toggleTask(data, today, today, taskId))} />
          ) : (
            <div className="rounded-2xl border border-dashed border-line/30 px-5 py-6 text-center">
              <Calendar className="mx-auto size-8 text-clay/30 mb-3" />
              <p className="text-sm leading-relaxed text-clay">
                لا عهد لهذا اليوم. اكتب مهام الغد قبل أن يأتي.
              </p>
            </div>
          )}
        </section>

        {/* ─── Upcoming ─── */}
        <section aria-labelledby="upcoming-heading" className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <h2 id="upcoming-heading" className="text-lg font-semibold flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-brass" />
            قادم
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm leading-relaxed text-clay/70">لا عهود تنتظر. اليوم القادم ما زال صفحة بيضاء.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {upcoming.map((plan, i) => (
                <li key={plan.id} className="animate-slide-up" style={{ animationDelay: `${(i + 1) * 80}ms` }}>
                  <button
                    type="button"
                    onClick={() => openSheet(plan.date)}
                    className="group flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl gradient-card border border-line/30 px-4 py-3 text-start transition-all hover:border-brass/30 hover:shadow-md hover:shadow-brass/5"
                  >
                    <span>
                      <span className="block text-base font-medium">{relativeDay(plan.date, today)}</span>
                      <span className="mt-1 flex items-center gap-2 text-sm text-clay">
                        <span>{formatDay(plan.date)}</span>
                        <span className="text-line">·</span>
                        <span>{taskCountPhrase(plan.tasks.length)}</span>
                        {plan.tasks.some((t) => t.time) ? (
                          <>
                            <span className="text-line">·</span>
                            <Clock className="size-3 text-clay/60" />
                          </>
                        ) : null}
                      </span>
                    </span>
                    <span className="text-sm text-brass opacity-0 transition-opacity group-hover:opacity-100">تعديل</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ─── History ─── */}
        <section aria-labelledby="history-heading" className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <h2 id="history-heading" className="text-lg font-semibold flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-clay/60" />
            السجل
          </h2>
          {history.length === 0 ? (
            <p className="text-sm leading-relaxed text-clay/70">
              حين ينتهي يوم العهد يغادر الواجهة ويبقى هنا، بما أُنجز وما لم يُنجز.
            </p>
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {shownHistory.map((plan, i) => (
                  <HistoryCard key={plan.id} plan={plan} today={today} index={i} />
                ))}
              </ul>
              {history.length > 4 ? (
                <button
                  type="button"
                  onClick={() => setShowAllHistory((open) => !open)}
                  className="flex h-11 items-center justify-center gap-1.5 text-sm text-clay transition-colors hover:text-ivory"
                >
                  {showAllHistory ? (
                    <>
                      <ChevronUp className="size-4" />
                      أخفِ الأقدم
                    </>
                  ) : (
                    <>
                      <ChevronDown className="size-4" />
                      أظهر الباقي · {toAr(history.length - 4)}
                    </>
                  )}
                </button>
              ) : null}
            </>
          )}
        </section>

        {/* Footer note */}
        <p className="text-center text-xs leading-relaxed text-clay/50 mt-2">
          يبقى هذا السجل على جهازك، حتى بعد إغلاق الصفحة.
        </p>
      </main>

      {/* ─── FAB ─── */}
      {sheetDate ? null : (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-ink via-ink/95 to-transparent pt-8">
          <div className="mx-auto w-full max-w-md px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              data-testid="open-plan"
              onClick={() => openSheet()}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl gradient-ember text-base font-semibold text-ink shadow-xl shadow-ember/25 transition-all hover:shadow-2xl hover:shadow-ember/35 active:scale-[0.98]"
            >
              <Plus className="size-5" strokeWidth={2.5} />
              خطّط ليومٍ قادم
            </button>
          </div>
        </div>
      )}

      {/* ─── Plan sheet ─── */}
      {sheetDate ? (
        <PlanSheet
          today={today}
          plans={data.plans}
          initialDate={sheetDate}
          onClose={() => setSheetDate(null)}
          onSave={(date, tasks) => {
            const result = savePlan(data, today, date, tasks);
            setData(result.data);
            return result.error;
          }}
          onDelete={(date) => setData(removePlan(data, today, date))}
        />
      ) : null}
    </div>
  );
}

/* ─── Today Card ─── */
function TodayCard({ plan, today, onToggle }: { plan: DayPlan; today: string; onToggle: (taskId: string) => void }) {
  const { done, total } = doneCount(plan);
  const ratio = total === 0 ? 0 : done / total;
  const sortedTasks = sortByTime(plan.tasks);
  const allDone = done === total && total > 0;
  
  return (
    <div className={clsx(
      "rounded-2xl border bg-panel p-4 transition-all duration-300",
      allDone ? "border-success/30 shadow-lg shadow-success/5" : "border-line/30",
    )}>
      {/* Progress header */}
      <div className="flex items-center justify-between px-1 pb-3">
        <p className="text-sm text-clay">
          {toAr(done)} من {toAr(total)}
        </p>
        <p className={clsx(
          "text-sm font-medium",
          allDone ? "text-success" : "text-brass",
        )}>
          {allDone ? "✓ وُفي" : "يوم التنفيذ"}
        </p>
      </div>
      
      {/* Progress bar */}
      <div className="mx-1 mb-4 h-1.5 overflow-hidden rounded-full bg-line/20">
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-700 ease-out animate-progress-fill",
            allDone ? "bg-success" : "gradient-brass",
          )}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>

      {/* Task list */}
      <ul className="flex flex-col gap-1">
        {sortedTasks.map((task) => (
          <li key={task.id}>
            <button
              type="button"
              data-testid="today-task"
              aria-pressed={task.done}
              onClick={() => onToggle(task.id)}
              className="group flex min-h-12 w-full items-start gap-3 rounded-xl px-2 py-2 text-start transition-all hover:bg-surface/50"
            >
              <span
                className={clsx(
                  "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-200",
                  task.done
                    ? "border-success bg-success text-ink animate-check-pop"
                    : "border-clay/30 group-hover:border-clay/60",
                )}
              >
                {task.done ? <Check className="size-3.5" strokeWidth={3} /> : null}
              </span>
              <div className="flex-1 min-w-0">
                <span className={clsx(
                  "text-base leading-snug break-words transition-all duration-200",
                  task.done && "text-clay/60 line-through",
                )}>
                  {task.title}
                </span>
                {task.time ? (
                  <div className="mt-1.5 flex flex-col gap-1">
                    <TimeRunner time={task.time} today={today} done={task.done} />
                    <TimeProgressBar time={task.time} today={today} done={task.done} />
                  </div>
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── History Card ─── */
function HistoryCard({ plan, today, index }: { plan: DayPlan; today: string; index: number }) {
  const { done, total } = doneCount(plan);
  const ratio = total === 0 ? 0 : done / total;
  const allDone = done === total && total > 0;
  const verdict = allDone ? "عهدٌ وُفي" : done === 0 ? "لم يُنجز شيء" : "أُنجز بعضه";
  
  return (
    <li
      className="rounded-2xl gradient-card border border-line/20 px-4 py-4 animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-medium">{relativeDay(plan.date, today)}</h3>
        <div className="flex items-center gap-2">
          {/* Mini progress ring */}
          <svg className="size-5" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-line/20" />
            <circle
              cx="10" cy="10" r="8" fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${ratio * 50.27} 50.27`}
              transform="rotate(-90 10 10)"
              className={clsx(allDone ? "text-success" : done === 0 ? "text-clay/30" : "text-brass")}
              stroke="currentColor"
            />
          </svg>
          <p className="text-sm text-clay">
            {toAr(done)}/{toAr(total)}
          </p>
        </div>
      </div>
      <p className="mt-0.5 text-xs text-clay/60">{formatDay(plan.date)}</p>
      <ul className="mt-3 flex flex-col gap-1.5">
        {plan.tasks.map((task) => (
          <li key={task.id} className="flex items-start gap-2 text-sm leading-snug">
            {task.done ? (
              <Check className="mt-0.5 size-4 shrink-0 text-success" />
            ) : (
              <Circle className="mt-0.5 size-4 shrink-0 text-clay/40" />
            )}
            <div className="flex-1 min-w-0">
              <span className={clsx("break-words", task.done ? "text-ivory/80" : "text-clay/60")}>{task.title}</span>
              {task.time ? (
                <span className="mr-2 text-xs text-clay/40">
                  {formatTime(task.time)}
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      <p className={clsx(
        "mt-3 text-sm font-medium",
        allDone ? "text-success" : done === 0 ? "text-clay/50" : "text-brass",
      )}>{verdict}</p>
    </li>
  );
}
