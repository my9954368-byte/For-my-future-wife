/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Flower2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RoseItem {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  emoji: string;
}

const EMOJIS = ["🌹", "🌹", "🌸", "🌺", "❤️", "✨"];
const ROSE_QUOTES = [
  "Like roses, my love for you blooms more beautifully with each passing day.",
  "You deserve all the flowers in the world, starting with this digital garden.",
  "Your kindness is like a fragrance that sweetens everything around you.",
  "In the garden of my life, you are the most exquisite, prized blossom.",
  "My heart blooms whenever I think of our beautiful future together."
];

export default function RoseBouquet() {
  const [roses, setRoses] = useState<RoseItem[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const addRose = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Generate random offsets around the center of the vase
    const xOffset = (Math.random() - 0.5) * 110; // -55 to 55
    const yOffset = -100 - Math.random() * 80;   // -100 to -180 (above vase)
    const rotate = (Math.random() - 0.5) * 45;   // -22.5 to 22.5 deg
    const scale = 0.8 + Math.random() * 0.4;     // 0.8 to 1.2
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    const newRose: RoseItem = {
      id: Date.now() + Math.random(),
      x: xOffset,
      y: yOffset,
      rotate,
      scale,
      emoji,
    };

    setRoses((prev) => [...prev, newRose]);
    
    // Periodically cycle quotes
    if (roses.length % 3 === 0) {
      setQuoteIndex((prev) => (prev + 1) % ROSE_QUOTES.length);
    }
  };

  const clearBouquet = () => {
    setRoses([]);
  };

  return (
    <div id="rose-bouquet" className="bg-white/95 rounded-2xl p-6 border border-stone-200/60 shadow-sm flex flex-col items-center max-w-md w-full mx-auto relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <Flower2 className="w-4.5 h-4.5 text-art-accent" />
        <h3 className="font-serif font-bold text-art-ink text-lg">
          Your Virtual Bouquet
        </h3>
      </div>
      
      <p className="text-stone-500 text-xs font-sans text-center mb-4 leading-relaxed max-w-xs">
        Tap below to plant a rose of love into your virtual vase. Watch your bouquet grow!
      </p>

      {/* The Vase Stage */}
      <div className="w-full h-56 bg-gradient-to-b from-stone-50/10 to-art-bg/30 rounded-xl relative overflow-hidden flex items-end justify-center border border-stone-200/50 shadow-inner">
        {/* Sky/Sun glow */}
        <div className="absolute top-4 w-24 h-24 rounded-full bg-art-accent/10 blur-xl pointer-events-none" />

        {/* Floating/Placed Roses */}
        <div className="absolute inset-0 flex items-end justify-center">
          <AnimatePresence>
            {roses.map((rose) => (
              <motion.div
                key={rose.id}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{
                  opacity: 1,
                  scale: rose.scale,
                  x: rose.x,
                  y: rose.y,
                  rotate: rose.rotate,
                }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                }}
                className="absolute text-3xl select-none pointer-events-none filter drop-shadow-md origin-bottom"
                style={{ bottom: "50px" }}
              >
                {rose.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* The Ceramic Vase */}
        <div className="relative z-10 w-24 h-28 flex flex-col justify-between items-center bg-gradient-to-b from-white/95 to-art-bg border border-art-accent/30 shadow-sm rounded-b-3xl rounded-t-lg origin-bottom mb-2 px-1">
          {/* Vase decoration */}
          <div className="w-full h-1 bg-art-accent/60 mt-2" />
          <HeartIconDecoration />
          <div className="w-full h-0.5 bg-art-accent/60 mb-4" />
        </div>

        {/* Counter sticker */}
        {roses.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 bg-art-accent text-white text-[10px] font-sans font-semibold tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1"
          >
            <Sparkles className="w-2.5 h-2.5 animate-pulse" />
            <span>{roses.length} Bloom{roses.length !== 1 && "s"}</span>
          </motion.div>
        )}
      </div>

      {/* Reactive Love Quote */}
      <div className="min-h-12 flex items-center justify-center text-center px-4 mt-4">
        <p className="text-stone-600 font-serif italic text-xs leading-relaxed max-w-xs transition-opacity duration-300">
          {roses.length === 0
            ? '"A rose represents silent promises. Pluck your first below."'
            : `"${ROSE_QUOTES[quoteIndex]}"`}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-full mt-4">
        <button
          onClick={addRose}
          className="flex-1 py-2.5 rounded-xl bg-art-accent hover:bg-art-accent/90 text-white font-sans font-semibold tracking-wider text-xs transition-all shadow-sm shadow-stone-100 hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <span>🌹 Add a Rose</span>
        </button>
        {roses.length > 0 && (
          <button
            onClick={clearBouquet}
            className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 font-sans text-xs font-semibold tracking-wider transition-all cursor-pointer"
            title="Reset Bouquet"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

function HeartIconDecoration() {
  return (
    <svg
      className="w-8 h-8 text-art-accent/60 opacity-60 flex-1 my-2"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
