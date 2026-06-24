/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, HeartHandshake, Award, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LoveNote } from "../types";

const LOVE_NOTES: LoveNote[] = [
  {
    id: 1,
    note: "I promise to choose you every single day, to cherish your dreams as my own, and to love you in all seasons of our lives.",
    category: "Promise",
  },
  {
    id: 2,
    note: "Your smile is my absolute favorite sight, and I promise to spend every day of my life keeping it radiant and genuine.",
    category: "Promise",
  },
  {
    id: 3,
    note: "I look forward to our slow Sunday mornings, warm cups of tea, and the quiet, beautiful universe that exists only between us.",
    category: "Affirmation",
  },
  {
    id: 4,
    note: "Thank you for bringing so much peace, purity, and light into my life. You are not just my future, you are my home.",
    category: "Gratitude",
  },
  {
    id: 5,
    note: "I promise to stand by your side as your greatest supporter, your safest shelter, and your truest friend through every wave of life.",
    category: "Promise",
  },
  {
    id: 6,
    note: "Every single detail of you, from your kindness to your laughter, makes me realize how incredibly lucky I am to build a life with you.",
    category: "Affirmation",
  },
  {
    id: 7,
    note: "I look forward to a lifetime of growing older with you, making mistakes, learning, laughing, and building our beautiful kingdom of joy.",
    category: "Promise",
  },
  {
    id: 8,
    note: "Thank you for being the reason behind my smile, my motivation, and my strength. You make me want to be the best version of myself.",
    category: "Gratitude",
  },
  {
    id: 9,
    note: "I promise to listen to you with an open heart, to love you with an open mind, and to keep you safe and warm in my arms forever.",
    category: "Promise",
  },
  {
    id: 10,
    note: "You are the most beautiful part of my life, my source of happiness, and my heart's absolute favorite destination.",
    category: "Affirmation",
  }
];

export default function LoveNotes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % LOVE_NOTES.length);
      setIsFlipped(false);
    }, 300);
  };

  const currentNote = LOVE_NOTES[currentIndex];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Promise":
        return <HeartHandshake className="w-4 h-4 text-art-accent" />;
      case "Affirmation":
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case "Gratitude":
        return <Award className="w-4 h-4 text-stone-600" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Promise":
        return "bg-art-bg text-art-ink border-art-accent/40";
      case "Affirmation":
        return "bg-amber-50/40 text-amber-800 border-amber-200";
      case "Gratitude":
        return "bg-stone-50 text-stone-700 border-stone-200";
      default:
        return "bg-stone-50 text-stone-700 border-stone-100";
    }
  };

  return (
    <div id="love-notes" className="bg-white/95 rounded-2xl p-6 border border-stone-200/60 shadow-sm flex flex-col items-center max-w-md w-full mx-auto relative overflow-hidden">
      {/* Decorative top gold line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-art-accent" />
      
      <div className="flex items-center gap-2 mb-4">
        <Quote className="w-4 h-4 text-art-accent" />
        <h3 className="font-serif font-bold text-art-ink text-lg">
          Daily Promises & Keepsakes
        </h3>
      </div>

      <div className="w-full h-44 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full bg-art-bg/40 rounded-xl p-5 border border-stone-100/60 flex flex-col justify-between items-center text-center relative"
          >
            {/* Category Pill */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider border ${getCategoryColor(currentNote.category)}`}>
              {getCategoryIcon(currentNote.category)}
              <span>{currentNote.category}</span>
            </div>

            {/* Note Text */}
            <p className="font-serif italic text-stone-800 text-base md:text-lg leading-relaxed px-2 flex-1 flex items-center justify-center">
              "{currentNote.note}"
            </p>

            {/* Page number */}
            <span className="text-[10px] font-mono text-stone-400">
              Note {currentIndex + 1} of {LOVE_NOTES.length}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Button to cycle */}
      <button
        onClick={handleNext}
        className="mt-5 w-full py-2.5 rounded-xl bg-art-accent hover:bg-art-accent/90 text-white font-sans font-semibold tracking-wider text-xs transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Reveal Another Promise
      </button>
    </div>
  );
}
