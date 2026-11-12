import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Circle, i as Lock, n as Trash2, o as Check, r as Plus } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CIkrSh5T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HEIGHT = {
	0: "h-28",
	1: "h-32",
	2: "h-40",
	3: "h-48",
	4: "h-56"
};
function FlameMark({ level, alive }) {
	const hot = alive && level > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none relative grid place-items-center",
		"aria-hidden": "true",
		children: [hot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ember-glow absolute size-36 rounded-full bg-ember/25 blur-3xl" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 120 160",
			className: clsx("relative w-auto", HEIGHT[level]),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "60",
					cy: "148",
					rx: "22",
					ry: "6",
					className: hot ? "fill-ember/50" : "fill-line"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					className: clsx(hot ? "flame-outer fill-ember" : "fill-clay/40"),
					d: "M60 146c-22 0-40-20-36-48 3-22-4-34 4-50 6-14 14-22 10-36 8 16 14 18 22 16 8 2 14 0 22-16-4 14 4 22 10 36 8 16 1 28 4 50 4 28-14 48-36 48z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					className: clsx(hot ? "flame-inner fill-brass" : "fill-clay/25"),
					d: "M60 128c-14-2-26-18-22-40 3-16-2-24 4-36 6 10 12 12 18 10 6 2 12 0 18-10 6 12 1 20 4 36 4 22-8 38-22 40z"
				}),
				hot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					className: "fill-ivory",
					d: "M60 108c-6 2-10 12-8 24 6-8 10-8 16 0 2-12-2-22-8-24z"
				}) : null
			]
		})]
	});
}
var STORAGE_KEY = "waqd.v1";
var AR_DIGITS = [
	"٠",
	"١",
	"٢",
	"٣",
	"٤",
	"٥",
	"٦",
	"٧",
	"٨",
	"٩"
];
var WEEKDAYS = [
	"الأحد",
	"الإثنين",
	"الثلاثاء",
	"الأربعاء",
	"الخميس",
	"الجمعة",
	"السبت"
];
var WEEK_LETTER = [
	"ح",
	"ن",
	"ث",
	"ر",
	"خ",
	"ج",
	"س"
];
var MONTHS = [
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
	"ديسمبر"
];
var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function toAr(n) {
	return String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)] ?? d);
}
function dateKey(d = /* @__PURE__ */ new Date()) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseKey(key) {
	const [y, m, d] = key.split("-").map(Number);
	return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}
