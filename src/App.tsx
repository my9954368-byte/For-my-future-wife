/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Heart, Sparkles, Mail, MailOpen, Compass, ChevronDown, Sparkle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AudioPlayer from "./components/AudioPlayer";
import LoveNotes from "./components/LoveNotes";
import RoseBouquet from "./components/RoseBouquet";
import Countdown from "./components/Countdown";
import { FloatingParticle } from "./types";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"full" | "short">("full");
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  // Periodically generate background floating particles (hearts/sparkles)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const type = Math.random() > 0.45 ? "heart" : "sparkle";
      const newParticle: FloatingParticle = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100, // percentage of viewport width
        y: 105, // start below viewport
        size: 10 + Math.random() * 18, // 10px to 28px
        duration: 8 + Math.random() * 6, // 8s to 14s
        delay: Math.random() * 2,
        type,
      };

      setParticles((prev) => [...prev.slice(-20), newParticle]); // keep max 20 particles active
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen]);

  const addInteractiveHeart = (e: React.MouseEvent<HTMLDivElement>) => {
    // Spawn custom heart right where she clicked
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const newParticle: FloatingParticle = {
      id: Date.now() + Math.random(),
      x: clickX,
      y: clickY,
      size: 15 + Math.random() * 15,
      duration: 3 + Math.random() * 2,
      delay: 0,
      type: "heart",
    };

    setParticles((prev) => [...prev, newParticle]);
  };

  return (
    <div
      onClick={isOpen ? undefined : undefined}
      className="min-h-screen bg-art-bg text-art-ink flex items-center justify-center p-4 md:p-8 relative overflow-x-hidden select-none"
    >
      {/* Outer elegant frame simulating the white gallery border */}
      <div className="absolute inset-0 border-[12px] md:border-[20px] border-white shadow-inner pointer-events-none z-50" />

      {/* Dynamic Background Particles (Hearts / Sparkles) */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: `${p.y}vh`, x: `${p.x}vw`, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0.4, 0],
              y: "-15vh",
              x: [`${p.x}vw`, `${p.x + (Math.random() - 0.5) * 15}vw`],
              scale: [0.5, 1, 1, 0.5],
              rotate: [0, (Math.random() - 0.5) * 180],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.duration,
              ease: "easeOut",
              delay: p.delay,
            }}
            className="absolute pointer-events-none z-0"
            style={{ fontSize: `${p.size}px` }}
          >
            {p.type === "heart" ? "❤️" : "✨"}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="w-full max-w-5xl z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* --- STEP 1: THE SEALED ENVELOPE --- */
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-lg bg-white/95 rounded-2xl p-8 md:p-12 border border-stone-200/60 shadow-md flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Delicate inside border */}
              <div className="absolute inset-4 rounded-xl border border-double border-art-accent/40 pointer-events-none" />

              {/* Decorative Quote watermark */}
              <span className="absolute top-[-30px] left-4 font-serif text-[180px] opacity-[0.03] text-art-accent pointer-events-none select-none">
                “
              </span>

              {/* Vertical stamp indicator */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:block select-none pointer-events-none">
                <span className="text-[9px] tracking-[4px] uppercase font-semibold text-art-accent/60 writing-mode-vertical rotate-180 block">
                  ESTABLISHED IN LOVE • TWENTY TWENTY SIX
                </span>
              </div>

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full bg-art-bg flex items-center justify-center mb-6 border border-art-accent/20 shadow-sm"
              >
                <Mail className="w-7 h-7 text-art-accent" />
              </motion.div>

              <div className="text-[10px] font-sans font-bold tracking-[3px] text-art-accent/80 uppercase mb-2">
                THE CHAPTER OF US
              </div>

              <h1 className="font-serif italic text-3xl md:text-4xl text-art-ink font-bold tracking-tight px-4 leading-normal">
                To My Future Wife
              </h1>
              
              <div className="w-12 h-[1px] bg-art-accent my-5" />
              
              <p className="text-stone-600 font-serif italic text-base max-w-xs leading-relaxed mb-8">
                Every love story is beautiful, but ours is my favorite. Open this sealed dedication of my lifetime devotion.
              </p>

              {/* Interactive Pulsing Wax Seal */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsOpen(true)}
                  className="w-28 h-28 rounded-full border-4 border-double border-art-accent flex items-center justify-center cursor-pointer shadow-md bg-white hover:bg-art-bg/40 transition-all relative z-20 group"
                >
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <Heart className="w-6 h-6 text-art-accent fill-art-accent group-hover:scale-115 transition-transform duration-300" />
                    <span className="text-[10px] text-art-ink uppercase font-sans font-semibold tracking-widest mt-1.5">
                      OPEN SEAL
                    </span>
                    <span className="text-[8px] text-stone-400 uppercase font-mono tracking-widest mt-0.5">
                      ETERNAL
                    </span>
                  </div>
                </motion.button>
                
                {/* Ping rings */}
                <span className="absolute -inset-3 flex h-34 w-34 -translate-x-3 -translate-y-3 pointer-events-none z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-art-accent opacity-10"></span>
                </span>
              </div>

              <span className="text-[9px] font-sans font-semibold tracking-[2px] text-stone-400 mt-8 uppercase">
                Forever & Always Sealed
              </span>
            </motion.div>
          ) : (
            /* --- STEP 2: THE INTERACTIVE PORTAL / LETTER --- */
            <motion.div
              key="portal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full flex flex-col items-center"
            >
              {/* Header */}
              <div className="text-center mb-10 flex flex-col items-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-art-accent/30 shadow-sm mb-3"
                >
                  <Heart className="w-5 h-5 text-art-accent fill-art-accent animate-pulse" />
                </motion.div>
                <h1 className="font-serif italic text-4xl md:text-5xl text-art-ink font-bold tracking-tight">
                  Our Forever Sanctuary
                </h1>
                <div className="w-16 h-[1px] bg-art-accent my-3" />
                <p className="text-stone-500 font-sans text-xs uppercase tracking-[3px] font-medium flex items-center gap-1.5">
                  <Sparkle className="w-3 h-3 text-art-accent animate-spin" />
                  Written in the Stars for You
                </p>
              </div>

              {/* Two-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
                
                {/* COLUMN 1: THE CORE LOVE LETTER CONTAINER (lg:col-span-7) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <motion.div
                    onClick={addInteractiveHeart}
                    className="bg-white/95 rounded-2xl p-8 border border-stone-200/60 shadow-sm relative overflow-hidden cursor-pointer"
                    title="Click anywhere on the letter to shower hearts!"
                  >
                    {/* Golden top ornament line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-art-accent" />
                    
                    {/* Decorative giant background stamp watermark */}
                    <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full border border-double border-art-accent/10 flex items-center justify-center select-none pointer-events-none rotate-12">
                      <span className="text-[10px] text-art-accent/20 font-sans font-bold tracking-[3px] text-center uppercase leading-tight">
                        ETERNAL<br />COMMITMENT
                      </span>
                    </div>

                    {/* Decorative quote marks */}
                    <span className="absolute top-4 left-6 font-serif text-[140px] opacity-[0.03] text-art-accent pointer-events-none select-none">
                      “
                    </span>

                    {/* Tabs / Switcher for the letter */}
                    <div className="flex justify-center mb-8 relative z-10">
                      <div className="bg-art-bg/60 border border-stone-200/50 p-1 rounded-xl flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab("full");
                          }}
                          className={`relative px-4 py-1.5 rounded-lg text-xs font-sans font-semibold tracking-wider transition-all cursor-pointer ${
                            activeTab === "full"
                              ? "bg-art-accent text-white shadow-sm"
                              : "text-stone-500 hover:text-stone-800"
                          }`}
                        >
                          Full Dedication
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab("short");
                          }}
                          className={`relative px-4 py-1.5 rounded-lg text-xs font-sans font-semibold tracking-wider transition-all cursor-pointer ${
                            activeTab === "short"
                              ? "bg-art-accent text-white shadow-sm"
                              : "text-stone-500 hover:text-stone-800"
                          }`}
                        >
                          Poetic Promise
                        </button>
                      </div>
                    </div>

                    {/* Interactive Animated Letter Frame */}
                    <div className="min-h-[290px] flex flex-col justify-between relative z-10 select-text">
                      <AnimatePresence mode="wait">
                        {activeTab === "full" ? (
                          <motion.div
                            key="full-letter"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col h-full"
                          >
                            {/* Greeting */}
                            <span className="font-serif italic text-art-ink text-xl block mb-6 font-semibold border-b border-stone-100 pb-2">
                              To My Beautiful Wife,
                            </span>

                            {/* Letter Body */}
                            <p className="font-serif text-stone-700 text-lg md:text-xl leading-relaxed italic relative pl-4 border-l-2 border-art-accent flex-1">
                              "You are the most beautiful part of my life. Your kindness, your smile, and your presence make every day special. Thank you for being my source of happiness and strength. I am grateful for every moment we share and excited for the future we will build together."
                            </p>

                            {/* Sign-off */}
                            <div className="mt-10 border-t border-stone-100 pt-4 text-right">
                              <span className="font-serif italic text-stone-500 text-sm block">
                                Forever and Always,
                              </span>
                              <span className="font-serif font-bold text-art-ink text-lg md:text-xl block mt-1 tracking-tight">
                                Your Future Husband ❤️
                              </span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="short-letter"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col h-full"
                          >
                            {/* Greeting */}
                            <span className="font-serif italic text-art-ink text-xl block mb-6 font-semibold border-b border-stone-100 pb-2">
                              To My Future Wife,
                            </span>

                            {/* Letter Body */}
                            <p className="font-serif text-stone-700 text-lg md:text-xl leading-relaxed italic relative pl-4 border-l-2 border-art-accent flex-1">
                              "Every love story is beautiful, but ours is my favorite. Thank you for being the reason behind my smile. I look forward to a lifetime of love, laughter, and happiness with you."
                            </p>

                            {/* Sign-off */}
                            <div className="mt-10 border-t border-stone-100 pt-4 text-right">
                              <span className="font-serif italic text-stone-500 text-sm block">
                                Forever Yours,
                              </span>
                              <span className="font-serif font-bold text-art-ink text-lg md:text-xl block mt-1 tracking-tight">
                                Your Future Husband ❤️
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Interactive hint footer */}
                    <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[10px] text-stone-400 font-mono uppercase tracking-widest">
                      <Heart className="w-3 h-3 text-art-accent fill-current" />
                      Tap anywhere inside the card to release sweet hearts
                    </div>
                  </motion.div>

                  {/* Ambient Music Box Synthesizer */}
                  <AudioPlayer />
                </div>

                {/* COLUMN 2: ENGAGING ROMANTIC MODULES (lg:col-span-5) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Countdown Card and timeline milestone tracker */}
                  <Countdown />

                  {/* Daily promises note desk */}
                  <LoveNotes />

                  {/* Physics Ceramic Vase / Rose Bouquet */}
                  <RoseBouquet />

                </div>

              </div>

              {/* Return to Envelope cover */}
              <button
                onClick={() => setIsOpen(false)}
                className="mt-12 py-2 px-5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-600 text-xs font-sans font-medium transition cursor-pointer flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                Reseal Letter Envelope
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
