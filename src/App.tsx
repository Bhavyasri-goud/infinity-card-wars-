/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { PlayerProfile, GameScreen, HeroCard, PlayerLevelTitle } from './types';
import { INITIAL_HEROES, INITIAL_ACHIEVEMENTS, TITLES_LIST } from './data/heroes';
import { soundEngine } from './components/SoundSystem';

// Layout components
import MainMenu from './components/MainMenu';
import TeamBuilder from './components/TeamBuilder';
import CollectionPage from './components/CollectionPage';
import BattleArea from './components/BattleArea';
import StorePage from './components/StorePage';
import Leaderboards from './components/Leaderboards';
import ShieldTacticalAI from './components/ShieldTacticalAI';

import { 
  Shield, 
  User, 
  Swords, 
  Gem, 
  ShoppingBag, 
  Trophy, 
  MessageSquareCode, 
  Volume2, 
  VolumeX,
  Sparkles,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Main initial defaults
const DEFAULTS_SQUAD_HEROES_IDS = ['captain_america', 'black_widow', 'hawkeye', 'spider_man', 'ant_man'];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<GameScreen>('Hq');
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [activeSquadIds, setActiveSquadIds] = useState<string[]>(DEFAULTS_SQUAD_HEROES_IDS);
  const [soundOn, setSoundOn] = useState(true);

  // Initialize profile with Local Storage save system
  useEffect(() => {
    try {
      const saved = localStorage.getItem('avengers_cardwars_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        // Also map active squad properly from first 5 owned
        const squadIds = parsed.ownedHeroes.slice(0, 5).map((h: any) => h.id);
        setActiveSquadIds(squadIds);
      } else {
        // Build beautiful default starter deck
        const startingDeck: HeroCard[] = INITIAL_HEROES.map((h, index) => {
          const isStarter = DEFAULTS_SQUAD_HEROES_IDS.includes(h.id);
          return {
            ...h,
            level: 1,
            experience: 0,
            xpNeeded: 100,
            evolutionStage: 'Base' as const,
            skins: [h.id],
            currentSkin: h.id
          };
        }).filter(h => DEFAULTS_SQUAD_HEROES_IDS.includes(h.id)); // Limit initially to starter 5!

        const defaultProfile: PlayerProfile = {
          username: 'BHAVYASRI_AGENT',
          level: 1,
          xp: 0,
          xpNeeded: 100,
          gold: 2400,
          crystals: 180,
          title: 'Recruit',
          avatarId: 'shield_icon',
          unlockedChests: 0,
          ownedHeroes: startingDeck,
          achievements: INITIAL_ACHIEVEMENTS,
          claimedDailyDays: [],
          bossesDefeated: [],
          lastLoginDate: new Date().toISOString()
        };

        setProfile(defaultProfile);
        localStorage.setItem('avengers_cardwars_profile', JSON.stringify(defaultProfile));
      }
    } catch (e) {
      console.error("Local storage restoration broken:", e);
    }
  }, []);

  // Update save file when profile shifts
  const handleUpdateProfile = (updated: PlayerProfile) => {
    // Dynamic titles assessment based on level
    const matchedTitle = TITLES_LIST.sort((a, b) => b.minLevel - a.minLevel).find(t => updated.level >= t.minLevel);
    if (matchedTitle) {
      updated.title = matchedTitle.title as PlayerLevelTitle;
    }

    setProfile(updated);
    try {
      localStorage.setItem('avengers_cardwars_profile', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSound = () => {
    const nextVal = !soundOn;
    setSoundOn(nextVal);
    soundEngine.setEnabled(nextVal);
    if (nextVal) {
      soundEngine.playClick();
    }
  };

  const handleScreenChange = (screen: GameScreen) => {
    soundEngine.playClick();
    setActiveScreen(screen);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0B0D17] text-white flex flex-col items-center justify-center p-4">
        <div id="loading-overlay" className="text-center space-y-4">
          <Shield className="w-16 h-16 text-[#00E5FF] animate-spin mx-auto" />
          <h2 className="text-xl font-bold tracking-widest uppercase font-mono">Aligning Bifrost Core...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D17] text-slate-100 flex flex-col md:flex-row antialiased relative overflow-x-hidden selection:bg-[#1F6FEB] selection:text-white">
      
      {/* Background neon ambient grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(31,111,235,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(31,111,235,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Futuristic floating lighting halos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main S.H.I.E.L.D Tactical Sidebar (Top bar on Mobile, vertical on desktop) */}
      <aside className="w-full md:w-64 bg-slate-950/80 border-b md:border-b-0 md:border-r border-[#1F6FEB]/20 z-10 p-5 shrink-0 flex flex-col justify-between backdrop-blur-md">
        <div className="space-y-6">
          
          {/* Main game branding */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#1F6FEB]/30">
            <div className="bg-[#1F6FEB]/10 border border-[#1F6FEB]/50 p-1.5 rounded-lg">
              <Shield className="text-[#00E5FF] w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#FFD700] tracking-widest uppercase font-bold">AVENGERS</div>
              <h1 className="text-sm font-black tracking-wide uppercase text-slate-100">Infinity Card Wars</h1>
            </div>
          </div>

          {/* User profile capsule */}
          <div className="bg-black/40 border border-slate-900 p-3 rounded-xl flex items-center gap-2.5 font-mono">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs text-[#00E5FF] font-bold border border-[#00E5FF]/20 font-sans uppercase">
              {profile.username[0]}
            </div>
            <div className="text-xs">
              <div className="font-bold text-slate-100 uppercase truncate max-w-[120px] leading-tight">{profile.username}</div>
              <div className="text-[10px] text-amber-400 mt-0.5 leading-none bg-amber-950/40 px-1 border border-amber-900/30 rounded inline-block uppercase">{profile.title}</div>
            </div>
          </div>

          {/* Nav links list */}
          <nav className="space-y-1 text-xs font-mono">
            <button
              id="nav-hq"
              onClick={() => handleScreenChange('Hq')}
              className={`w-full text-left py-2.5 px-3 rounded-xl flex items-center gap-3 font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeScreen === 'Hq' ? 'bg-[#1F6FEB]/15 text-[#00E5FF] border border-[#1F6FEB]/30 shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'}`}
            >
              <Shield size={14} />
              <span>S.H.I.E.L.D HQ</span>
            </button>

            <button
              id="nav-teambuilder"
              onClick={() => handleScreenChange('TeamBuilder')}
              className={`w-full text-left py-2.5 px-3 rounded-xl flex items-center gap-3 font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeScreen === 'TeamBuilder' ? 'bg-[#1F6FEB]/15 text-[#00E5FF] border border-[#1F6FEB]/30 shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'}`}
            >
              <Layers size={14} />
              <span>Team Builder</span>
            </button>

            <button
              id="nav-collection"
              onClick={() => handleScreenChange('Collection')}
              className={`w-full text-left py-2.5 px-3 rounded-xl flex items-center gap-3 font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeScreen === 'Collection' ? 'bg-[#1F6FEB]/15 text-[#00E5FF] border border-[#1F6FEB]/30 shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'}`}
            >
              <Shield size={14} />
              <span>Collection Room</span>
            </button>

            <button
              id="nav-battle"
              onClick={() => handleScreenChange('Battle')}
              className={`w-full text-left py-2.5 px-3 rounded-xl flex items-center gap-3 font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeScreen === 'Battle' ? 'bg-[#7B2CBF]/15 text-[#FFD700] border border-[#7B2CBF]/30 shadow-md animate-pulse' : 'text-slate-400 hover:text-[#FFD700] hover:bg-white/5 border border-transparent'}`}
            >
              <Swords size={14} />
              <span>ENGAGE COMBAT</span>
            </button>

            <button
              id="nav-shieldai"
              onClick={() => handleScreenChange('ShieldAi')}
              className={`w-full text-left py-2.5 px-3 rounded-xl flex items-center gap-3 font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeScreen === 'ShieldAi' ? 'bg-[#1F6FEB]/15 text-[#00E5FF] border border-[#1F6FEB]/30 shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'}`}
            >
              <MessageSquareCode size={14} />
              <span>H.O.M.E.R Tactician</span>
            </button>

            <button
              id="nav-store"
              onClick={() => handleScreenChange('Store')}
              className={`w-full text-left py-2.5 px-3 rounded-xl flex items-center gap-3 font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeScreen === 'Store' ? 'bg-[#1F6FEB]/15 text-[#00E5FF] border border-[#1F6FEB]/30 shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'}`}
            >
              <ShoppingBag size={14} />
              <span>Armory Store</span>
            </button>

            <button
              id="nav-leaderboards"
              onClick={() => handleScreenChange('Leaderboards')}
              className={`w-full text-left py-2.5 px-3 rounded-xl flex items-center gap-3 font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeScreen === 'Leaderboards' ? 'bg-[#1F6FEB]/15 text-[#00E5FF] border border-[#1F6FEB]/30 shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'}`}
            >
              <Trophy size={14} />
              <span>Rankings</span>
            </button>
          </nav>
        </div>

        {/* Music toggle & copyright */}
        <div className="pt-6 border-t border-[#1F6FEB]/20 space-y-4 font-mono text-xs">
          
          <button
            onClick={handleToggleSound}
            className="w-full flex items-center gap-2.5 bg-black/40 border border-[#1F6FEB]/20 hover:border-[#00E5FF] hover:bg-black/60 rounded-xl px-3 py-2 transition-colors cursor-pointer text-slate-400 hover:text-[#00E5FF]"
          >
            {soundOn ? <Volume2 size={14} className="text-[#00E5FF]" /> : <VolumeX size={14} />}
            <span>Synthesizer Sound {soundOn ? 'ON' : 'OFF'}</span>
          </button>

          <p className="text-[10px] text-slate-650 leading-tight">
            © 2026 Stark Industries Mainframe. S.H.I.E.L.D Tactical Simulation.
          </p>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 z-10 pb-12 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="w-full"
          >
            {activeScreen === 'Hq' && (
              <MainMenu 
                profile={profile} 
                onUpdateProfile={handleUpdateProfile} 
                onNavigate={setActiveScreen}
                onUnlockHero={(h) => {
                  const updated = { ...profile };
                  updated.ownedHeroes.push(h);
                  handleUpdateProfile(updated);
                }}
              />
            )}

            {activeScreen === 'TeamBuilder' && (
              <TeamBuilder 
                profile={profile} 
                activeSquadIds={activeSquadIds} 
                onChangeSquad={setActiveSquadIds} 
                onNavigate={setActiveScreen}
              />
            )}

            {activeScreen === 'Collection' && (
              <CollectionPage 
                profile={profile} 
                onUpdateProfile={handleUpdateProfile} 
              />
            )}

            {activeScreen === 'Battle' && (
              <BattleArea 
                profile={profile} 
                squadIds={activeSquadIds} 
                onUpdateProfile={handleUpdateProfile} 
                onNavigate={setActiveScreen}
              />
            )}

            {activeScreen === 'ShieldAi' && (
              <ShieldTacticalAI 
                profile={profile} 
              />
            )}

            {activeScreen === 'Store' && (
              <StorePage 
                profile={profile} 
                onUpdateProfile={handleUpdateProfile} 
              />
            )}

            {activeScreen === 'Leaderboards' && (
              <Leaderboards 
                profile={profile} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
