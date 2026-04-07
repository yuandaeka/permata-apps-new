import React, { useState, useContext } from 'react';
import { CultureContext } from '../App';
import { Sparkles, Send } from 'lucide-react';

const Journal = () => {
  const { culture } = useContext(CultureContext);
  const [msg, setMsg] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-black/5">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <Sparkles className="text-yellow-500" /> Jurnal Hikmah 
        </h2>
        <p className="mt-2 opacity-50 italic">Refleksi berbasis perspektif {culture}[cite: 79].</p>
        <textarea 
          className="w-full h-64 mt-8 p-6 bg-gray-50 rounded-2xl border-none outline-none text-lg italic"
          placeholder="Tuangkan refleksimu di sini..."
          value={msg} 
          onChange={e => setMsg(e.target.value)}
        />
        <button className="mt-6 w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-xl flex justify-center items-center gap-2">
          <Send size={18}/> Analisis Pertumbuhan (AI) [cite: 85]
        </button>
      </div>
    </div>
  );
};

export default Journal;