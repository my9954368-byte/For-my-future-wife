/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Calendar, Heart, Sparkles, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TimelineEvent } from "../types";

export default function Countdown() {
  // Try loading wedding date from localStorage, defaulting to a year from today
  const [weddingDate, setWeddingDate] = useState(() => {
    const saved = localStorage.getItem("future_wedding_date");
    if (saved) return saved;
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    return future.toISOString().split("T")[0];
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isArrived: false,
  });

  const [milestones, setMilestones] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem("future_wife_milestones");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        title: "Our First Conversation",
        subtitle: "The moment our worlds aligned",
        description: "When a simple greeting bloomed into hours of conversation and a lifetime of shared laughter.",
        date: "2024-05-12",
        isCompleted: true,
      },
      {
        id: 2,
        title: "The Proposal",
        subtitle: "Two hearts, one lifelong promise",
        description: "Looking into your eyes and asking to build a beautiful forever together.",
        date: "2025-08-20",
        isCompleted: true,
      },
      {
        id: 3,
        title: "Our Engagement",
        subtitle: "Holding onto eternity",
        description: "A beautiful celebration marking the sweet bridge between dating and forever.",
        date: "2025-12-15",
        isCompleted: true,
      },
      {
        id: 4,
        title: "Our Blessed Wedding Day",
        subtitle: "When two become one",
        description: "Standing hand in hand, promising a lifetime of pure devotion and laughter.",
        isCompleted: false,
      }
    ];
  });

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Save milestones when they change
  useEffect(() => {
    localStorage.setItem("future_wife_milestones", JSON.stringify(milestones));
  }, [milestones]);

  // Update countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(weddingDate + "T00:00:00") - +new Date();
      let timeLeftData = { days: 0, hours: 0, minutes: 0, seconds: 0, isArrived: false };

      if (difference > 0) {
        timeLeftData = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isArrived: false,
        };
      } else {
        timeLeftData.isArrived = true;
      }
      setTimeLeft(timeLeftData);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWeddingDate(val);
    localStorage.setItem("future_wedding_date", val);
  };

  const handleToggleMilestone = (id: number) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isCompleted: !m.isCompleted } : m))
    );
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const event: TimelineEvent = {
      id: Date.now(),
      title: newTitle.trim(),
      subtitle: newDate ? new Date(newDate).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "Upcoming Milestone",
      description: newDesc.trim(),
      date: newDate || undefined,
      isCompleted: false,
    };

    setMilestones((prev) => [...prev, event].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }));

    setNewTitle("");
    setNewDesc("");
    setNewDate("");
    setShowAddForm(false);
  };

  const handleDeleteMilestone = (id: number) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div id="countdown-card" className="bg-white/95 rounded-2xl p-6 border border-stone-200/60 shadow-sm flex flex-col max-w-md w-full mx-auto relative">
      <div className="absolute top-0 inset-x-0 h-1 bg-art-accent" />
      
      {/* Date Configuration */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-art-accent" />
          <h3 className="font-serif font-bold text-art-ink text-lg">
            Our Forever Countdown
          </h3>
        </div>
        <input
          type="date"
          value={weddingDate}
          onChange={handleDateChange}
          className="text-xs font-sans border border-stone-200/60 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-art-accent bg-art-bg/40 text-stone-700 font-medium cursor-pointer"
          title="Set target countdown date"
        />
      </div>

      {/* Countdown Grid */}
      {timeLeft.isArrived ? (
        <div className="text-center py-6 bg-art-bg/50 rounded-xl border border-art-accent/30 mb-6">
          <Heart className="w-8 h-8 text-art-accent mx-auto mb-2 animate-pulse" />
          <p className="font-serif italic text-art-ink text-lg font-medium">
            Our Wedding Day is Here!
          </p>
          <p className="text-stone-500 text-xs font-sans mt-1">
            Wishing you a lifetime of love and happiness together.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 text-center mb-6">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Mins", value: timeLeft.minutes },
            { label: "Secs", value: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="bg-art-bg/40 rounded-xl p-3 border border-stone-150 shadow-inner flex flex-col justify-center">
              <span className="font-serif font-bold text-art-ink text-2xl tracking-tight block">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-stone-400 mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Timeline Milestones Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-serif font-bold text-art-ink text-base flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-art-accent" />
          Our Love Story Timeline
        </h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs text-art-accent font-semibold font-sans hover:text-art-accent/80 transition flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Event
        </button>
      </div>

      {/* Add Milestone Form */}
      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleAddMilestone}
          className="mb-5 p-3.5 bg-stone-50 rounded-xl border border-stone-150 text-xs flex flex-col gap-3"
        >
          <input
            type="text"
            required
            placeholder="Event Title (e.g., First Date)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full border border-stone-200 rounded-lg p-2 focus:ring-1 focus:ring-art-accent focus:outline-none bg-white text-stone-700"
          />
          <input
            type="text"
            placeholder="Sweet Subtitle (e.g., When we held hands)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full border border-stone-200 rounded-lg p-2 focus:ring-1 focus:ring-art-accent focus:outline-none bg-white text-stone-700"
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full border border-stone-200 rounded-lg p-2 focus:ring-1 focus:ring-art-accent focus:outline-none bg-white text-stone-700 cursor-pointer"
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-1.5 rounded-md bg-stone-250 text-stone-600 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md bg-art-accent hover:bg-art-accent/90 text-white font-medium shadow-sm cursor-pointer"
            >
              Save Milestone
            </button>
          </div>
        </motion.form>
      )}

      {/* Vertical Timeline */}
      <div className="flex flex-col relative pl-4 border-l-2 border-art-accent/20 ml-2.5 gap-5 pb-2">
        {milestones.map((milestone, idx) => (
          <div key={milestone.id} className="relative flex flex-col">
            {/* Left Node Dot */}
            <button
              onClick={() => handleToggleMilestone(milestone.id)}
              className="absolute -left-[23px] top-1 w-4.5 h-4.5 rounded-full bg-white border-2 flex items-center justify-center cursor-pointer transition focus:outline-none hover:scale-110"
              style={{
                borderColor: milestone.isCompleted ? "var(--color-art-accent)" : "#d1d5db",
              }}
              title={milestone.isCompleted ? "Mark Uncompleted" : "Mark Completed"}
            >
              {milestone.isCompleted && (
                <div className="w-1.5 h-1.5 rounded-full bg-art-accent" />
              )}
            </button>

            <div className="flex justify-between items-start">
              <div>
                <span className="font-serif font-bold text-art-ink text-sm block">
                  {milestone.title}
                </span>
                {milestone.date && (
                  <span className="text-[10px] font-sans font-semibold tracking-wider text-art-accent uppercase">
                    {new Date(milestone.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
                <p className="text-stone-500 text-xs font-sans mt-1 leading-relaxed max-w-[280px]">
                  {milestone.description}
                </p>
              </div>

              {/* Custom events can be deleted */}
              {milestone.id > 10 && (
                <button
                  onClick={() => handleDeleteMilestone(milestone.id)}
                  className="text-stone-300 hover:text-red-500 transition p-1 cursor-pointer"
                  title="Delete event"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
