/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LoveNote {
  id: number;
  note: string;
  category: "Promise" | "Affirmation" | "Gratitude";
}

export interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "heart" | "rose" | "sparkle";
}

export interface TimelineEvent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  date?: string;
  isCompleted: boolean;
}
