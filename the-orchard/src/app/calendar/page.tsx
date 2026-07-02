"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Menu, X, Plus } from "lucide-react";
import CalendarPage from "@/components/CalendarPage";

export default function Calendar() {
  const { data: session } = useSession();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Calendar", href: "/calendar" },
    { label: "Agenda", href: "/agenda" },
    { label: "Academics", href: "/academics" },
    { label: "Goals", href: "/goals" },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Budget", href: "/budget" },
    { label: "Self Care", href: "/self-care" },
    { label: "Resources", href: "/resources" },
  ];

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
        p, span, h1, h2, h3, h4, button, input, textarea, li { image-rendering: auto; }
      `}</style>

      {/* Top Bar */}
      <header className="border-b-2 border-pink-200 bg-[#fffafc]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 px-5 py-2.5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Menu"
              onClick={() => setSideMenuOpen(true)}
              className="rounded p-1 text-pink-700 hover:bg-pink-100"
            >
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
            CALENDAR
          </p>
          <div className="w-20" />
        </div>
      </header>

      {/* Side Menu */}
      {sideMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSideMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-72 z-50 overflow-hidden border-4 border-[#b87956] bg-[#ffe5b8] shadow-[6px_6px_0_rgba(99,62,45,0.18)]">
            <div className="absolute inset-2 border-2 border-[#c58d64] opacity-70" />
            <div className="absolute inset-4 border border-[#d9ad7c] opacity-60" />
            <span className="absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-[#a9684a]" />
            <span className="absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-[#a9684a]" />
            <span className="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-[#a9684a]" />
            <span className="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-[#a9684a]" />

            <div className="relative z-10 flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-6 border-b-2 border-[#d7a06f]/60 pb-3">
                <h3
                  className="text-[13px] font-bold uppercase tracking-widest"
                  style={{ fontFamily: "'PixelAE', monospace", color: "#7a4a36" }}
                >
                  MENU
                </h3>
                <button
                  onClick={() => setSideMenuOpen(false)}
                  className="rounded p-1 text-[#7a4a36] hover:bg-[#d7a06f]/30"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="rounded px-3 py-2.5 text-left text-[12px] font-bold text-stone-700 hover:bg-[#d7a06f]/40 transition-colors"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Navigation Row */}
      <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-7">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={
                "flex shrink-0 items-center gap-1 rounded px-2.5 py-1 text-[11px] font-bold transition-colors border " +
                (item.href === "/calendar"
                  ? "bg-[#b8dfc2] border-[#9fc7a9] text-[#5f725f]"
                  : "border-pink-200/80 bg-[#fffafc] text-pink-700 hover:bg-pink-100")
              }
              style={{ fontFamily: "'PixelAE', monospace" }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 pb-6 sm:px-7">
        <CalendarPage session={session} />
      </main>
    </div>
  );
}
