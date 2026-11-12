import { useEffect, useId, useState } from "react";
import { Plus, Trash2, Clock, X } from "lucide-react";
import { clsx } from "clsx";
import {
  MAX_TASKS,
  addDays,
  formatDay,
  type DayPlan,
  type DraftTask,
} from "@/lib/waqd";

type Props = {
  today: string;
  plans: DayPlan[];
  initialDate: string;
  onClose: () => void;
  onSave: (date: string, tasks: DraftTask[]) => string | null;
  onDelete: (date: string) => void;
};

function draftsFrom(plan: DayPlan | undefined): DraftTask[] {
  if (!plan || plan.tasks.length === 0) return [{ id: crypto.randomUUID(), title: "", time: undefined }];
  return plan.tasks.map((task) => ({ id: task.id, title: task.title, time: task.time }));
}

export function PlanSheet({ today, plans, initialDate, onClose, onSave, onDelete }: Props) {
  const titleId = useId();
  const tomorrow = addDays(today, 1);
  const existingAt = (date: string) => plans.find((plan) => plan.date === date);
  const [date, setDate] = useState(initialDate > today ? initialDate : tomorrow);
  const [tasks, setTasks] = useState<DraftTask[]>(() => draftsFrom(existingAt(initialDate)));
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const locked = date <= today;
  const existing = existingAt(date);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function applyDate(next: string) {
    if (!next || next <= today) return;
    setDate(next);
    setTasks(draftsFrom(existingAt(next)));
    setError(null);
    setConfirmDelete(false);
  }

  function updateTitle(id: string, title: string) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, title } : task)));
  }

  function updateTime(id: string, time: string) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, time: time || undefined } : task)));
  }

  function addTask() {
    setTasks((current) =>
      current.length >= MAX_TASKS ? current : [...current, { id: crypto.randomUUID(), title: "", time: undefined }],
    );
  }

  function removeTask(id: string) {
    setTasks((current) => {
      const next = current.filter((task) => task.id !== id);
      return next.length > 0 ? next : [{ id: crypto.randomUUID(), title: "", time: undefined }];
    });
  }

  function submit() {
    const result = onSave(date, tasks);
    if (result) {
      setError(result);
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6 animate-fade-in">
      <button type="button" className="absolute inset-0 bg-ink/80 backdrop-blur-sm" aria-label="إغلاق النافذة" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(92dvh,42rem)] w-full max-w-md flex-col rounded-t-3xl border border-line/50 bg-panel shadow-2xl sm:rounded-3xl animate-slide-in-bottom"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
          <div>
            <h2 id={titleId} className="font-display text-3xl leading-tight">
              {existing ? "تعديل العهد" : "عهدٌ جديد"}
            </h2>
            <p className="mt-1 text-sm text-clay">يُكتب قبل اليوم، ويُقفل حين يحين.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-line/50 text-clay transition-colors hover:bg-surface hover:text-ivory"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto px-5 pb-4">
          {/* Date picker */}
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-clay font-medium">اليوم المعني</span>
            <input
              type="date"
              min={tomorrow}
              value={date}
              onChange={(event) => applyDate(event.target.value)}
              className="h-12 rounded-2xl border border-line/50 bg-surface/50 px-4 text-base text-ivory outline-none transition-all focus-visible:border-brass focus-visible:ring-1 focus-visible:ring-brass/30"
            />
            <span className="text-brass-dim text-xs font-medium">{formatDay(date)}</span>
          </label>

          {locked ? (
            <p className="rounded-2xl gradient-card border border-line/50 px-4 py-3 text-sm text-brass" role="status">
              حلّ هذا الموعد. لم يعد التعديل ممكناً.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {tasks.map((task, index) => (
                <li key={task.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex flex-col gap-2 rounded-2xl border border-line/30 bg-surface/30 p-3 transition-all hover:border-line/60">
                    {/* Task title input */}
                    <div className="flex items-center gap-2">
                      <div className="grid size-6 shrink-0 place-items-center rounded-full border border-clay/40">
                        <span className="text-xs text-clay">{index + 1}</span>
                      </div>
                      <input
                        value={task.title}
                        maxLength={140}
                        onChange={(event) => updateTitle(task.id, event.target.value)}
                        placeholder={index === 0 ? "مثال: قراءة أربعين صفحة" : "مهمة أخرى"}
                        aria-label={`المهمة ${index + 1}`}
                        className="h-10 min-w-0 flex-1 rounded-xl bg-transparent px-2 text-base text-ivory outline-none placeholder:text-clay/50 focus-visible:ring-0"
                      />
                      <button
                        type="button"
                        aria-label="حذف المهمة"
                        onClick={() => removeTask(task.id)}
                        className="grid size-9 shrink-0 place-items-center rounded-xl text-clay/60 transition-colors hover:bg-rose/10 hover:text-rose"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    {/* Time picker */}
                    <div className="flex items-center gap-2 px-8">
                      <Clock className="size-3.5 text-clay/60" />
                      <input
                        type="time"
                        value={task.time ?? ""}
                        onChange={(event) => updateTime(task.id, event.target.value)}
                        aria-label={`وقت المهمة ${index + 1}`}
                        className="h-8 rounded-lg bg-transparent px-2 text-sm text-clay outline-none transition-colors focus-visible:text-ivory"
                      />
                      {task.time ? (
                        <button
                          type="button"
                          onClick={() => updateTime(task.id, "")}
                          className="text-xs text-clay/50 hover:text-clay transition-colors"
                        >
                          مسح
                        </button>
                      ) : (
                        <span className="text-xs text-clay/40">اختياري</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!locked && tasks.length < MAX_TASKS ? (
            <button
              type="button"
              onClick={addTask}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-dashed border-line/40 text-sm text-clay transition-all hover:border-brass/40 hover:text-brass"
            >
              <Plus className="size-4" />
              أضف مهمة
            </button>
          ) : null}
          {!locked && tasks.length >= MAX_TASKS ? (
            <p className="text-center text-sm text-clay/70">ثمانية تكفي ليومٍ واحد.</p>
          ) : null}
          {error ? (
            <p role="alert" className="rounded-xl bg-rose/10 px-4 py-2.5 text-center text-sm text-rose">
              {error}
            </p>
          ) : null}
        </div>

        {/* Footer actions */}
        <div className="flex shrink-0 flex-col gap-2 border-t border-line/30 px-5 py-4">
          <button
            type="button"
            data-testid="save-plan"
            disabled={locked}
            onClick={submit}
            className="h-12 rounded-full gradient-ember text-base font-semibold text-ink shadow-lg shadow-ember/20 transition-all hover:shadow-xl hover:shadow-ember/30 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
          >
            {existing ? "حدّث العهد" : "احفظ العهد"}
          </button>
          {existing && !locked ? (
            confirmDelete ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="h-12 flex-1 rounded-full border border-line/50 text-sm transition-colors hover:bg-surface"
                >
                  إبقاء
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(date);
                    onClose();
                  }}
                  className="h-12 flex-1 rounded-full border border-rose/50 text-sm text-rose transition-colors hover:bg-rose/10"
                >
                  احذف العهد
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="h-11 text-sm text-clay transition-colors hover:text-rose"
              >
                احذف هذا العهد
              </button>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
