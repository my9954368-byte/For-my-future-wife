/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { Music, Play, Square, Volume2 } from "lucide-react";
import { motion } from "motion/react";

// Frequencies for a beautiful romantic progression in A Major / F# Minor / D Major / E Major
// A4=440Hz, C#5=554.37Hz, E5=659.25Hz, F#4=369.99Hz, G#4=415.30Hz, B4=493.88Hz, D4=293.66Hz, E4=329.63Hz, A5=880Hz, C#6=1108.73Hz
const MELODY = [
  // Measure 1: A Major
  { note: 440.00, time: 0 },    // A4
  { note: 554.37, time: 0.5 },  // C#5
  { note: 659.25, time: 1.0 },  // E5
  { note: 880.00, time: 1.5 },  // A5
  // Measure 2: F# Minor
  { note: 369.99, time: 2.0 },  // F#4
  { note: 440.00, time: 2.5 },  // A4
  { note: 554.37, time: 3.0 },  // C#5
  { note: 659.25, time: 3.5 },  // E5
  // Measure 3: D Major
  { note: 293.66, time: 4.0 },  // D4
  { note: 440.00, time: 4.5 },  // A4
  { note: 554.37, time: 5.0 },  // C#5
  { note: 880.00, time: 5.5 },  // A5
  // Measure 4: E Major
  { note: 329.63, time: 6.0 },  // E4
  { note: 415.30, time: 6.5 },  // G#4
  { note: 493.88, time: 7.0 },  // B4
  { note: 659.25, time: 7.5 },  // E5
];

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const nextNoteIndexRef = useRef(0);
  const startTimeRef = useRef(0);

  // Play a single sweet music box bell sound
  const playBell = (ctx: AudioContext, frequency: number, time: number) => {
    // Oscillator
    const osc = ctx.createOscillator();
    // Soft triangle wave combined with a gentle sine wave for physical bell timbre
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, time);

    // Gain node for envelope
    const gainNode = ctx.createGain();
    
    // Quick attack, long linear decay to sound like a music box hammer hit
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.15 * volume, time + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);

    // Filter to make it warmer and less harsh
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1500, time);

    // Connect nodes
    osc.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(ctx.destination);

    // Play and stop
    osc.start(time);
    osc.stop(time + 2.0);
  };

  const startSequencer = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    startTimeRef.current = ctx.currentTime;
    nextNoteIndexRef.current = 0;

    // A schedule loop running every 200ms
    const scheduleAheadTime = 0.3; // How far ahead to schedule
    
    const tick = () => {
      const elapsed = ctx.currentTime - startTimeRef.current;
      const loopDuration = 8.0; // 8 seconds total loop
      const currentLoopStart = Math.floor(elapsed / loopDuration) * loopDuration;
      
      // Schedule notes that fall within our lookahead window
      MELODY.forEach((noteEvent) => {
        const noteAbsoluteTime = startTimeRef.current + currentLoopStart + noteEvent.time;
        // Schedule if it lies ahead, but not too far ahead
        if (
          noteAbsoluteTime >= ctx.currentTime &&
          noteAbsoluteTime < ctx.currentTime + scheduleAheadTime
        ) {
          playBell(ctx, noteEvent.note, noteAbsoluteTime);
        }
      });
    };

    // Run tick immediately, then set interval
    tick();
    const intervalId = window.setInterval(tick, 250);
    intervalRef.current = intervalId;
    setIsPlaying(true);
  };

  const stopSequencer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopSequencer();
    } else {
      startSequencer();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div id="audio-player" className="bg-white/95 rounded-2xl p-5 border border-stone-200/60 shadow-sm flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto">
      {/* Vinyl/Disk visualization */}
      <div className="relative">
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-900 border-2 border-art-accent/30 flex items-center justify-center shadow-md relative"
        >
          {/* Vinyl grooves */}
          <div className="absolute inset-2 rounded-full border border-stone-700/60" />
          <div className="absolute inset-4 rounded-full border border-stone-700/60" />
          {/* Label */}
          <div className="w-6 h-6 rounded-full bg-art-bg border border-art-accent/20 flex items-center justify-center">
            <Music className="w-3.5 h-3.5 text-art-accent" />
          </div>
        </motion.div>
        
        {/* Play indicator dot */}
        {isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-art-accent/40 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-art-accent"></span>
          </span>
        )}
      </div>

      {/* Track details & Controls */}
      <div className="flex-1 text-center sm:text-left">
        <h4 className="font-serif font-semibold text-art-ink text-lg leading-tight">
          Sweet Promise
        </h4>
        <p className="text-stone-500 text-xs font-sans mt-0.5">
          Ambient Music Box Synth
        </p>
        
        {/* Simple controller block */}
        <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
          <button
            onClick={togglePlayback}
            className="w-8 h-8 rounded-full bg-art-accent hover:bg-art-accent/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Square className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3 h-3 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Volume container */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-stone-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-art-accent h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
