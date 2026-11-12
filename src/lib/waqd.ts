export type Task = {
  id: string;
  title: string;
  done: boolean;
  time?: string; // HH:MM format
};

export type DayPlan = {
  id: string;
  date: string;
  tasks: Task[];
  createdAt: string;
};

export type Run = {
  id: string;
  start: string;
  end: string | null;
  openedOn: string;
};

export type Flame = {
  runs: Run[];
  slips: string[];
  undo: null | { runs: Run[]; slips: string[] };
};

export type StoreData = {
  flame: Flame;
  plans: DayPlan[];
};

export type DraftTask = { id: string; title: string; time?: string };

export type FlameView = {
  count: number;
  alive: boolean;
  best: number;
  total: number;
  level: 0 | 1 | 2 | 3 | 4;
  slippedToday: boolean;
  canCorrect: boolean;
  anchor: string | null;
  copy: string;
};

export const STORAGE_KEY = "waqd.v1";
export const MAX_TASKS = 8;

// Use Western/French digits
const AR_DIGITS: string[] | null = null;
const WEEKDAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const WEEK_LETTER = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
const MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function toAr(n: number): string {
  return String(n);
}

export function dateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function addDays(key: string, n: number): string {
  const dt = parseKey(key);
  dt.setDate(dt.getDate() + n);
  return dateKey(dt);
}

export function diffDays(a: string, b: string): number {
  const ms = parseKey(b).getTime() - parseKey(a).getTime();
  return Math.round(ms / 86_400_000);
}

export function weekdayLetter(key: string): string {
  return WEEK_LETTER[parseKey(key).getDay()] ?? "";
}

export function formatDay(key: string): string {
  const dt = parseKey(key);
  const name = WEEKDAYS[dt.getDay()] ?? "";
  const month = MONTHS[dt.getMonth()] ?? "";
  return `${name} ${toAr(dt.getDate())} ${month}`;
}

export function relativeDay(key: string, today: string): string {
  if (key === today) return "اليوم";
  if (key === addDays(today, 1)) return "غداً";
  if (key === addDays(today, -1)) return "أمس";
  return formatDay(key);
}

export function taskCountPhrase(n: number): string {
  if (n === 0) return "لا مهام";
  if (n === 1) return "مهمة واحدة";
  if (n === 2) return "مهمتان";
  if (n >= 3 && n <= 10) return `${toAr(n)} مهام`;
  return `${toAr(n)} مهمة`;
}

export function emptyFlame(): Flame {
  return { runs: [], slips: [], undo: null };
}

export function emptyStore(): StoreData {
  return { flame: emptyFlame(), plans: [] };
}

export function openRun(flame: Flame): Run | null {
  return flame.runs.find((run) => run.end === null) ?? null;
}

export function runLength(run: Run, today: string): number {
  const end = run.end ?? today;
  if (end < run.start) return 0;
  return diffDays(run.start, end) + 1;
}

function levelFor(count: number, alive: boolean): 0 | 1 | 2 | 3 | 4 {
  if (!alive || count <= 0) return 0;
  if (count < 3) return 1;
  if (count < 7) return 2;
  if (count < 21) return 3;
  return 4;
}

function flameCopy(count: number, alive: boolean, slippedToday: boolean, ever: boolean): string {
  if (slippedToday) return "اعترفت باليوم. هذا أصدق من شعلة كاذبة.";
  if (!alive && !ever) return "لم تُشعل بعد. يومٌ واحد يكفي ليبدأ الوهج.";
  if (!alive) return "الرماد بارد، والبدء من جديد ما زال متاحاً.";
  if (count <= 1) return "اشتعلت. كل يوم يمر دون إطفاء يعلو به الوهج.";
  if (count === 2) return "يومان. الاستمرار أثقل من البدء، وأنت فيه.";
  if (count < 7) return "الوقت يعود إليك ما دامت الشعلة فوق الرماد.";
  if (count === 7) return "أسبوع بلا تفاهة. هذا لم يعد صدفة.";
  if (count < 30) return "صرت من يحرس وقته. لا تُطفئ ما طال.";
  return "شعلة طويلة. إطفاؤها الآن أغلى من إبقائها.";
}

export function describeFlame(flame: Flame, today: string): FlameView {
  const slippedToday = flame.slips.includes(today);
  const current = openRun(flame);
  const count = current && !slippedToday ? runLength(current, today) : 0;
  const alive = count > 0;
  const lengths = flame.runs.map((run) => runLength(run, today));
  const best = lengths.reduce((max, n) => Math.max(max, n), 0);
  const total = lengths.reduce((sum, n) => sum + n, 0);
  const ever = flame.runs.length > 0 || flame.slips.length > 0;
  return {
    count,
    alive,
    best,
    total,
    level: levelFor(count, alive),
    slippedToday,
    canCorrect: Boolean(current && current.openedOn === today && !slippedToday),
    anchor: current?.start ?? null,
    copy: flameCopy(count, alive, slippedToday, ever),
  };
}

export type DayMark = "clean" | "slip" | "idle";