function addDays(key, n) {
	const dt = parseKey(key);
	dt.setDate(dt.getDate() + n);
	return dateKey(dt);
}
function diffDays(a, b) {
	const ms = parseKey(b).getTime() - parseKey(a).getTime();
	return Math.round(ms / 864e5);
}
function weekdayLetter(key) {
	return WEEK_LETTER[parseKey(key).getDay()] ?? "";
}
function formatDay(key) {
	const dt = parseKey(key);
	const name = WEEKDAYS[dt.getDay()] ?? "";
	const month = MONTHS[dt.getMonth()] ?? "";
	return `${name} ${toAr(dt.getDate())} ${month}`;
}
function relativeDay(key, today) {
	if (key === today) return "اليوم";
	if (key === addDays(today, 1)) return "غداً";
	if (key === addDays(today, -1)) return "أمس";
	return formatDay(key);
}
function taskCountPhrase(n) {
	if (n === 0) return "لا مهام";
	if (n === 1) return "مهمة واحدة";
	if (n === 2) return "مهمتان";
	if (n >= 3 && n <= 10) return `${toAr(n)} مهام`;
	return `${toAr(n)} مهمة`;
}
function emptyFlame() {
	return {
		runs: [],
		slips: [],
		undo: null
	};
}
function emptyStore() {
	return {
		flame: emptyFlame(),
		plans: []
	};
}
function openRun(flame) {
	return flame.runs.find((run) => run.end === null) ?? null;
}
function runLength(run, today) {
	const end = run.end ?? today;
	if (end < run.start) return 0;
	return diffDays(run.start, end) + 1;
}
function levelFor(count, alive) {
	if (!alive || count <= 0) return 0;
	if (count < 3) return 1;
	if (count < 7) return 2;
	if (count < 21) return 3;
	return 4;
}
function flameCopy(count, alive, slippedToday, ever) {
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
function describeFlame(flame, today) {
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
		copy: flameCopy(count, alive, slippedToday, ever)
	};
}
function dayMark(flame, key, today) {
	if (key > today) return "idle";
	if (flame.slips.includes(key)) return "slip";
	for (const run of flame.runs) {
		const end = run.end ?? today;
		if (key >= run.start && key <= end) return "clean";
	}
	return "idle";
}
function recentDays(today, span = 7) {
	const days = [];
	for (let i = span - 1; i >= 0; i -= 1) days.push(addDays(today, -i));
	return days;
}
function latestClosedEnd(runs) {
	return runs.reduce((max, run) => run.end && run.end > max ? run.end : max, "");
}
function rangeHitsSlip(slips, start, today) {
	return slips.some((slip) => slip >= start && slip <= today);
}
function lightFlame(data, today, start) {
	if (!DATE_RE.test(start) || start > today) return {
		data,
		error: "اختر يوماً حلّ بالفعل."
	};
	if (openRun(data.flame)) return {
		data,
		error: null
	};
	if (data.flame.slips.includes(today)) return {
		data,
		error: "اليوم انطفأ. التراجع يعيد الشعلة كما كانت."
	};
	const floor = latestClosedEnd(data.flame.runs);
	if (floor && start <= floor) return {
		data,
		error: "البداية بعد آخر يومٍ أُغلقت فيه الشعلة."
	};
	if (rangeHitsSlip(data.flame.slips, start, today)) return {
		data,
		error: "في هذه المدة يومٌ انطفأت فيه."
	};
	const run = {
		id: crypto.randomUUID(),
		start,
		end: null,
		openedOn: today
	};
	return {
		data: {
			...data,
			flame: {
				...data.flame,
				undo: null,
				runs: [...data.flame.runs, run]
			}
		},
		error: null
	};
}
function correctStart(data, today, start) {
	const current = openRun(data.flame);
	if (!current || current.openedOn !== today) return {
		data,
		error: "لم يعد تصحيح البداية متاحاً."
	};
	if (!DATE_RE.test(start) || start > today) return {
		data,
		error: "اختر يوماً حلّ بالفعل."
	};
	const floor = latestClosedEnd(data.flame.runs.filter((run) => run.id !== current.id));
	if (floor && start <= floor) return {
		data,
		error: "البداية بعد آخر يومٍ أُغلقت فيه الشعلة."
	};
	if (rangeHitsSlip(data.flame.slips, start, today)) return {
		data,
		error: "في هذه المدة يومٌ انطفأت فيه."
	};
	return {
		data: {
			...data,
			flame: {
				...data.flame,
				runs: data.flame.runs.map((run) => run.id === current.id ? {
					...run,
					start
				} : run)
			}
		},
		error: null
	};
}
function slipFlame(data, today) {
	const current = openRun(data.flame);
	if (!current || data.flame.slips.includes(today)) return data;
	const undo = {
		runs: data.flame.runs.map((run) => ({ ...run })),
		slips: [...data.flame.slips]
	};
	const yesterday = addDays(today, -1);
	const runs = current.start > yesterday ? data.flame.runs.filter((run) => run.id !== current.id) : data.flame.runs.map((run) => run.id === current.id ? {
		...run,
		end: yesterday
	} : run);
	return {
		...data,
		flame: {
			runs,
			slips: [...data.flame.slips, today],
			undo
		}
	};
}
function undoSlip(data, today) {
	if (!data.flame.undo || !data.flame.slips.includes(today)) return data;
	return {
		...data,
		flame: {
			runs: data.flame.undo.runs.map((run) => ({ ...run })),
			slips: [...data.flame.undo.slips],
			undo: null
		}
	};
}
function splitPlans(plans, today) {
	return {
		todayPlan: plans.find((plan) => plan.date === today) ?? null,
		upcoming: plans.filter((plan) => plan.date > today).sort((a, b) => a.date < b.date ? -1 : 1),
		history: plans.filter((plan) => plan.date < today).sort((a, b) => a.date < b.date ? 1 : -1)
	};
}
function doneCount(plan) {
	return {
		done: plan.tasks.filter((task) => task.done).length,
		total: plan.tasks.length
	};
}
function savePlan(data, today, date, drafts) {
	if (!DATE_RE.test(date) || date <= today) return {
		data,
		error: "التعديل يُغلق حين يحين اليوم."
	};
	const titles = drafts.map((task) => ({
		id: task.id,
		title: task.title.trim().slice(0, 140)
	})).filter((task) => task.title).slice(0, 8);
	if (titles.length === 0) return {
		data,
		error: "اكتب مهمة واحدة على الأقل."
	};
	const existing = data.plans.find((plan) => plan.date === date);
	const plan = {
		id: existing?.id ?? crypto.randomUUID(),
		date,
		createdAt: existing?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString(),
		tasks: titles.map((task) => ({
			id: task.id || crypto.randomUUID(),
			title: task.title,
			done: false
		}))
	};
	return {
		data: {
			...data,
			plans: [...data.plans.filter((item) => item.date !== date), plan]
		},
		error: null
	};
}
function removePlan(data, today, date) {
	const plan = data.plans.find((item) => item.date === date);
	if (!plan || plan.date <= today) return data;
	return {
		...data,
		plans: data.plans.filter((item) => item.date !== date)
	};
}
function toggleTask(data, today, date, taskId) {
	return {
		...data,
		plans: data.plans.map((plan) => {
			if (plan.date !== date || plan.date !== today) return plan;
			return {
				...plan,
				tasks: plan.tasks.map((task) => task.id === taskId ? {
					...task,
					done: !task.done
				} : task)
			};
		})
	};
}
function isTask(value) {
	if (!value || typeof value !== "object") return false;
	const task = value;
	return typeof task.id === "string" && typeof task.title === "string" && typeof task.done === "boolean";
}
function isPlan(value) {
	if (!value || typeof value !== "object") return false;
	const plan = value;
	return typeof plan.id === "string" && typeof plan.date === "string" && DATE_RE.test(plan.date) && typeof plan.createdAt === "string" && Array.isArray(plan.tasks) && plan.tasks.every(isTask);
}
function isRun(value) {
	if (!value || typeof value !== "object") return false;
	const run = value;
	return typeof run.id === "string" && typeof run.start === "string" && DATE_RE.test(run.start) && (run.end === null || typeof run.end === "string" && DATE_RE.test(run.end)) && typeof run.openedOn === "string" && DATE_RE.test(run.openedOn);
}
function sanitize(raw) {
	if (!raw || typeof raw !== "object") return emptyStore();
	const source = raw;
	const flameRaw = source.flame;
	let flame = emptyFlame();
	if (flameRaw && typeof flameRaw === "object") {
		const candidate = flameRaw;
		const runs = Array.isArray(candidate.runs) ? candidate.runs.filter(isRun) : [];
		const slips = Array.isArray(candidate.slips) ? [...new Set(candidate.slips.filter((slip) => typeof slip === "string" && DATE_RE.test(slip)))] : [];
		let openSeen = false;
		const normalized = [];
		for (const run of runs) {
			if (run.end === null) {
				if (openSeen) continue;
				openSeen = true;
			}
			normalized.push(run);
		}
		flame = {
			runs: normalized,
			slips,
			undo: candidate.undo && typeof candidate.undo === "object" && Array.isArray(candidate.undo.runs) ? {
				runs: candidate.undo.runs.filter(isRun),
				slips: Array.isArray(candidate.undo.slips) ? candidate.undo.slips.filter((slip) => typeof slip === "string" && DATE_RE.test(slip)) : []
			} : null
		};
	}
	const plans = Array.isArray(source.plans) ? source.plans.filter(isPlan) : [];
	const byDate = /* @__PURE__ */ new Map();
	for (const plan of plans) {
		const prev = byDate.get(plan.date);
		if (!prev || prev.createdAt <= plan.createdAt) byDate.set(plan.date, {
			...plan,
			tasks: plan.tasks.slice(0, 8).map((task) => ({
				...task,
				title: task.title.slice(0, 140)
			}))
		});
	}
	return {
		flame,
		plans: [...byDate.values()]
	};
}
function loadStore() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return emptyStore();
		return sanitize(JSON.parse(raw));
	} catch {
		return emptyStore();
	}
}
function saveStore(data) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function draftsFrom(plan) {
	if (!plan || plan.tasks.length === 0) return [{
		id: crypto.randomUUID(),
		title: ""
	}];
	return plan.tasks.map((task) => ({
		id: task.id,
		title: task.title
	}));
}
function PlanSheet({ today, plans, initialDate, onClose, onSave, onDelete }) {
	const titleId = (0, import_react.useId)();
	const tomorrow = addDays(today, 1);
	const existingAt = (date) => plans.find((plan) => plan.date === date);
	const [date, setDate] = (0, import_react.useState)(initialDate > today ? initialDate : tomorrow);
	const [tasks, setTasks] = (0, import_react.useState)(() => draftsFrom(existingAt(initialDate)));
	const [error, setError] = (0, import_react.useState)(null);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const locked = date <= today;
	const existing = existingAt(date);
	(0, import_react.useEffect)(() => {
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (event) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			window.removeEventListener("keydown", onKey);
		};
	}, [onClose]);
	function applyDate(next) {
		if (!next || next <= today) return;
		setDate(next);
		setTasks(draftsFrom(existingAt(next)));
		setError(null);
		setConfirmDelete(false);
	}
	function updateTitle(id, title) {
		setTasks((current) => current.map((task) => task.id === id ? {
			...task,
			title
		} : task));
	}
	function addTask() {
		setTasks((current) => current.length >= 8 ? current : [...current, {
			id: crypto.randomUUID(),
			title: ""
		}]);
	}
	function removeTask(id) {
		setTasks((current) => {
			const next = current.filter((task) => task.id !== id);
			return next.length > 0 ? next : [{
				id: crypto.randomUUID(),
				title: ""
			}];
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-ink/75",
			"aria-label": "إغلاق النافذة",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": titleId,
			className: "relative flex max-h-[min(92dvh,40rem)] w-full max-w-md flex-col rounded-t-3xl border border-line bg-panel shadow-2xl sm:rounded-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4 px-5 pt-5 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: titleId,
						className: "font-display text-3xl leading-tight",
						children: existing ? "تعديل العهد" : "عهدٌ جديد"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-clay",
						children: "يُكتب قبل اليوم، ويُقفل حين يحين."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "h-11 shrink-0 px-2 text-sm text-clay",
						children: "إغلاق"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-col gap-4 overflow-y-auto px-5 pb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-clay",
									children: "اليوم المعني"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									min: tomorrow,
									value: date,
									onChange: (event) => applyDate(event.target.value),
									className: "h-12 rounded-2xl border border-line bg-ink px-3 text-base text-ivory outline-none focus-visible:border-brass"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-ivory",
									children: formatDay(date)
								})
							]
						}),
						locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-2xl border border-line px-4 py-3 text-sm text-brass",
							role: "status",
							children: "حلّ هذا الموعد. لم يعد التعديل ممكناً."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col gap-2",
							children: tasks.map((task, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: task.title,
									maxLength: 140,
									onChange: (event) => updateTitle(task.id, event.target.value),
									placeholder: index === 0 ? "مثال: قراءة أربعين صفحة" : "مهمة أخرى",
									"aria-label": `المهمة ${index + 1}`,
									className: "h-12 min-w-0 flex-1 rounded-2xl border border-line bg-ink px-4 text-base text-ivory outline-none placeholder:text-clay/70 focus-visible:border-brass"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "حذف المهمة",
									onClick: () => removeTask(task.id),
									className: "grid size-12 shrink-0 place-items-center rounded-2xl border border-line text-clay",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							}, task.id))
						}),
						!locked && tasks.length < 8 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: addTask,
							className: "flex h-12 items-center justify-center gap-2 rounded-2xl border border-dashed border-line text-sm text-clay",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "أضف مهمة"]
						}) : null,
						!locked && tasks.length >= 8 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-clay",
							children: "ثمانية تكفي ليومٍ واحد."
						}) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							className: "text-sm text-brass",
							children: error
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-col gap-2 border-t border-line px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-testid": "save-plan",
						disabled: locked,
						onClick: submit,
						className: "h-12 rounded-full bg-ember text-base font-medium text-ink disabled:opacity-40",
						children: existing ? "حدّث العهد" : "احفظ العهد"
					}), existing && !locked ? confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setConfirmDelete(false),
							className: "h-12 flex-1 rounded-full border border-line text-sm",
							children: "إبقاء"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								onDelete(date);
								onClose();
							},
							className: "h-12 flex-1 rounded-full border border-brass text-sm text-brass",
							children: "احذف العهد"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setConfirmDelete(true),
						className: "h-11 text-sm text-clay",
						children: "احذف هذا العهد"
					}) : null]
				})
			]
		})]
	});
}
function WaqdApp() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [today, setToday] = (0, import_react.useState)(null);
	const [data, setData] = (0, import_react.useState)(emptyStore());
	const [sheetDate, setSheetDate] = (0, import_react.useState)(null);
	const [showAllHistory, setShowAllHistory] = (0, import_react.useState)(false);
	const [wasteAsk, setWasteAsk] = (0, import_react.useState)(false);
	const [startAsk, setStartAsk] = (0, import_react.useState)(false);
	const [startDate, setStartDate] = (0, import_react.useState)("");
	const [flameError, setFlameError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setData(loadStore());
		setToday(dateKey());
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		saveStore(data);
	}, [data, ready]);
	(0, import_react.useEffect)(() => {
		const syncDay = () => setToday(dateKey());
		const onVisible = () => {
			if (document.visibilityState === "visible") syncDay();
		};
		const onStorage = (event) => {
			if (event.key === "waqd.v1") setData(loadStore());
		};
		document.addEventListener("visibilitychange", onVisible);
		window.addEventListener("storage", onStorage);
		const timer = window.setInterval(syncDay, 3e4);
		return () => {
			document.removeEventListener("visibilitychange", onVisible);
			window.removeEventListener("storage", onStorage);
			window.clearInterval(timer);
		};
	}, []);
	if (!ready || !today) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-5xl leading-none",
			children: "وَقْد"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-clay",
			children: "صُن وقتك من التفاهة"
		})]
	});
	const view = describeFlame(data.flame, today);
	const { todayPlan, upcoming, history } = splitPlans(data.plans, today);
	const shownHistory = showAllHistory ? history : history.slice(0, 4);
	function light(start) {
		const result = view.canCorrect ? correctStart(data, today, start) : lightFlame(data, today, start);
		setData(result.data);
		setFlameError(result.error);
		if (!result.error) {
			setStartAsk(false);
			setWasteAsk(false);
		}
	}
	function openSheet(date) {
		setSheetDate(date ?? addDays(today, 1));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh overflow-x-hidden bg-ink text-ivory",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex w-full max-w-md flex-col gap-8 px-5 pt-8 pb-32",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-5xl leading-none",
							children: "وَقْد"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-clay",
							children: "صُن وقتك من التفاهة"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pb-1 text-sm text-clay",
							children: formatDay(today)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "flame-heading",
						className: "flex flex-col items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "flame-heading",
								className: "sr-only",
								children: "شعلة الأيام"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex w-full flex-col items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlameMark, {
									level: view.level,
									alive: view.alive
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: clsx("relative z-10 -mt-8 flex size-52 flex-col items-center justify-center rounded-full border bg-ink", view.alive ? "border-brass" : "border-line"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: clsx("absolute inset-2 rounded-full border", view.alive ? "border-brass/40" : "border-line") }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											"data-testid": "streak-count",
											className: clsx("font-display text-6xl leading-none", view.alive ? "text-ivory" : "text-clay"),
											children: toAr(view.count)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-clay",
											children: "بلا تفاهة"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-xs text-center text-base leading-relaxed",
								children: view.copy
							}),
							view.anchor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-center text-sm text-clay",
								children: ["مشتعلة منذ ", formatDay(view.anchor)]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-6 flex w-full justify-between gap-1",
								children: recentDays(today).map((key) => {
									const mark = dayMark(data.flame, key, today);
									const isToday = key === today;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex flex-1 flex-col items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: clsx("size-3 rounded-full", mark === "clean" && "bg-ember", mark === "slip" && "bg-line", mark === "idle" && isToday && "border-2 border-brass", mark === "idle" && !isToday && "border border-line") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: clsx("text-xs", isToday ? "text-ivory" : "text-clay"),
											children: weekdayLetter(key)
										})]
									}, key);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-6 grid w-full grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-line bg-panel px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-sm text-clay",
										children: "أفضل وهج"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 font-display text-3xl leading-none",
										children: toAr(view.best)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-line bg-panel px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-sm text-clay",
										children: "أيام مصونة"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 font-display text-3xl leading-none",
										children: toAr(view.total)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex w-full flex-col gap-2",
								children: [
									!view.alive && !view.slippedToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"data-testid": "light-flame",
											onClick: () => light(today),
											className: "h-12 rounded-full bg-ember text-base font-medium text-ink",
											children: "أُشعل الشعلة"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setStartAsk((open) => !open);
												setStartDate(addDays(today, -1));
												setFlameError(null);
											},
											className: "h-11 text-sm text-clay",
											children: "بدأت قبل اليوم"
										}),
										startAsk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
											className: "flex flex-col gap-2 rounded-2xl border border-line bg-panel p-3",
											onSubmit: (event) => {
												event.preventDefault();
												light(startDate);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex flex-col gap-2 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-clay",
													children: "أول يوم لم يضع بعده وقتك"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "date",
													max: today,
													value: startDate,
													onChange: (event) => setStartDate(event.target.value),
													className: "h-12 rounded-2xl border border-line bg-ink px-3 text-base outline-none focus-visible:border-brass"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "submit",
												className: "h-12 rounded-full border border-brass text-sm text-brass",
												children: "اعتماد هذا البدء"
											})]
										}) : null
									] }) : null,
									view.slippedToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setData(undoSlip(data, today));
											setFlameError(null);
										},
										className: "h-12 rounded-full border border-brass text-sm text-brass",
										children: "تراجع — أعد الشعلة"
									}) : null,
									view.alive && view.canCorrect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setStartAsk((open) => !open);
											setStartDate(view.anchor ?? today);
											setFlameError(null);
										},
										className: "h-11 text-sm text-clay",
										children: "تصحيح البداية، هذا اليوم فقط"
									}) : null,
									view.alive && view.canCorrect && startAsk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										className: "flex flex-col gap-2 rounded-2xl border border-line bg-panel p-3",
										onSubmit: (event) => {
											event.preventDefault();
											light(startDate);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											max: today,
											value: startDate,
											onChange: (event) => setStartDate(event.target.value),
											"aria-label": "تاريخ بداية الشعلة",
											className: "h-12 rounded-2xl border border-line bg-ink px-3 text-base outline-none focus-visible:border-brass"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											className: "h-12 rounded-full border border-brass text-sm text-brass",
											children: "حدّث البداية"
										})]
									}) : null,
									view.alive ? wasteAsk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-line bg-panel p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm leading-relaxed",
											children: "إطفاء اليوم يُسقطه من السلسلة. الأيام التي قبله تبقى في رصيدك."
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setWasteAsk(false),
												className: "h-12 flex-1 rounded-full border border-line text-sm",
												children: "أبقِها"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"data-testid": "confirm-slip",
												onClick: () => {
													setData(slipFlame(data, today));
													setWasteAsk(false);
													setFlameError(null);
												},
												className: "h-12 flex-1 rounded-full bg-ember text-sm font-medium text-ink",
												children: "نعم، انطفأت"
											})]
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWasteAsk(true),
										className: "h-11 text-sm text-clay",
										children: "ضاع الوقت اليوم"
									}) : null,
									flameError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										role: "alert",
										className: "text-center text-sm text-brass",
										children: flameError
									}) : null
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "today-heading",
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "today-heading",
								className: "text-base font-medium",
								children: "عهد اليوم"
							}), todayPlan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-sm text-clay",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }), "مقفل"]
							}) : null]
						}), todayPlan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayCard, {
							plan: todayPlan,
							onToggle: (taskId) => setData(toggleTask(data, today, today, taskId))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-2xl border border-dashed border-line px-4 py-5 text-sm leading-relaxed text-clay",
							children: "لا عهد لهذا اليوم. اكتب مهام الغد قبل أن يأتي، ثم أنجزها حين يحين — بلا تعديل بعدئذ."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "upcoming-heading",
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "upcoming-heading",
							className: "text-base font-medium",
							children: "قادم"
						}), upcoming.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-clay",
							children: "لا عهود تنتظر. اليوم القادم ما زال صفحة بيضاء."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col gap-2",
							children: upcoming.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => openSheet(plan.date),
								className: "flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border border-line bg-panel px-4 py-3 text-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-base",
									children: relativeDay(plan.date, today)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 block text-sm text-clay",
									children: [
										formatDay(plan.date),
										" · ",
										taskCountPhrase(plan.tasks.length)
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-brass",
									children: "تعديل"
								})]
							}) }, plan.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "history-heading",
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "history-heading",
							className: "text-base font-medium",
							children: "السجل"
						}), history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-clay",
							children: "حين ينتهي يوم العهد يغادر الواجهة ويبقى هنا، بما أُنجز وما لم يُنجز."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col gap-3",
							children: shownHistory.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryCard, {
								plan,
								today
							}, plan.id))
						}), history.length > 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowAllHistory((open) => !open),
							className: "h-11 text-sm text-clay",
							children: showAllHistory ? "أخفِ الأقدم" : `أظهر الباقي · ${toAr(history.length - 4)}`
						}) : null] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm leading-relaxed text-clay",
						children: "يبقى هذا السجل على هاتفك، حتى بعد إغلاق الصفحة."
					})
				]
			}),
			sheetDate ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full max-w-md px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "open-plan",
						onClick: () => openSheet(),
						className: "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ember text-base font-medium text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }), "خطّط ليومٍ قادم"]
					})
				})
			}),
			sheetDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanSheet, {
				today,
				plans: data.plans,
				initialDate: sheetDate,
				onClose: () => setSheetDate(null),
				onSave: (date, tasks) => {
					const result = savePlan(data, today, date, tasks);
					setData(result.data);
					return result.error;
				},
				onDelete: (date) => setData(removePlan(data, today, date))
			}) : null
		]
	});
}
function TodayCard({ plan, onToggle }) {
	const { done, total } = doneCount(plan);
	const ratio = total === 0 ? 0 : done / total;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line bg-panel p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-2 pb-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-clay",
					children: [
						toAr(done),
						" من ",
						toAr(total)
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-brass",
					children: done === total && total > 0 ? "وُفي" : "يوم التنفيذ"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-2 mb-2 h-1 overflow-hidden rounded-full bg-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-brass",
					style: { width: `${Math.round(ratio * 100)}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col",
				children: plan.tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "today-task",
					"aria-pressed": task.done,
					onClick: () => onToggle(task.id),
					className: "flex min-h-12 w-full items-center gap-3 rounded-2xl px-2 text-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: clsx("grid size-6 shrink-0 place-items-center rounded-full border", task.done ? "border-brass bg-brass text-ink" : "border-clay"),
						children: task.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "size-3.5",
							strokeWidth: 3
						}) : null
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: clsx("text-base leading-snug break-words", task.done && "text-clay line-through"),
						children: task.title
					})]
				}) }, task.id))
			})
		]
	});
}
function HistoryCard({ plan, today }) {
	const { done, total } = doneCount(plan);
	const verdict = done === total && total > 0 ? "عهدٌ وُفي" : done === 0 ? "لم يُنجز شيء" : "أُنجز بعضه";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-2xl border border-line bg-panel px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base",
					children: relativeDay(plan.date, today)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-clay",
					children: [
						toAr(done),
						"/",
						toAr(total)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-clay",
				children: formatDay(plan.date)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-col gap-2",
				children: plan.tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-2 text-sm leading-snug",
					children: [task.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0 text-brass" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "mt-0.5 size-4 shrink-0 text-clay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: clsx("break-words", task.done ? "text-ivory" : "text-clay"),
						children: task.title
					})]
				}, task.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-brass",
				children: verdict
			})
		]
	});
}
var SplitComponent = WaqdApp;
//#endregion
export { SplitComponent as component };
