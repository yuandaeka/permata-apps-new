"use client";

import React from "react";
import { motion, MotionConfig } from "framer-motion";
import { TreePine } from "lucide-react";

interface HopeTreeProps {
  level: number;
}

const HopeTree = ({ level }: HopeTreeProps) => {
  const size = Math.min(160 + level * 16, 240);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative flex flex-col items-center"
        aria-label={`Pohon Harapan Level ${level} dari 5`}
      >
        <motion.div
          animate={{
            y: [0, -3, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="text-brand-600"
        >
          <TreePine size={size} strokeWidth={1.5} />
        </motion.div>

        {/* Progress Dots */}
        <div className="flex gap-3 mt-8" role="presentation">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i < level ? "bg-brand-500" : "bg-neutral-100"
              }`}
            />
          ))}
        </div>

        <p className="mt-3 text-sm text-fg-subtle">
          Level {level} dari 5
        </p>
      </div>
    </MotionConfig>
  );
};

export { HopeTree };
export default HopeTree;