export function dayMark(flame: Flame, key: string, today: string): DayMark {
  if (key > today) return "idle";
  if (flame.slips.includes(key)) return "slip";
  for (const run of flame.runs) {
    const end = run.end ?? today;
    if (key >= run.start && key <= end) return "clean";
  }
  return "idle";
}

export function recentDays(today: string, span = 7): string[] {
  const days: string[] = [];
  for (let i = span - 1; i >= 0; i -= 1) days.push(addDays(today, -i));
  return days;
}

function latestClosedEnd(runs: Run[]): string {
  return runs.reduce((max, run) => (run.end && run.end > max ? run.end : max), "");
}

function rangeHitsSlip(slips: string[], start: string, today: string): boolean {
  return slips.some((slip) => slip >= start && slip <= today);
}

export function lightFlame(data: StoreData, today: string, start: string): { data: StoreData; error: string | null } {
  if (!DATE_RE.test(start) || start > today) {
    return { data, error: "اختر يوماً حلّ بالفعل." };
  }
  if (openRun(data.flame)) return { data, error: null };
  if (data.flame.slips.includes(today)) {
    return { data, error: "اليوم انطفأ. التراجع يعيد الشعلة كما كانت." };
  }
  const floor = latestClosedEnd(data.flame.runs);
  if (floor && start <= floor) {
    return { data, error: "البداية بعد آخر يومٍ أُغلقت فيه الشعلة." };
  }
  if (rangeHitsSlip(data.flame.slips, start, today)) {
    return { data, error: "في هذه المدة يومٌ انطفأت فيه." };
  }
  const run: Run = { id: crypto.randomUUID(), start, end: null, openedOn: today };
  return {
    data: { ...data, flame: { ...data.flame, undo: null, runs: [...data.flame.runs, run] } },
    error: null,
  };
}

export function correctStart(data: StoreData, today: string, start: string): { data: StoreData; error: string | null } {
  const current = openRun(data.flame);
  if (!current || current.openedOn !== today) {
    return { data, error: "لم يعد تصحيح البداية متاحاً." };
  }
  if (!DATE_RE.test(start) || start > today) {
    return { data, error: "اختر يوماً حلّ بالفعل." };
  }
  const others = data.flame.runs.filter((run) => run.id !== current.id);
  const floor = latestClosedEnd(others);
  if (floor && start <= floor) {
    return { data, error: "البداية بعد آخر يومٍ أُغلقت فيه الشعلة." };
  }
  if (rangeHitsSlip(data.flame.slips, start, today)) {
    return { data, error: "في هذه المدة يومٌ انطفأت فيه." };
  }
  return {
    data: {
      ...data,
      flame: {
        ...data.flame,
        runs: data.flame.runs.map((run) => (run.id === current.id ? { ...run, start } : run)),
      },
    },
    error: null,
  };
}

export function slipFlame(data: StoreData, today: string): StoreData {
  const current = openRun(data.flame);
  if (!current || data.flame.slips.includes(today)) return data;
  const undo = {
    runs: data.flame.runs.map((run) => ({ ...run })),
    slips: [...data.flame.slips],
  };
  const yesterday = addDays(today, -1);
  const runs =
    current.start > yesterday
      ? data.flame.runs.filter((run) => run.id !== current.id)
      : data.flame.runs.map((run) => (run.id === current.id ? { ...run, end: yesterday } : run));
  return {
    ...data,
    flame: { runs, slips: [...data.flame.slips, today], undo },
  };
}

export function undoSlip(data: StoreData, today: string): StoreData {
  if (!data.flame.undo || !data.flame.slips.includes(today)) return data;
  return {
    ...data,
    flame: {
      runs: data.flame.undo.runs.map((run) => ({ ...run })),
      slips: [...data.flame.undo.slips],
      undo: null,
    },
  };
}

export function splitPlans(plans: DayPlan[], today: string) {
  const todayPlan = plans.find((plan) => plan.date === today) ?? null;
  const upcoming = plans.filter((plan) => plan.date > today).sort((a, b) => (a.date < b.date ? -1 : 1));
  const history = plans.filter((plan) => plan.date < today).sort((a, b) => (a.date < b.date ? 1 : -1));
  return { todayPlan, upcoming, history };
}

export function doneCount(plan: DayPlan): { done: number; total: number } {
  return {
    done: plan.tasks.filter((task) => task.done).length,
    total: plan.tasks.length,
  };
}

export function savePlan(
  data: StoreData,
  today: string,
  date: string,
  drafts: DraftTask[],
): { data: StoreData; error: string | null } {
  if (!DATE_RE.test(date) || date <= today) {
    return { data, error: "التعديل يُغلق حين يحين اليوم." };
  }
  const titles = drafts
    .map((task) => ({ id: task.id, title: task.title.trim().slice(0, 140), time: task.time }))
    .filter((task) => task.title)
    .slice(0, MAX_TASKS);
  if (titles.length === 0) return { data, error: "اكتب مهمة واحدة على الأقل." };
  const existing = data.plans.find((plan) => plan.date === date);
  const plan: DayPlan = {
    id: existing?.id ?? crypto.randomUUID(),
    date,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    tasks: titles.map((task) => ({
      id: task.id || crypto.randomUUID(),
      title: task.title,
      done: false,
      time: task.time,
    })),
  };
  return {
    data: { ...data, plans: [...data.plans.filter((item) => item.date !== date), plan] },
    error: null,
  };
}

