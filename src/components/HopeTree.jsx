import React from 'react';
import { motion } from 'framer-motion';
import { TreePine } from 'lucide-react';

const HopeTree = ({ level }) => {
  return (
    <div className="relative flex flex-col items-center">
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 2, -2, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="text-green-800 drop-shadow-2xl"
      >
        <TreePine size={180 + (level * 20)} strokeWidth={1} />
      </motion.div>
      
      {/* Progress Dots */}
      <div className="flex gap-3 mt-10">
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-4 h-4 rounded-full ${i < level ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-black/5'}`}
          />
        ))}
      </div>
      <p className="mt-4 text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">Pohon Harapan (Level {level}) [cite: 88, 89]</p>
    </div>
  );
};

export default HopeTree;