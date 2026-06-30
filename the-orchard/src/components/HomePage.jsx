"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Menu,
  Home as HomeIcon,
  ListChecks,
  CalendarDays,
  Calendar,
  Timer,
  GraduationCap,
  Wallet,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronDown,
  AlertTriangle,
  Angry,
  Frown,
  Meh,
  Smile,
  Laugh,
} from "lucide-react";

// Real pixel-art tree sprites (cropped from the Resurrected RPG asset pack).
// Each palette has 3 growth stages: stage1 (tiny shrub) -> stage2 (sapling) -> stage3 (mature tree).
const TREE_PALETTES = ["spring", "autumn-gold", "deep-green", "autumn-red", "olive"];
const treeSprite = (palette, stage) => `/sprites/trees/tree-${palette}-stage${stage}.png`;

const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function Card({ title, icon, accent, children, className = "" }) {
  return (
    <div
      className={
        "rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm " +
        "transition-transform duration-200 hover:-translate-y-1 hover:shadow-md " +
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0 " +
        className
      }
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={"flex h-8 w-8 items-center justify-center rounded-full " + accent}>
          {icon}
        </span>
        <h3
          className="text-[15px] font-semibold text-stone-800 tracking-wide"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function Checklist({ items, setItems, doneColor }) {
  const toggle = (idx) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, done: !it.done } : it))
    );
  return (
    <ul className="space-y-2">
      {items.map((it, idx) => (
        <li key={idx}>
          <button
            onClick={() => toggle(idx)}
            className="group flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1 text-left
                       focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-emerald-600"
          >
            <span
              className={
                "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border " +
                (it.done
                  ? doneColor + " border-transparent"
                  : "border-stone-300 bg-white group-hover:border-stone-400")
              }
            >
              {it.done && <Check size={11} className="text-white" strokeWidth={3} />}
            </span>
            <span
              className={
                "text-[13.5px] leading-snug " +
                (it.done ? "text-stone-400 line-through" : "text-stone-700")
              }
            >
              {it.label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  const now = useClock();
  const dayDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const weekNum = getWeekNumber(now);
  const tempC = 22; // placeholder — would come from a weather API

  const navItems = [
    { label: "Home", icon: HomeIcon },
    { label: "Calendar", icon: Calendar },
    { label: "Agenda", icon: CalendarDays },
    { label: "Academics", icon: GraduationCap },
    { label: "Budget", icon: Wallet },
    { label: "Self-care", icon: Smile },
  ];
  const [activeNav, setActiveNav] = useState("Home");

  const [weekOpen, setWeekOpen] = useState(true);
  const assignmentsDue = 3;
  const eventsToAttend = 2;
  const overdueCount = 1;
  const weeklyItems = [
    { label: "Calc II problem set 7", when: "Due Wed" },
    { label: "Bio 201 lab report", when: "Due Fri" },
    { label: "Dentist appointment", when: "Thu · 2:00 PM" },
    { label: "Scholarship essay draft", when: "Due Sun" },
  ];

  const agendaItems = [
    { label: "Bio 201 lab report", when: "Fri" },
    { label: "Project proposal", when: "Mon" },
    { label: "Dentist · 2:00 PM", when: "Thu" },
  ];

  const [todoItems, setTodoItems] = useState([
    { label: "Email professor re: extension", done: false },
    { label: "Laundry", done: true },
    { label: "Gym — leg day", done: false },
    { label: "Grocery run", done: false },
  ]);

  const moods = [
    { Icon: Angry, label: "Awful" },
    { Icon: Frown, label: "Bad" },
    { Icon: Meh, label: "Okay" },
    { Icon: Smile, label: "Good" },
    { Icon: Laugh, label: "Great" },
  ];
  const [selectedMood, setSelectedMood] = useState(3);
  const [selfCareItems, setSelfCareItems] = useState([
    { label: "10 min stretch", done: true },
    { label: "Drink 64oz water", done: false },
    { label: "Journal before bed", done: false },
  ]);

  const grades = [
    { subj: "CALC II", grade: "A-" },
    { subj: "BIO 201", grade: "B+" },
    { subj: "CHEM 110", grade: "B" },
    { subj: "ENG 220", grade: "A" },
    { subj: "HIST 150", grade: "A-" },
    { subj: "SPAN 102", grade: "B+" },
    { subj: "ART 101", grade: "A" },
    { subj: "PSYC 100", grade: "B+" },
  ];

  const budget = {
    periodLabel: "Until next paycheck · Jul 11",
    spent: 346.2,
    allowance: 300,
    saved: 612.0,
  };
  const overBudget = budget.spent > budget.allowance;
  const spendable = budget.allowance - budget.spent;
  const expenses = [
    { label: "Groceries", amount: 42.1 },
    { label: "Textbook rental", amount: 68.0 },
    { label: "Coffee runs", amount: 21.75 },
  ];

  // Focus timer
  const TOTAL = 25 * 60;
  const [remaining, setRemaining] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // A new plant species (palette) is picked each time a fresh session starts —
  // this is what gives "mixed, different palette per session" growth.
  const [sessionPalette, setSessionPalette] = useState(
    () => TREE_PALETTES[Math.floor(Math.random() * TREE_PALETTES.length)]
  );

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, remaining]);

  const elapsedFrac = 1 - remaining / TOTAL;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - elapsedFrac);

  const growthStage = elapsedFrac < 0.34 ? 1 : elapsedFrac < 0.7 ? 2 : 3;
  const growthSprite = treeSprite(sessionPalette, growthStage);

  const gardenTiles = [
    { x: 8, y: 62, w: 34, op: 0.4, palette: "olive", stage: 2 },
    { x: 18, y: 42, w: 30, op: 0.45, palette: "spring", stage: 1 },
    { x: 29, y: 64, w: 56, op: 0.65, palette: "deep-green", stage: 3 },
    { x: 39, y: 38, w: 26, op: 0.7, palette: "autumn-gold", stage: 1 },
    { x: 50, y: 58, w: 66, op: 0.95, palette: "spring", stage: 3 },
    { x: 50, y: 30, w: 50, op: 0.9, palette: "autumn-red", stage: 3 },
    { x: 61, y: 60, w: 60, op: 0.9, palette: "deep-green", stage: 3 },
    { x: 71, y: 40, w: 28, op: 0.65, palette: "olive", stage: 1 },
    { x: 82, y: 64, w: 38, op: 0.5, palette: "autumn-gold", stage: 2 },
    { x: 92, y: 44, w: 28, op: 0.4, palette: "spring", stage: 1 },
  ];

  return (
    <div className="min-h-screen w-full bg-stone-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* Top bar */}
      <header className="border-b border-stone-200 bg-stone-50/90 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open menu"
              className="rounded-lg p-1.5 text-stone-600 hover:bg-stone-200/70 focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <Menu size={20} />
            </button>
            <span
              className="text-[15px] font-semibold tracking-widest text-emerald-800"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              sprout
            </span>
          </div>
          <p className="flex-1 text-center text-[13px] text-stone-500 sm:text-sm">{dayDate}</p>
          <p
            className="text-right text-[13px] font-medium text-stone-700 sm:text-sm"
            style={{ fontFamily: FONT_MONO }}
          >
            {time} · {tempC}°C
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-7 sm:px-8">
        {/* Welcome hero — unboxed, top-down garden as background */}
        <section className="relative mb-6 overflow-hidden rounded-3xl">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #eaf3e6 0%, #d9e8d0 35%, #c4dab9 100%)",
            }}
          >
            <div className="absolute inset-0">
              {[...gardenTiles]
                .sort((a, b) => a.y - b.y)
                .map((t, i) => (
                  <img
                    key={i}
                    src={treeSprite(t.palette, t.stage)}
                    alt=""
                    style={{
                      position: "absolute",
                      left: `${t.x}%`,
                      top: `${t.y}%`,
                      width: t.w,
                      height: "auto",
                      opacity: t.op,
                      transform: "translate(-50%, -90%)",
                      zIndex: Math.round(t.y * 10),
                      imageRendering: "pixelated",
                    }}
                    className="drop-shadow-sm"
                  />
                ))}
            </div>
            {/* legibility scrims so the art can bleed across columns without burying the text */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-stone-50/95 via-stone-50/45 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-stone-50/95 via-stone-50/45 to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-6 px-6 py-7 sm:px-8 md:grid-cols-3 md:gap-4">
            {/* Left column: greeting + this week's stats */}
            <div>
              <h1
                className="text-2xl font-medium text-emerald-950 sm:text-3xl"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Welcome, Radha
              </h1>
              <div className="mt-2 flex flex-col gap-0.5 text-[13.5px] text-emerald-900/85">
                <span>
                  <span style={{ fontFamily: FONT_MONO }}>{assignmentsDue}</span> assignments due
                </span>
                <span>
                  <span style={{ fontFamily: FONT_MONO }}>{eventsToAttend}</span> events to attend
                </span>
                {overdueCount > 0 && (
                  <span className="font-medium text-rose-700">
                    <span style={{ fontFamily: FONT_MONO }}>{overdueCount}</span> overdue
                  </span>
                )}
              </div>
            </div>

            {/* Middle column: the garden art lives in the background here; column stays clear */}
            <div className="hidden items-end justify-center pb-1 md:flex">
              <p className="rounded-full bg-stone-50/70 px-3 py-1 text-[11px] text-emerald-800/70 backdrop-blur-sm">
                Grown through your focus sessions
              </p>
            </div>

            {/* Right column: week number + this week's activities */}
            <div>
              <p className="text-[12px] text-stone-400 sm:text-[13px]" style={{ fontFamily: FONT_MONO }}>
                Week {weekNum} of {now.getFullYear()}
              </p>
              <button
                onClick={() => setWeekOpen((v) => !v)}
                className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-emerald-800/90 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-600 rounded"
              >
                <ChevronDown
                  size={14}
                  className={"transition-transform " + (weekOpen ? "rotate-180" : "")}
                />
                <span>This week&apos;s activities</span>
              </button>
              {weekOpen && (
                <ul className="mt-2 space-y-1 text-[13px] text-emerald-900/80">
                  {weeklyItems.map((it, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 border-t border-emerald-200/60 py-1.5 first:border-t-0"
                    >
                      <span>{it.label}</span>
                      <span className="shrink-0 text-emerald-700/70" style={{ fontFamily: FONT_MONO }}>
                        {it.when}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Section nav — now below the welcome hero */}
        <nav className="mb-6 flex gap-1 overflow-x-auto">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 " +
                (activeNav === label
                  ? "bg-emerald-700 text-white"
                  : "text-stone-500 hover:bg-stone-100")
              }
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </nav>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Daily To-Do" icon={<ListChecks size={16} className="text-white" />} accent="bg-emerald-600">
            <Checklist items={todoItems} setItems={setTodoItems} doneColor="bg-emerald-600" />
          </Card>

          <Card title="Agenda" icon={<CalendarDays size={16} className="text-white" />} accent="bg-stone-500">
            <ul className="space-y-2">
              {agendaItems.map((it, i) => (
                <li key={i} className="flex items-center justify-between gap-3 text-[13.5px] text-stone-700">
                  <span>{it.label}</span>
                  <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-500" style={{ fontFamily: FONT_MONO }}>
                    {it.when}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Focus" icon={<Timer size={16} className="text-white" />} accent="bg-amber-600">
            <div className="flex flex-col items-center py-1">
              <div className="relative h-32 w-32">
                <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
                  <circle cx="60" cy="60" r={radius} fill="none" stroke="#e7e5e4" strokeWidth="8" />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <img
                    src={growthSprite}
                    alt={`${sessionPalette} plant, stage ${growthStage}`}
                    style={{ height: 30, width: "auto", imageRendering: "pixelated" }}
                    className="mb-1 drop-shadow-sm"
                  />
                  <span className="text-lg font-semibold text-stone-800" style={{ fontFamily: FONT_MONO }}>
                    {mm}:{ss}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setRunning((r) => !r)}
                  disabled={remaining === 0}
                  className="flex items-center gap-1.5 rounded-full bg-amber-600 px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:bg-amber-700 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                >
                  {running ? <Pause size={13} /> : <Play size={13} />}
                  {running ? "Pause" : remaining === 0 ? "Done" : "Start"}
                </button>
                <button
                  onClick={() => {
                    setRunning(false);
                    setRemaining(TOTAL);
                    setSessionPalette(TREE_PALETTES[Math.floor(Math.random() * TREE_PALETTES.length)]);
                  }}
                  aria-label="Reset timer"
                  className="rounded-full border border-stone-200 p-1.5 text-stone-500 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          </Card>

          <Card title="Grades" icon={<GraduationCap size={16} className="text-white" />} accent="bg-violet-600">
            <div className="grid grid-cols-3 gap-1.5">
              {grades.map((g, i) => (
                <div key={i} className="rounded-lg bg-stone-50 px-1.5 py-2 text-center">
                  <p className="text-[9.5px] font-medium uppercase tracking-wide text-stone-400">{g.subj}</p>
                  <p className="text-sm font-semibold text-stone-700">{g.grade}</p>
                </div>
              ))}
              <div className="rounded-lg bg-violet-600 px-1.5 py-2 text-center">
                <p className="text-[9.5px] font-medium uppercase tracking-wide text-violet-200">Average</p>
                <p className="text-sm font-semibold text-white">B+</p>
              </div>
            </div>
          </Card>

          <Card title="Budget" icon={<Wallet size={16} className="text-white" />} accent="bg-rose-600">
            <p className="text-[11px] text-stone-400">{budget.periodLabel}</p>

            {overBudget ? (
              <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1.5 text-rose-700">
                <AlertTriangle size={14} className="shrink-0" />
                <span className="text-[13px] font-medium">
                  Over budget by{" "}
                  <span style={{ fontFamily: FONT_MONO }}>${Math.abs(spendable).toFixed(2)}</span>
                </span>
              </div>
            ) : (
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold text-stone-800" style={{ fontFamily: FONT_MONO }}>
                  ${spendable.toFixed(2)}
                </span>
                <span className="text-[12px] text-stone-400">left to spend</span>
              </div>
            )}

            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className={"h-full rounded-full " + (overBudget ? "bg-rose-600" : "bg-rose-500")}
                style={{ width: `${Math.min(100, (budget.spent / budget.allowance) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-[12.5px] text-stone-500">
              <span className="font-medium text-stone-700" style={{ fontFamily: FONT_MONO }}>
                ${budget.saved.toFixed(2)}
              </span>{" "}
              saved overall
            </p>

            <p className="mt-3 text-[10.5px] font-medium uppercase tracking-wide text-stone-400">
              Recent expenses
            </p>
            <ul className="mt-1 space-y-1">
              {expenses.map((e, i) => (
                <li key={i} className="flex items-center justify-between text-[12.5px] text-stone-600">
                  <span>{e.label}</span>
                  <span style={{ fontFamily: FONT_MONO }}>-${e.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Self Care" icon={<Smile size={16} className="text-white" />} accent="bg-pink-500">
            <div className="flex items-center justify-between">
              {moods.map(({ Icon, label }, i) => (
                <button
                  key={label}
                  onClick={() => setSelectedMood(i)}
                  aria-label={label}
                  className={
                    "flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 " +
                    (selectedMood === i
                      ? "bg-pink-500 text-white"
                      : "text-stone-400 hover:bg-stone-100 hover:text-stone-600")
                  }
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
            <p className="mb-2 mt-1 text-center text-[11px] text-stone-400">{moods[selectedMood].label}</p>
            <Checklist items={selfCareItems} setItems={setSelfCareItems} doneColor="bg-pink-500" />

          </Card>
        </div>
      </main>
    </div>
  );
}