export function removePlan(data: StoreData, today: string, date: string): StoreData {
  const plan = data.plans.find((item) => item.date === date);
  if (!plan || plan.date <= today) return data;
  return { ...data, plans: data.plans.filter((item) => item.date !== date) };
}

export function toggleTask(data: StoreData, today: string, date: string, taskId: string): StoreData {
  return {
    ...data,
    plans: data.plans.map((plan) => {
      if (plan.date !== date || plan.date !== today) return plan;
      return {
        ...plan,
        tasks: plan.tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)),
      };
    }),
  };
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") return false;
  const task = value as Task;
  return typeof task.id === "string" && typeof task.title === "string" && typeof task.done === "boolean" && (task.time === undefined || typeof task.time === "string");
}

function isPlan(value: unknown): value is DayPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as DayPlan;
  return (
    typeof plan.id === "string" &&
    typeof plan.date === "string" &&
    DATE_RE.test(plan.date) &&
    typeof plan.createdAt === "string" &&
    Array.isArray(plan.tasks) &&
    plan.tasks.every(isTask)
  );
}

function isRun(value: unknown): value is Run {
  if (!value || typeof value !== "object") return false;
  const run = value as Run;
  return (
    typeof run.id === "string" &&
    typeof run.start === "string" &&
    DATE_RE.test(run.start) &&
    (run.end === null || (typeof run.end === "string" && DATE_RE.test(run.end))) &&
    typeof run.openedOn === "string" &&
    DATE_RE.test(run.openedOn)
  );
}

export function sanitize(raw: unknown): StoreData {
  if (!raw || typeof raw !== "object") return emptyStore();
  const source = raw as { flame?: unknown; plans?: unknown };
  const flameRaw = source.flame;
  let flame = emptyFlame();
  if (flameRaw && typeof flameRaw === "object") {
    const candidate = flameRaw as Flame;
    const runs = Array.isArray(candidate.runs) ? candidate.runs.filter(isRun) : [];
    const slips = Array.isArray(candidate.slips)
      ? [...new Set(candidate.slips.filter((slip): slip is string => typeof slip === "string" && DATE_RE.test(slip)))]
      : [];
    let openSeen = false;
    const normalized: Run[] = [];
    for (const run of runs) {
      if (run.end === null) {
        if (openSeen) continue;
        openSeen = true;
      }
      normalized.push(run);
    }
    const undo =
      candidate.undo && typeof candidate.undo === "object" && Array.isArray(candidate.undo.runs)
        ? {
            runs: candidate.undo.runs.filter(isRun),
            slips: Array.isArray(candidate.undo.slips)
              ? candidate.undo.slips.filter((slip): slip is string => typeof slip === "string" && DATE_RE.test(slip))
              : [],
          }
        : null;
    flame = { runs: normalized, slips, undo };
  }
  const plans = Array.isArray(source.plans) ? source.plans.filter(isPlan) : [];
  const byDate = new Map<string, DayPlan>();
  for (const plan of plans) {
    const prev = byDate.get(plan.date);
    if (!prev || prev.createdAt <= plan.createdAt) {
      byDate.set(plan.date, {
        ...plan,
        tasks: plan.tasks.slice(0, MAX_TASKS).map((task) => ({ ...task, title: task.title.slice(0, 140) })),
      });
    }
  }
  return { flame, plans: [...byDate.values()] };
}

export function loadStore(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    return sanitize(JSON.parse(raw) as unknown);
  } catch {
    return emptyStore();
  }
}

export function saveStore(data: StoreData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Format HH:MM to Arabic 12h format with French digits */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (h === undefined || m === undefined) return "";
  const period = h >= 12 ? "م" : "ص";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Get time remaining for a task scheduled today, returns { hours, minutes, isOverdue, totalMinutes } */
export function timeRemaining(time: string, todayKey: string): { hours: number; minutes: number; isOverdue: boolean; totalMinutes: number; percent: number } {
  const [h, m] = time.split(":").map(Number);
  if (h === undefined || m === undefined) return { hours: 0, minutes: 0, isOverdue: false, totalMinutes: 0, percent: 0 };
  const now = new Date();
  const nowKey = dateKey(now);
  if (nowKey !== todayKey) return { hours: h, minutes: m, isOverdue: false, totalMinutes: h * 60 + m, percent: 0 };
  const targetMinutes = h * 60 + m;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const diff = targetMinutes - nowMinutes;
  if (diff <= 0) return { hours: 0, minutes: 0, isOverdue: true, totalMinutes: 0, percent: 100 };
  const dayProgress = Math.min(100, Math.max(0, ((nowMinutes) / targetMinutes) * 100));
  return {
    hours: Math.floor(diff / 60),
    minutes: diff % 60,
    isOverdue: false,
    totalMinutes: diff,
    percent: dayProgress,
  };
}

/** Sort tasks by time, those without time go last */
export function sortByTime(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (!a.time && !b.time) return 0;
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });
}
