"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Menu,
  Plus,
  Check,
  ChevronDown,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

/* ─── pixel emoji paths ───────────────────────────────────────── */
const MOODS = [
  { src: "/sprites/emotes/tired.png",  label: "Rough" },
  { src: "/sprites/emotes/frown.png",  label: "Low"   },
  { src: "/sprites/emotes/sad.png",    label: "Meh"   },
  { src: "/sprites/emotes/smile.png",  label: "Good"  },
  { src: "/sprites/emotes/happy.png",  label: "Great" },
];

/* ─── helpers ─────────────────────────────────────────────────── */
function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
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

/* ─── tiny pie chart (SVG) for rejection tracker ─────────────── */
function PieChart({ accepted, rejected, pending }) {
  const total = accepted + rejected + pending || 1;
  const slices = [
    { value: accepted, color: "#86efac" },
    { value: rejected, color: "#fca5a5" },
    { value: pending,  color: "#fcd34d" },
  ];
  let cumAngle = -Math.PI / 2;
  const R = 38, cx = 44, cy = 44;
  const paths = slices.map(({ value, color }) => {
    const angle = (value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(cumAngle);
    const y1 = cy + R * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + R * Math.cos(cumAngle);
    const y2 = cy + R * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return { d: `M${cx},${cy} L${x1},${y1} A${R},${R},0,${large},1,${x2},${y2} Z`, color };
  });
  return (
    <svg viewBox="0 0 88 88" width={88} height={88} style={{ imageRendering: "pixelated" }}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} stroke="#fff" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

/* ─── shared card shell ───────────────────────────────────────── */
function Card({ title, children, className = "" }) {
  return (
    <div
      className={
        "relative overflow-hidden border-4 border-[#b87956] bg-[#ffe5b8] shadow-[6px_6px_0_rgba(99,62,45,0.18)] " +
        className
      }
      style={{
        imageRendering: "pixelated",
        clipPath:
          "polygon(0 10px, 10px 10px, 10px 0, calc(100% - 10px) 0, calc(100% - 10px) 10px, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 10px calc(100% - 10px), 0 calc(100% - 10px))",
      }}
    >
      <div className="absolute inset-2 border-2 border-[#c58d64] opacity-70" />
      <div className="absolute inset-4 border border-[#d9ad7c] opacity-60" />

      <span className="absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-[#a9684a]" />
      <span className="absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-[#a9684a]" />
      <span className="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-[#a9684a]" />
      <span className="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-[#a9684a]" />

      <div className="relative z-10 flex flex-col h-full p-6">
        <div className="mb-3 border-b-2 border-[#d7a06f]/60 pb-2">
          <h3
            className="text-[13px] font-bold uppercase tracking-widest"
            style={{ fontFamily: "'PixelAE', monospace", color: "#7a4a36" }}
          >
            {title}
          </h3>
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

/* ─── pixel checklist ─────────────────────────────────────────── */
function Checklist({ items, setItems, accentBg, limit = 6 }) {
  const toggle = (idx) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, done: !it.done } : it))
    );
  const [newLabel, setNewLabel] = useState("");
  const add = () => {
    if (!newLabel.trim()) return;
    setItems((prev) => [...prev, { label: newLabel.trim(), done: false }]);
    setNewLabel("");
  };
  return (
    <div className="flex flex-col gap-1.5">
      <ul className="space-y-1 overflow-y-auto" style={{ maxHeight: 130 }}>
        {items.slice(0, limit).map((it, idx) => (
          <li key={idx}>
            <button
              onClick={() => toggle(idx)}
              className="group flex w-full items-center gap-2 rounded px-1 py-0.5 text-left hover:bg-stone-100/60"
            >
              <span
                className={
                  "flex h-3.5 w-3.5 shrink-0 items-center justify-center border-2 " +
                  (it.done ? accentBg + " border-transparent" : "border-stone-400 bg-white")
                }
                style={{ imageRendering: "pixelated" }}
              >
                {it.done && <Check size={9} className="text-white" strokeWidth={3} />}
              </span>
              <span
                className={"text-[12px] leading-tight " + (it.done ? "line-through text-stone-400" : "text-stone-700")}
                style={{ fontFamily: "'PixelAE', monospace" }}
              >
                {it.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-1 flex items-center gap-1">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add item..."
          className="flex-1 rounded border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
          style={{ fontFamily: "'PixelAE', monospace" }}
        />
        <button
          onClick={add}
          className={"flex h-5 w-5 items-center justify-center rounded " + accentBg}
        >
          <Plus size={11} className="text-white" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const now = useClock();

  const dayDate = now.toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "numeric", minute: "2-digit",
  });
  const weekNum  = getWeekNumber(now);
  const tempC    = 22;

  /* nav */
  const navItems = [
    { label: "Home" },
    { label: "Calendar" },
    { label: "Agenda" },
    { label: "Academics" },
    { label: "Goals" },
    { label: "Opportunities" },
    { label: "Budget" },
    { label: "Self Care" },
    { label: "Resources" },
  ];
  const [activeNav, setActiveNav] = useState("Home");

  /* welcome data */
  const assignmentsDue = 2;
  const eventsCount    = 2;
  const overdueCount   = 1;
  const [weekOpen, setWeekOpen] = useState(true);
  const weeklyItems = [
    { label: "Calculus assignment", when: "30/06 · 13:00" },
    { label: "History Essay",       when: "31/06 · 00:00" },
    { label: "Scholarship Essay",   when: "31/06 · 00:00" },
    { label: "Meeting w/ Coordinator", when: "31/06 · 14:00" },
    { label: "Stacy's bday",        when: "· 14:00"        },
  ];

  /* daily verse */
  const verse = {
    text: "Be joyful in hope, patient in affliction, faithful in prayer.",
    ref:  "Romans 12:12",
  };

  /* ── card state ─────────────────────────────────── */

  /* weekly goals */
  const [goals, setGoals] = useState([
    { label: "Finish scholarship essay", done: false },
    { label: "Read chapter 4 Calc",      done: true  },
    { label: "Prep for advisor meeting", done: false },
  ]);

  /* daily to-do */
  const [todos, setTodos] = useState([
    { label: "Email professor re: extension", done: false },
    { label: "Laundry",                       done: true  },
    { label: "Gym — leg day",                 done: false },
    { label: "Grocery run",                   done: false },
  ]);

  /* self care */
  const [selfCare, setSelfCare] = useState([
    { label: "10 min stretch",    done: true  },
    { label: "Drink 64oz water",  done: false },
    { label: "Journal",           done: false },
  ]);
  const [selectedMood, setSelectedMood] = useState(3);

  /* grades */
  const grades = [
    { subj: "CALC II", grade: "A-", pct: 91 },
    { subj: "BIO 201", grade: "B+", pct: 88 },
    { subj: "CHEM 110",grade: "B",  pct: 83 },
    { subj: "ENG 220", grade: "A",  pct: 95 },
    { subj: "HIST 150",grade: "A-", pct: 91 },
    { subj: "SPAN 102",grade: "B+", pct: 87 },
  ];

  /* budget */
  const budget = { periodLabel: "Until next paycheck · Jul 11", spent: 346.2, allowance: 300, saved: 612 };
  const overBudget = budget.spent > budget.allowance;
  const spendable  = budget.allowance - budget.spent;
  const expenses   = [
    { label: "Groceries",      amount: 42.10 },
    { label: "Textbook",       amount: 68.00 },
    { label: "Coffee",         amount: 21.75 },
  ];

  /* opportunities */
  const [apps] = useState([
    { name: "Google STEP", status: "rejected" },
    { name: "Meta University", status: "pending" },
    { name: "UST Research Grant", status: "accepted" },
    { name: "NSF REU", status: "rejected" },
    { name: "Target Fellowship", status: "pending" },
  ]);
  const accepted = apps.filter(a => a.status === "accepted").length;
  const rejected = apps.filter(a => a.status === "rejected").length;
  const pending  = apps.filter(a => a.status === "pending").length;
  const goalAcceptances = 3;

  /* resources */
  const resources = [
    { label: "Canvas",   url: "https://stthomas.instructure.com", cat: "Courses"  },
    { label: "Murphy",   url: "https://murphy.stthomas.edu",      cat: "Courses"  },
    { label: "UST Wellness", url: "#",                            cat: "Wellness" },
    { label: "Tutoring Center", url: "#",                         cat: "Wellness" },
    { label: "Library",  url: "#",                                cat: "Murphy"   },
  ];

  /* weekly agenda */
  const agendaItems = [
    { label: "Bio 201 lab report",   when: "Fri" },
    { label: "Project proposal",     when: "Mon" },
    { label: "Dentist · 2:00 PM",   when: "Thu" },
    { label: "History essay due",    when: "Fri" },
    { label: "SPAN vocab quiz",      when: "Wed" },
  ];

  /* ══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#fdf7fa]">
      <style>{`
        @font-face {
          font-family: 'PixelAE';
          src: url('/fonts/PixelAE-Regular.ttf') format('truetype');
          font-weight: 400;
        }
        @font-face {
          font-family: 'PixelAE';
          src: url('/fonts/PixelAE-Bold.ttf') format('truetype');
          font-weight: 700;
        }
        * { image-rendering: pixelated; }
        /* except regular text nodes */
        p, span, h1, h2, h3, h4, button, input, textarea, li { image-rendering: auto; }
      `}</style>

      {/* ── top bar ─────────────────────────────────────────── */}
      <header className="border-b-2 border-pink-200 bg-[#fffafc]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 px-5 py-2.5 sm:px-8">
          <div className="flex items-center gap-3">
            <button aria-label="Menu" className="rounded p-1 text-pink-700 hover:bg-pink-100">
              <Menu size={20} />
            </button>
            <span
              className="text-[17px] font-bold tracking-widest text-pink-700"
              style={{ fontFamily: "'PixelAE', monospace" }}
            >
              THE ORCHARD
            </span>
          </div>
          <p
            className="flex-1 text-center text-[12px] text-pink-600"
            style={{ fontFamily: "'PixelAE', monospace" }}
          >
            {dayDate}
          </p>
          <p
            className="text-right text-[12px] font-bold text-pink-700"
            style={{ fontFamily: "'PixelAE', monospace" }}
          >
            {timeStr} · {tempC}°C
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-7">

        {/* ── welcome hero ──────────────────────────────────── */}
        <section
        className="relative mb-5 overflow-hidden border-4 border-[#b87956] bg-[#ffe5b8] shadow-[6px_6px_0_rgba(99,62,45,0.18)]"
        style={{
          minHeight: 220,
          imageRendering: "pixelated",
          clipPath:
          "polygon(0 10px, 10px 10px, 10px 0, calc(100% - 10px) 0, calc(100% - 10px) 10px, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 10px calc(100% - 10px), 0 calc(100% - 10px))",
  }}
>

          {/* welcome background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/backgrounds/pink-cloud.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.95,
              imageRendering: "pixelated",
            }}
          />
          <div className="absolute inset-0 bg-[#ffe5b8]/35" />
          <div className="absolute inset-2 border-2 border-[#c58d64] opacity-70" />
          <div className="absolute inset-4 border border-[#d9ad7c] opacity-60" />
          <span className="absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-[#a9684a]" />
          <span className="absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-[#a9684a]" />
          <span className="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-[#a9684a]" />
          <span className="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-[#a9684a]" />

          {/* soft scrims */}
          <div className="absolute inset-y-0 left-0 w-2/5 bg-linear-to-r from-[#fffafc]/85 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-2/5 bg-linear-to-l from-[#fffafc]/85 to-transparent" />

          {/* three-column layout */}
          <div className="relative z-10 grid grid-cols-1 gap-6 px-6 py-6 sm:px-8 md:grid-cols-3 md:gap-4">

            {/* left — greeting + verse + stats */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold leading-tight text-stone-900 sm:text-2xl" style={{ fontFamily: "'PixelAE', monospace" }}>
                WELCOME,<br />RADHA RAQUEL
              </h1>
              <p className="mt-1 text-[11px] text-stone-600 leading-snug" style={{ fontFamily: "'PixelAE', monospace" }}>
                “{verse.text}”
                <span className="ml-1 font-bold text-pink-700">
                  — {verse.ref}
                </span>
              </p>
              <div className="mt-2 flex flex-col gap-0.5 text-[12px]" style={{ fontFamily: "'PixelAE', monospace" }}>
                <span className="text-stone-700">{assignmentsDue} assignments due</span>
                <span className="text-stone-700">{eventsCount} events to attend</span>
                {overdueCount > 0 && (
                  <span className="font-bold text-rose-600">{overdueCount} overdue</span>
                )}
              </div>
            </div>

            <div className="hidden md:block" />

            {/* right — week + activity list */}
            <div>
              <p className="text-[11px] font-bold text-stone-500" style={{ fontFamily: "'PixelAE', monospace" }}>
                Week {weekNum} of {now.getFullYear()} · {timeStr}
              </p>
              <button
                onClick={() => setWeekOpen(v => !v)}
                className="mt-1 flex items-center gap-1 text-[12px] font-bold text-pink-700 hover:text-pink-800"
                style={{ fontFamily: "'PixelAE', monospace" }}
              >
                <ChevronDown size={13} className={"transition-transform " + (weekOpen ? "rotate-180" : "")} />
                This week
              </button>
              {weekOpen && (
                <ul className="mt-1 space-y-1 overflow-y-auto" style={{ maxHeight: 120 }}>
                  {weeklyItems.map((it, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 border-t border-pink-200/70 py-1 first:border-0">
                      <span className="text-[11px] text-stone-700" style={{ fontFamily: "'PixelAE', monospace" }}>{it.label}</span>
                      <span className="shrink-0 text-[10px] text-pink-700/80" style={{ fontFamily: "'PixelAE', monospace" }}>{it.when}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* ── nav row ───────────────────────────────────────── */}
        <nav className="mb-5 flex gap-1 overflow-x-auto pb-1">
          {navItems.map(({ label }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={
                "flex shrink-0 items-center gap-1 rounded px-2.5 py-1 text-[11px] font-bold transition-colors border " +
                (activeNav === label
                  ? "bg-[#b8dfc2] border-[#9fc7a9] text-[#5f725f]"
                  : "border-pink-200/80 bg-[#fffafc] text-pink-700 hover:bg-pink-100")
              }
              style={{ fontFamily: "'PixelAE', monospace" }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* ── 3×3 card grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ gridAutoRows: "minmax(220px, auto)" }}>

          {/* 1. WEEKLY GOALS */}
          <Card title="Weekly Goals" accentBg="bg-[#f5cfe2]">
            <Checklist items={goals} setItems={setGoals} accentBg="bg-[#f5cfe2]" />
          </Card>

          {/* 2. DAILY TO-DO */}
          <Card title="Daily To-Do" accentBg="bg-[#cfead4]">
            <Checklist items={todos} setItems={setTodos} accentBg="bg-[#cfead4]" />
          </Card>

          {/* 3. WEEKLY AGENDA */}
          <Card title="Weekly Agenda" accentBg="bg-[#dcefdc]">
            <ul className="space-y-1.5 overflow-y-auto" style={{ maxHeight: 160 }}>
              {agendaItems.map((it, i) => (
                <li key={i} className="flex items-center justify-between gap-2 border-b border-stone-100 pb-1.5 last:border-0">
                  <span className="text-[12px] text-stone-700" style={{ fontFamily: "'PixelAE', monospace" }}>{it.label}</span>
                  <span className="shrink-0 rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-700" style={{ fontFamily: "'PixelAE', monospace" }}>
                    {it.when}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* 5. ACADEMICS */}
          <Card title="Academics" accentBg="bg-[#f3d8e7]">
            <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: 160 }}>
              {grades.map((g, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-600" style={{ fontFamily: "'PixelAE', monospace" }}>{g.subj}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 overflow-hidden rounded-none border border-stone-300 bg-stone-100">
                      <div className="h-full bg-purple-500" style={{ width: `${g.pct}%`, imageRendering: "pixelated" }} />
                    </div>
                    <span className="w-6 text-right text-[11px] font-bold text-stone-700" style={{ fontFamily: "'PixelAE', monospace" }}>{g.grade}</span>
                  </div>
                </div>
              ))}
              <div className="mt-1 flex items-center justify-between border-t-2 border-purple-200 pt-1">
                <span className="text-[11px] font-bold text-stone-700" style={{ fontFamily: "'PixelAE', monospace" }}>AVERAGE</span>
                <span className="text-[13px] font-bold text-purple-700" style={{ fontFamily: "'PixelAE', monospace" }}>B+</span>
              </div>
            </div>
          </Card>

          {/* 6. RESOURCES */}
          <Card title="Resources" accentBg="bg-[#d8efe0]">
            <div className="space-y-1.5">
              {["Courses","Wellness","Murphy"].map(cat => (
                <div key={cat}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5" style={{ fontFamily: "'PixelAE', monospace" }}>
                    {cat}
                  </p>
                  {resources.filter(r => r.cat === cat).map((r, i) => (
                    <a
                      key={i} href={r.url}
                      className="flex items-center gap-1 rounded px-1 py-0.5 text-[12px] text-teal-700 hover:bg-teal-50 hover:underline"
                      style={{ fontFamily: "'PixelAE', monospace" }}
                      target="_blank" rel="noreferrer"
                    >
                      <ExternalLink size={10} className="shrink-0" />
                      {r.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          {/* 7. OPPORTUNITIES / REJECTION TRACKER */}
          <Card title="Opportunities" accentBg="bg-[#f2dce8]">
            <div className="flex items-start gap-3">
              <PieChart accepted={accepted} rejected={rejected} pending={pending} />
              <div className="flex flex-col gap-1 text-[11px] text-stone-600" style={{ fontFamily: "'PixelAE', monospace" }}>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 bg-[#bcdcc2] border border-stone-200" /> {accepted} accepted</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 bg-[#e9bebe] border border-stone-200" /> {rejected} rejected</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 bg-[#e9d8a6] border border-stone-200" /> {pending} pending</span>
                <div className="mt-2 border-t border-stone-200 pt-1">
                  <p className="text-stone-500">Goal: {goalAcceptances} acceptances</p>
                  <p className="font-bold text-[#a7868b]">{Math.max(0, goalAcceptances - accepted)} more to go</p>
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-0.5 overflow-y-auto" style={{ maxHeight: 60 }}>
              {apps.map((a, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]" style={{ fontFamily: "'PixelAE', monospace" }}>
                  <span className="text-stone-600">{a.name}</span>
                  <span className={
                    "font-bold " +
                    (a.status === "accepted" ? "text-green-600" : a.status === "rejected" ? "text-red-500" : "text-yellow-600")
                  }>
                    {a.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* 8. BUDGET */}
          <Card title="Budget" accentBg="bg-[#dbeedb]">
            <p className="text-[10px] text-stone-400" style={{ fontFamily: "'PixelAE', monospace" }}>{budget.periodLabel}</p>
            {overBudget ? (
              <div className="mt-1 flex items-center gap-1.5 rounded border-2 border-red-300 bg-rose-50 px-2 py-1 text-rose-700">
                <AlertTriangle size={12} className="shrink-0" />
                <span className="text-[11px] font-bold" style={{ fontFamily: "'PixelAE', monospace" }}>
                  OVER by ${Math.abs(spendable).toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold text-stone-800" style={{ fontFamily: "'PixelAE', monospace" }}>${spendable.toFixed(2)}</span>
                <span className="text-[10px] text-stone-400" style={{ fontFamily: "'PixelAE', monospace" }}>left</span>
              </div>
            )}
            <div className="mt-1.5 h-2 w-full border-2 border-stone-300 bg-stone-100">
              <div
                className={"h-full " + (overBudget ? "bg-rose-600" : "bg-rose-400")}
                style={{ width: `${Math.min(100, (budget.spent / budget.allowance) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-stone-500" style={{ fontFamily: "'PixelAE', monospace" }}>
              <span className="font-bold text-stone-700">${budget.saved.toFixed(2)}</span> saved
            </p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-stone-400" style={{ fontFamily: "'PixelAE', monospace" }}>
              Recent
            </p>
            <ul className="mt-0.5 space-y-0.5">
              {expenses.map((e, i) => (
                <li key={i} className="flex justify-between text-[11px] text-stone-600" style={{ fontFamily: "'PixelAE', monospace" }}>
                  <span>{e.label}</span><span>-${e.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* 9. SELF CARE */}
          <Card title="Self Care" accentBg="bg-[#f4cfe1]">
            {/* mood row */}
            <div className="flex items-center justify-between mb-2">
              {MOODS.map(({ src, label }, i) => (
                <button
                  key={label}
                  onClick={() => setSelectedMood(i)}
                  aria-label={label}
                  className={
                    "flex flex-col items-center gap-0.5 rounded p-1 transition-colors " +
                    (selectedMood === i ? "bg-pink-100 ring-2 ring-pink-400" : "hover:bg-stone-100")
                  }
                >
                  <Image
                    src={src} alt={label}
                    width={22} height={22}
                    style={{ imageRendering: "pixelated" }}
                  />
                </button>
              ))}
            </div>
            <p className="mb-2 text-center text-[10px] font-bold text-pink-600" style={{ fontFamily: "'PixelAE', monospace" }}>
              {MOODS[selectedMood].label}
            </p>
            <Checklist items={selfCare} setItems={setSelfCare} accentBg="bg-pink-500" />
          </Card>

        </div>
      </main>
    </div>
  );
}