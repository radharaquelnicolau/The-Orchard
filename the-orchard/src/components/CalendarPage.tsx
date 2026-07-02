"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

// Shared Card Component (matching homepage styling)
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

// Monthly Calendar Component with pastel pink/green theme
function MonthlyCalendar({ currentDate, onDateClick, events, onMonthChange, selectedDate }) {
  const [calendarDays, setCalendarDays] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Adjust for Monday start
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(event => {
        const eventDate = event.start?.date || event.start?.dateTime?.split('T')[0];
        return eventDate === dateStr;
      });
      
      days.push({ 
        day, 
        isCurrentMonth: true,
        date: dateStr,
        events: dayEvents
      });
    }
    
    setCalendarDays(days);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  return (
    <Card title="Monthly View" className="flex-1">
      <div className="flex flex-col h-full">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded hover:bg-[#d7a06f]/30 text-[#7a4a36]"
          >
            <ChevronLeft size={20} />
          </button>
          <span
            className="text-[14px] font-bold text-[#7a4a36]"
            style={{ fontFamily: "'PixelAE', monospace" }}
          >
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded hover:bg-[#d7a06f]/30 text-[#7a4a36]"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-bold text-[#7a4a36]"
              style={{ fontFamily: "'PixelAE', monospace" }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {calendarDays.map((cell, index) => {
            const isSelected = cell.date === selectedDate;
            const isToday = cell.date === today && !isSelected;
            const hasEvents = cell.events?.length > 0;
            
            return (
              <button
                key={index}
                onClick={() => cell.day && onDateClick(cell.date)}
                disabled={!cell.day}
                className={
                  "relative aspect-square flex flex-col items-center justify-center transition-colors overflow-hidden " +
                  (cell.day
                    ? cell.isCurrentMonth
                      ? "hover:bg-[#f5cfe2]/70"
                      : "text-stone-300"
                    : "")
                }
                style={{
                  backgroundColor: isSelected
                    ? "#e8a0b0"
                    : isToday
                    ? "#ffd6e0"
                    : hasEvents
                    ? index % 2 === 0 ? "#f5cfe2" : "#cfead4"
                    : "#ffeef2",
                  borderTop: cell.day && cell.isCurrentMonth ? "2px solid #b87956" : "1px solid #e8a0b0/30",
                  borderBottom: cell.day && cell.isCurrentMonth ? "2px solid #b87956" : "1px solid #e8a0b0/30",
                  borderLeft: cell.day && cell.isCurrentMonth ? "2px solid #b87956" : "1px solid #e8a0b0/30",
                  borderRight: cell.day && cell.isCurrentMonth ? "2px solid #b87956" : "1px solid #e8a0b0/30",
                  imageRendering: "pixelated",
                  clipPath: cell.day && cell.isCurrentMonth
                    ? "polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))"
                    : "none"
                }}
              >
                {cell.day && cell.isCurrentMonth && (
                  <>
                    <span
                      className="absolute left-1 top-1 h-1.5 w-1.5 border-l border-t border-[#a9684a]"
                    />
                    <span
                      className="absolute right-1 top-1 h-1.5 w-1.5 border-r border-t border-[#a9684a]"
                    />
                    <span
                      className="absolute bottom-1 left-1 h-1.5 w-1.5 border-b border-l border-[#a9684a]"
                    />
                    <span
                      className="absolute bottom-1 right-1 h-1.5 w-1.5 border-b border-r border-[#a9684a]"
                    />
                  </>
                )}
                {cell.day && (
                  <>
                    <span
                      className="text-[11px] font-bold relative z-10"
                      style={{ 
                        fontFamily: "'PixelAE', monospace",
                        color: isSelected 
                          ? "#ffffff" 
                          : isToday 
                          ? "#7a4a36" 
                          : cell.isCurrentMonth 
                          ? "#7a4a36" 
                          : "#d1d5db"
                      }}
                    >
                      {cell.day}
                    </span>
                    {hasEvents && (
                      <div className="flex gap-0.5 mt-0.5 relative z-10">
                        {cell.events.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5"
                            style={{
                              backgroundColor: isSelected ? "#ffffff" : i % 2 === 0 ? "#f5cfe2" : "#cfead4",
                              border: isSelected ? "1px solid #ffffff" : "1px solid #a9684a",
                              imageRendering: "pixelated"
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// Daily View Component
function DailyView({ selectedDate, events, onAddEvent, onEditEvent }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour) => {
    return String(hour).padStart(2, '0') + ":00";
  };

  const getEventPositionAndHeight = (event) => {
    const startDateTime = event.start?.dateTime;
    const endDateTime = event.end?.dateTime;
    
    if (!startDateTime || !endDateTime) return null;
    
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);
    
    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
    const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
    const durationMinutes = endMinutes - startMinutes;
    
    // Each hour is 60px tall, so 1 minute = 1px
    const top = startMinutes;
    const height = Math.max(durationMinutes, 30); // Minimum 30px height
    
    return { top, height };
  };

  const displayDate = selectedDate 
    ? new Date(selectedDate).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric"
      })
    : new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric"
      });

  const hourHeight = 60; // 60px per hour

  return (
    <Card title="Daily View" className="flex-1">
      <div className="flex flex-col h-full">
        <div className="mb-3">
          <p
            className="text-[12px] font-bold text-[#7a4a36]"
            style={{ fontFamily: "'PixelAE', monospace" }}
          >
            {displayDate}
          </p>
        </div>

        <div 
          className="flex-1 overflow-y-auto relative" 
          style={{ 
            maxHeight: 400,
            backgroundColor: "#ffeef2",
            border: "2px solid #e8a0b0"
          }}
        >
          {/* Hour grid lines */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-b border-[#e8a0b0]/50"
              style={{ top: hour * hourHeight, height: hourHeight }}
            />
          ))}

          {/* Time labels and events */}
          <div style={{ height: hours.length * hourHeight, position: "relative" }}>
            {hours.map((hour) => (
              <div key={hour} className="flex items-start" style={{ height: hourHeight, position: "absolute", left: 0, right: 0, top: hour * hourHeight }}>
                <span
                  className="text-[10px] font-bold text-[#7a4a36] w-12 shrink-0 pl-2 pt-1"
                  style={{ fontFamily: "'PixelAE', monospace" }}
                >
                  {formatHour(hour)}
                </span>
              </div>
            ))}

            {/* Events positioned absolutely */}
            {events.map((event, idx) => {
              const position = getEventPositionAndHeight(event);
              if (!position) return null;
              
              return (
                <div
                  key={idx}
                  onClick={() => onEditEvent && onEditEvent(event)}
                  className="absolute left-14 right-2 px-2 py-1 overflow-hidden cursor-pointer hover:opacity-80"
                  style={{
                    top: position.top,
                    height: position.height,
                    fontFamily: "'PixelAE', monospace",
                    backgroundColor: idx % 2 === 0 ? "#f5cfe2" : "#ffd6e0",
                    color: "#7a4a36",
                    border: "2px solid #e8a0b0",
                    imageRendering: "pixelated",
                    clipPath: "polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))",
                  }}
                >
                  <p className="text-[10px] font-bold truncate">{event.summary || "No title"}</p>
                  {event.location && (
                    <p className="text-[8px] text-[#7a4a36]/70 truncate">{event.location}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onAddEvent}
          className="mt-3 flex items-center justify-center gap-2 rounded px-3 py-2 text-[11px] font-bold text-white transition-colors hover:opacity-90"
          style={{
            fontFamily: "'PixelAE', monospace",
            backgroundColor: "#f5cfe2",
            border: "2px solid #e8a0b0",
            color: "#7a4a36"
          }}
        >
          <Plus size={14} />
          Add Event
        </button>
      </div>
    </Card>
  );
}

// Event Dialog Component
function EventDialog({ isOpen, onClose, onSubmit, selectedDate, eventToEdit }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [notificationDays, setNotificationDays] = useState(0);
  const [notificationTime, setNotificationTime] = useState("09:00");

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        // Pre-fill form with existing event data
        setTitle(eventToEdit.summary || "");
        setLocation(eventToEdit.location || "");
        setDetails(eventToEdit.description || "");
        
        if (eventToEdit.start?.date) {
          // All-day event
          setAllDay(true);
          setStartDate(eventToEdit.start.date);
          setEndDate(eventToEdit.end?.date || eventToEdit.start.date);
        } else if (eventToEdit.start?.dateTime) {
          // Timed event
          setAllDay(false);
          const startDateTime = new Date(eventToEdit.start.dateTime);
          const endDateTime = new Date(eventToEdit.end?.dateTime);
          
          setStartDate(startDateTime.toISOString().split('T')[0]);
          setEndDate(endDateTime.toISOString().split('T')[0]);
          setStartTime(startDateTime.toTimeString().slice(0, 5));
          setEndTime(endDateTime.toTimeString().slice(0, 5));
        }
      } else {
        // Reset form for new event
        setTitle("");
        setStartDate(selectedDate);
        setEndDate(selectedDate);
        setStartTime("09:00");
        setEndTime("10:00");
        setAllDay(false);
        setLocation("");
        setDetails("");
        setNotificationDays(0);
        setNotificationTime("09:00");
      }
    }
  }, [isOpen, eventToEdit, selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const eventData = {
      summary: title,
      start: allDay 
        ? { date: startDate }
        : { dateTime: `${startDate}T${startTime}:00`, timeZone: userTimeZone },
      end: allDay
        ? { date: endDate }
        : { dateTime: `${endDate}T${endTime}:00`, timeZone: userTimeZone },
      location,
      description: details,
    };

    onSubmit(eventData);
    onClose();
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative overflow-hidden border-4 border-[#b87956] bg-[#ffe5b8] shadow-[6px_6px_0_rgba(99,62,45,0.18)] w-full max-w-md"
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

          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-4 border-b-2 border-[#d7a06f]/60 pb-2">
              <h3
                className="text-[13px] font-bold uppercase tracking-widest"
                style={{ fontFamily: "'PixelAE', monospace", color: "#7a4a36" }}
              >
                {eventToEdit ? "Edit Event" : "Add Event"}
              </h3>
              <button
                onClick={onClose}
                className="rounded p-1 text-[#7a4a36] hover:bg-[#d7a06f]/30"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  className="block text-[10px] font-bold text-[#7a4a36] mb-1"
                  style={{ fontFamily: "'PixelAE', monospace" }}
                >
                  Add title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded border-2 border-[#c58d64] bg-white px-2 py-1.5 text-[11px] text-stone-700 focus:outline-none focus:border-[#a9684a]"
                  style={{ fontFamily: "'PixelAE', monospace" }}
                  placeholder="Event title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-[10px] font-bold text-[#7a4a36] mb-1"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded border-2 border-[#c58d64] bg-white px-2 py-1.5 text-[11px] text-stone-700 focus:outline-none focus:border-[#a9684a]"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  />
                </div>
                <div>
                  <label
                    className="block text-[10px] font-bold text-[#7a4a36] mb-1"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded border-2 border-[#c58d64] bg-white px-2 py-1.5 text-[11px] text-stone-700 focus:outline-none focus:border-[#a9684a]"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-[10px] font-bold text-[#7a4a36] mb-1"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={allDay}
                    className="w-full rounded border-2 border-[#c58d64] bg-white px-2 py-1.5 text-[11px] text-stone-700 focus:outline-none focus:border-[#a9684a] disabled:opacity-50"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  />
                </div>
                <div>
                  <label
                    className="block text-[10px] font-bold text-[#7a4a36] mb-1"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={allDay}
                    className="w-full rounded border-2 border-[#c58d64] bg-white px-2 py-1.5 text-[11px] text-stone-700 focus:outline-none focus:border-[#a9684a] disabled:opacity-50"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allDay}
                    onChange={(e) => setAllDay(e.target.checked)}
                    className="w-4 h-4 accent-[#b8dfc2]"
                  />
                  <span
                    className="text-[10px] font-bold text-[#7a4a36]"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  >
                    All day
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-[#b8dfc2]"
                  />
                  <span
                    className="text-[10px] font-bold text-[#7a4a36]"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  >
                    Doesn't repeat
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-[10px] font-bold text-[#7a4a36] mb-1"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  >
                    Notification
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={notificationDays}
                      onChange={(e) => setNotificationDays(parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-12 rounded border-2 border-[#c58d64] bg-white px-2 py-1.5 text-[11px] text-stone-700 focus:outline-none focus:border-[#a9684a]"
                      style={{ fontFamily: "'PixelAE', monospace" }}
                    />
                    <span className="text-[10px] text-[#7a4a36]" style={{ fontFamily: "'PixelAE', monospace" }}>
                      days before at
                    </span>
                    <input
                      type="time"
                      value={notificationTime}
                      onChange={(e) => setNotificationTime(e.target.value)}
                      className="w-16 rounded border-2 border-[#c58d64] bg-white px-2 py-1.5 text-[11px] text-stone-700 focus:outline-none focus:border-[#a9684a]"
                      style={{ fontFamily: "'PixelAE', monospace" }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-[10px] font-bold text-[#7a4a36] mb-1"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded border-2 border-[#c58d64] bg-white px-2 py-1.5 text-[11px] text-stone-700 focus:outline-none focus:border-[#a9684a]"
                    style={{ fontFamily: "'PixelAE', monospace" }}
                    placeholder="Add location"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-[10px] font-bold text-[#7a4a36] mb-1"
                  style={{ fontFamily: "'PixelAE', monospace" }}
                >
                  Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  className="w-full rounded border-2 border-[#c58d64] bg-white px-2 py-1.5 text-[11px] text-stone-700 focus:outline-none focus:border-[#a9684a] resize-none"
                  style={{ fontFamily: "'PixelAE', monospace" }}
                  placeholder="Add details..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded px-3 py-2 text-[11px] font-bold text-white transition-colors hover:opacity-90"
                style={{
                  fontFamily: "'PixelAE', monospace",
                  backgroundColor: "#b8dfc2",
                  border: "2px solid #9fc7a9"
                }}
              >
                Save Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// Main Calendar Page Component
export default function CalendarPage({ session }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [events, setEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [calendarLoaded, setCalendarLoaded] = useState(false);

  useEffect(() => {
    async function loadCalendarEvents() {
      if (session) {
        setCalendarLoaded(false);
        try {
          const res = await fetch("/api/calendar/events");
          if (res.ok) {
            const data = await res.json();
            const fetchedEvents = data.events || [];
            setEvents(fetchedEvents);
          }
        } catch (error) {
          console.error("Could not load calendar events:", error);
        } finally {
          setCalendarLoaded(true);
        }
      } else {
        setEvents([]);
        setCalendarLoaded(false);
      }
    }

    loadCalendarEvents();
  }, [session]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    setEventToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setIsDialogOpen(true);
  };

  const handleEventSubmit = async (eventData) => {
    if (!session) {
      alert("Please sign in to add events to Google Calendar");
      return;
    }

    try {
      console.log("Submitting event data:", eventData);
      const url = eventToEdit 
        ? `/api/calendar/events/${eventToEdit.id}` 
        : "/api/calendar/events";
      const method = eventToEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (res.ok) {
        const data = await res.json();
        console.log("Event saved successfully:", data);
        
        if (eventToEdit) {
          // Update existing event in state
          setEvents(events.map(e => e.id === eventToEdit.id ? data.event : e));
        } else {
          // Add new event to state
          setEvents([...events, data.event]);
        }
      } else {
        const errorText = await res.text();
        console.error("Failed to save event. Status:", res.status);
        console.error("Error response:", errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText };
        }
        alert(`Failed to save event: ${error.message || error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert(`Failed to save event: ${error.message}`);
    }
  };

  const getEventsForSelectedDate = () => {
    return events.filter(event => {
      const eventDate = event.start?.date || event.start?.dateTime?.split('T')[0];
      return eventDate === selectedDate;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <MonthlyCalendar
        currentDate={currentDate}
        onDateClick={handleDateClick}
        events={events}
        onMonthChange={setCurrentDate}
        selectedDate={selectedDate}
      />
      <DailyView
        selectedDate={selectedDate}
        events={getEventsForSelectedDate()}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
      />
      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleEventSubmit}
        selectedDate={selectedDate}
        eventToEdit={eventToEdit}
      />
    </div>
  );
}
