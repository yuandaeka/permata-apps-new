import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { MapPin, LayoutDashboard, BookOpen, Home } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import GameQuake from "./pages/GameQuake";
import GameHealing from "./pages/GameHealing";
import GameAdventure from "./pages/GameAdventure";
import RoleplayPsy from "./pages/RoleplayPsy";
import TeleScreening from "./pages/TeleScreening";
import AiCompanion from "./pages/AiCompanion";
import MoodFoodAnalyzer from "./pages/MoodFoodAnalyzer";
import GameBreathing from "./pages/GameBreathing";
import GameSiagaMinang from './pages/GameSiagaMinang';


export const CultureContext = createContext();

function App() {
  const [culture, setCulture] = useState('Aceh'); 

  // Penentuan tema berdasarkan Geo-Cultural Tagging
  const theme = culture === 'Aceh' 
    ? { bg: "bg-[#F0F4F2]", text: "text-[#1B4332]", btn: "bg-[#1B4332]", accent: "text-[#D4AF37]" }
    : { bg: "bg-[#FDF5E6]", text: "text-[#7B0000]", btn: "bg-[#7B0000]", accent: "text-[#FFD700]" };

  return (
    <CultureContext.Provider value={{ culture, setCulture, theme }}>
      <BrowserRouter>
        <div className={`min-h-screen transition-all duration-1000 ${theme.bg} ${theme.text} font-sans selection:bg-black selection:text-white`}>
          <nav className="sticky top-0 z-50 bg-white/30 backdrop-blur-md border-b border-black/5 px-8 py-5">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link to="/" className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                PERMATA <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </Link>
              
              <div className="hidden md:flex gap-10 font-black uppercase text-[10px] tracking-[0.2em]">
                <Link to="/" className="hover:opacity-50 transition flex items-center gap-2 underline-offset-8 hover:underline">
                  <Home size={14} /> Home
                </Link>
                <Link to="/dashboard" className="hover:opacity-50 transition flex items-center gap-2 underline-offset-8 hover:underline">
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link to="/jurnal" className="hover:opacity-50 transition flex items-center gap-2 underline-offset-8 hover:underline">
                  <BookOpen size={14} /> Jurnal Hikmah
                </Link>
              </div>

              <button 
                onClick={() => setCulture(c => c === 'Aceh' ? 'Sumbar' : 'Aceh')}
                className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl text-white text-[10px] font-black tracking-widest transition-all active:scale-95 ${theme.btn} hover:opacity-90`}
              >
                <MapPin size={14} /> LOKASI: {culture.toUpperCase()}
              </button>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jurnal" element={<Journal />} />
            <Route path="/game-quake" element={<GameQuake />} />
            <Route path="/game-healing" element={<GameHealing />} />
            <Route path="/game-adventure" element={<GameAdventure />} />
            <Route path="/roleplay" element={<RoleplayPsy />} />
            <Route path="/tele-screening" element={<TeleScreening />} />
            <Route path="/ai-companion" element={<AiCompanion />} />
            <Route path="/mood-food" element={<MoodFoodAnalyzer />} />
            <Route path="/game-breath" element={<GameBreathing />} />
            <Route path="/game-siagaminang" element={<GameSiagaMinang/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </CultureContext.Provider>
  );
}

export default App;