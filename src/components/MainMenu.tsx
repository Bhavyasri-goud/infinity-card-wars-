/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerProfile, HeroCard, CardRarity, Achievement } from '../types';
import { 
  Shield, 
  Coins, 
  Sparkles, 
  Gift, 
  Award, 
  Calendar, 
  User, 
  Compass, 
  AlertTriangle, 
  UserCheck, 
  Trophy,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from './SoundSystem';
import { INITIAL_HEROES } from '../data/heroes';

interface MainMenuProps {
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
  onNavigate: (screen: any) => void;
  onUnlockHero: (hero: HeroCard) => void;
}

export default function MainMenu({ profile, onUpdateProfile, onNavigate, onUnlockHero }: MainMenuProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'rewards' | 'crates' | 'achievements'>('status');
  
  // Animation state for opening crate
  const [openingCrate, setOpeningCrate] = useState<string | null>(null); // name of crate opening
  const [revealedHero, setRevealedHero] = useState<HeroCard | null>(null);
  const [revealedBonus, setRevealedBonus] = useState<{ gold?: number; crystals?: number } | null>(null);
  const [alertConfig, setAlertConfig] = useState<{ title: string; message: string; type?: 'info' | 'error' | 'success' } | null>(null);

  // Daily Rewards configuration description
  const DAILY_ITEMS = [
    { day: 1, name: '500 Tech Coins', reward: { type: 'gold', amount: 500 } },
    { day: 2, name: '50 Cosmic Crystals', reward: { type: 'crystals', amount: 50 } },
    { day: 3, name: 'S.H.I.E.L.D Rare Card', reward: { type: 'card', rarity: 'Rare' } },
    { day: 4, name: '1000 Tech Coins', reward: { type: 'gold', amount: 1000 } },
    { day: 5, name: '100 Cosmic Crystals', reward: { type: 'crystals', amount: 100 } },
    { day: 6, name: '2000 Tech Coins', reward: { type: 'gold', amount: 2000 } },
    { day: 7, name: 'Vanguard Epic Card', reward: { type: 'card', rarity: 'Epic' } },
    { day: 14, name: 'Stark Legendary Card', reward: { type: 'card', rarity: 'Legendary' } },
    { day: 30, name: 'Infinity Chest (Random Legendary/Mythic)', reward: { type: 'card', rarity: 'Mythic' } },
  ];

  // Crates definitions
  const CRATES = [
    { id: 'mystery', name: 'Mystery Avengers Crate', cost: 300, costType: 'gold', color: 'from-blue-600 to-indigo-700', rarity: 'Rare' },
    { id: 'hero', name: 'Hero Special Crate', cost: 100, costType: 'crystals', color: 'from-purple-500 to-pink-600', rarity: 'Epic' },
    { id: 'legendary', name: 'Legendary Nanotech Crate', cost: 1200, costType: 'gold', color: 'from-amber-500 to-red-600', rarity: 'Legendary' },
    { id: 'infinity', name: 'Infinity Cosmic Crate', cost: 350, costType: 'crystals', color: 'from-[#7B2CBF] to-[#00E5FF]', rarity: 'Infinity' },
    { id: 'seasonal', name: 'Secret Wars Event Crate', cost: 600, costType: 'gold', color: 'from-[#00F5D4] to-blue-700', rarity: 'Mythic' },
  ];

  const handleClaimDaily = (day: number, rewardIdx: number) => {
    if (profile.claimedDailyDays.includes(day)) return;
    soundEngine.playUnlockChest();

    const selected = DAILY_ITEMS[rewardIdx].reward;
    const updated = { ...profile };
    updated.claimedDailyDays = [...updated.claimedDailyDays, day];

    if (selected.type === 'gold' && selected.amount) {
      updated.gold += selected.amount;
    } else if (selected.type === 'crystals' && selected.amount) {
      updated.crystals += selected.amount;
    } else if (selected.type === 'card' && selected.rarity) {
      // Find a hero of appropriate rarity from baseline data that player doesn't have yet, or level up existing
      const matchingHeroes = INITIAL_HEROES.filter(h => h.rarity === selected.rarity);
      const randomHeroData = matchingHeroes[Math.floor(Math.random() * matchingHeroes.length)] || INITIAL_HEROES[0];
      
      const newHero: HeroCard = {
        ...randomHeroData,
        level: 1,
        experience: 0,
        xpNeeded: 100,
        evolutionStage: 'Base',
        skins: [randomHeroData.id],
        currentSkin: randomHeroData.id
      };
      
      const exists = updated.ownedHeroes.some(h => h.id === newHero.id);
      if (!exists) {
        updated.ownedHeroes = [...updated.ownedHeroes, newHero];
      } else {
        // level up or give compensation gold
        updated.gold += 300;
        newHero.level += 1; // simulation of level reward
      }
      setRevealedHero(newHero);
    }

    onUpdateProfile(updated);
  };

  const handleOpenCrate = (crate: typeof CRATES[0]) => {
    soundEngine.playClick();
    if (crate.costType === 'gold' && profile.gold < crate.cost) {
      setAlertConfig({
        title: "INSUFFICIENT FUNDS",
        message: "You need more Tech Coins to purchase this S.H.I.E.L.D cybernetic gear crate. Engage Simulated Armies on the Combat field to replenish reserves!",
        type: 'error'
      });
      return;
    }
    if (crate.costType === 'crystals' && profile.crystals < crate.cost) {
      setAlertConfig({
        title: "CRYSTAL CONDUITS DEPLETED",
        message: "Cosmic Crystal reserves are critical. Select another crate, unlock tactical flight achievement medals, or utilize the Armory Store exchange!",
        type: 'error'
      });
      return;
    }

    // Spend currency
    const updated = { ...profile };
    if (crate.costType === 'gold') updated.gold -= crate.cost;
    else updated.crystals -= crate.cost;

    // Start animated unboxing
    setOpeningCrate(crate.name);
    soundEngine.playUnlockChest();

    // Select reward card based on crate rarity target
    const targetRarities: CardRarity[] = crate.rarity === 'Rare' ? ['Common', 'Rare', 'Epic'] :
                                         crate.rarity === 'Epic' ? ['Rare', 'Epic', 'Legendary'] :
                                         crate.rarity === 'Legendary' ? ['Epic', 'Legendary'] :
                                         crate.rarity === 'Infinity' ? ['Legendary', 'Mythic', 'Infinity'] :
                                         ['Rare', 'Epic', 'Legendary', 'Mythic'];
    
    const possible = INITIAL_HEROES.filter(h => targetRarities.includes(h.rarity));
    const chosenData = possible[Math.floor(Math.random() * possible.length)] || INITIAL_HEROES[0];

    const bonusGold = Math.floor(Math.random() * 200) + 50;
    const bonusCrystals = Math.floor(Math.random() * 20) + 5;
    updated.gold += bonusGold;
    updated.crystals += bonusCrystals;

    const newHero: HeroCard = {
      ...chosenData,
      level: 1,
      experience: 0,
      xpNeeded: 100,
      evolutionStage: 'Base',
      skins: [chosenData.id],
      currentSkin: chosenData.id
    };

    const hasAlready = updated.ownedHeroes.find(h => h.id === newHero.id);
    if (!hasAlready) {
      updated.ownedHeroes = [...updated.ownedHeroes, newHero];
    } else {
      hasAlready.experience += 50;
      if (hasAlready.experience >= hasAlready.xpNeeded) {
        hasAlready.experience -= hasAlready.xpNeeded;
        hasAlready.level += 1;
        hasAlready.attack += 5;
        hasAlready.defense += 5;
        hasAlready.health += 20;
        hasAlready.maxHealth += 20;
        hasAlready.powerRating += 4;
      }
    }

    // Trigger Achievements check
    const collectAchievement = updated.achievements.find(a => a.id === 'infinity_collector');
    if (collectAchievement) {
      // count unique statuses or stone counts
      const uniqueRarities = Array.from(new Set(updated.ownedHeroes.map(h => h.rarity)));
      collectAchievement.progress = uniqueRarities.length;
      if (collectAchievement.progress >= collectAchievement.targetProgress && !collectAchievement.completed) {
        collectAchievement.completed = true;
        updated.crystals += collectAchievement.rewardAmount;
      }
    }

    onUpdateProfile(updated);

    // Show reveal dialogue after a short dramatic loop
    setTimeout(() => {
      setRevealedHero(newHero);
      setRevealedBonus({ gold: bonusGold, crystals: bonusCrystals });
      setOpeningCrate(null);
    }, 1800);
  };

  return (
    <div id="main-hq-panel" className="relative p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Dynamic Animated Crate Opening Lootbox Dialog */}
      <AnimatePresence>
        {openingCrate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-2xl"
          >
            <motion.div 
              animate={{ 
                rotate: [0, -5, 5, -5, 5, -10, 10, -10, 10, 0],
                scale: [1, 1.05, 1.05, 1.1, 1.1, 1.15, 1.15, 1.2, 1.2, 0.8],
                boxShadow: [
                  "0px 0px 0px rgba(0,229,255,0)", 
                  "0px 0px 40px rgba(0,229,255,0.4)", 
                  "0px 0px 80px rgba(255,215,0,0.8)"
                ]
              }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="w-48 h-48 rounded-2xl bg-gradient-to-br from-indigo-700 to-purple-800 border-4 border-[#FFD700] flex flex-col items-center justify-center p-4 relative"
            >
              <Zap className="text-[#FFD700] w-20 h-20 animate-bounce" />
              <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse" />
              <div className="text-center text-xs font-mono text-[#00E5FF] mt-2 tracking-widest uppercase">TUNING HYPER-CORES...</div>
            </motion.div>
            <div className="text-xl font-mono text-slate-100 mt-6 tracking-wide text-center uppercase">OPENING CRATE: <span className="text-[#FFD700]">{openingCrate}</span></div>
          </motion.div>
        )}

        {revealedHero && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-3xl"
          >
            <div className="max-w-md w-full bg-slate-900 border border-[#00E5FF]/40 rounded-3xl p-6 shadow-2xl relative text-center">
              
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full p-4 border border-black shadow-lg">
                <Sparkles className="text-black w-8 h-8 animate-spin" />
              </div>

              <div id="reveal-card-visual" className="mt-6 mb-4 flex flex-col items-center">
                {/* Hero card projection */}
                <div 
                  className="rounded-2xl p-4 w-64 border-4 border-slate-700 flex flex-col justify-between h-96 relative shadow-lg overflow-hidden"
                  style={{
                    backgroundColor: '#11131c',
                    borderColor: revealedHero.accentColor,
                    boxShadow: `0 0 35px ${revealedHero.glowColor}`
                  }}
                >
                  <div className="flex justify-between items-center z-10">
                    <span className="text-xs font-mono uppercase bg-black/40 px-2 py-0.5 rounded text-neutral-300 border border-slate-700">{revealedHero.class}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded text-black font-sans" style={{ backgroundColor: revealedHero.accentColor }}>{revealedHero.rarity}</span>
                  </div>

                  <div className="h-40 my-auto flex items-center justify-center border-b border-white/5 z-10 relative">
                    {/* Visual icon fallback or futuristic graphics */}
                    <div className="w-28 h-28 rounded-full border border-[#00E5FF]/20 flex items-center justify-center bg-black/40 relative">
                      <Shield className="w-16 h-16 animate-pulse" style={{ color: revealedHero.accentColor }} />
                      <div className="absolute inset-0 border border-white/5 rounded-full animate-spin" />
                    </div>
                  </div>

                  <div className="z-10 text-left mt-2">
                    <h3 className="text-lg font-bold text-white tracking-wide uppercase">{revealedHero.name}</h3>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] font-mono text-slate-400 mt-1">
                      <div>ATTACK: <span className="text-red-400 font-bold">{revealedHero.attack}</span></div>
                      <div>DEFENSE: <span className="text-blue-400 font-bold">{revealedHero.defense}</span></div>
                      <div>SPEED: <span className="text-green-400 font-bold">{revealedHero.speed}</span></div>
                      <div>INTELLIGENCE: <span className="text-yellow-400 font-bold">{revealedHero.intelligence}</span></div>
                    </div>
                    <div className="mt-2 text-xs font-bold text-center text-[#FFD700] bg-black/50 py-1 rounded border border-white/10 font-mono text-xs">
                      POWER SCORE: {revealedHero.powerRating}
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-100 uppercase tracking-widest mt-2">{revealedHero.name} ACQUIRED!</h2>
              
              {revealedBonus && (
                <div className="flex justify-center gap-4 text-xs font-mono text-[#FFD700] py-2 bg-black/40 border border-white/5 rounded-lg my-2 uppercase">
                  <span>💰 + {revealedBonus.gold} Coins</span>
                  <span>💎 + {revealedBonus.crystals} Crystals</span>
                </div>
              )}

              <p className="text-xs text-slate-400 font-mono mt-1 mb-4 italic">"{revealedHero.abilities[2].description}"</p>

              <button
                id="close-reveal-dialog"
                onClick={() => {
                  soundEngine.playClick();
                  setRevealedHero(null);
                  setRevealedBonus(null);
                }}
                className="w-full bg-[#1F6FEB] hover:bg-[#00E5FF] hover:text-black text-white font-bold py-3 px-6 rounded-xl font-mono text-sm tracking-widest uppercase cursor-pointer"
              >
                CONFIRM DEPLOYMENT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HQ Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-[#1F6FEB]/30 rounded-2xl p-5 mb-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#1F6FEB]/10 border border-[#1F6FEB]/50 rounded-xl relative">
            <Shield className="w-10 h-10 text-[#00E5FF]" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-[#00E5FF] rounded-full animate-ping" />
          </div>
          <div>
            <div className="text-xs font-mono text-[#00E5FF] uppercase tracking-wider">S.H.I.E.L.D Headquarters</div>
            <h1 className="text-3xl font-black text-slate-100 tracking-tight uppercase">Infinity Card Wars</h1>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
              <UserCheck size={12} className="text-[#FFD700]" />
              <span>COMM-SIG: <span className="text-[#FFD700]">{profile.username}</span></span>
              <span className="text-slate-600">|</span>
              <span className="text-[#00E5FF]">{profile.title}</span>
            </div>
          </div>
        </div>

        {/* Currency tracker */}
        <div className="flex gap-4 font-mono text-sm">
          <div className="bg-black/40 border border-[#1F6FEB]/30 rounded-xl px-4 py-2 flex items-center gap-2">
            <Coins className="text-[#FFD700] w-5 h-5" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Tech Coins</div>
              <div className="text-amber-400 font-bold text-base">{profile.gold}</div>
            </div>
          </div>
          <div className="bg-black/40 border border-[#1F6FEB]/30 rounded-xl px-4 py-2 flex items-center gap-2">
            <Sparkles className="text-[#00E5FF] w-5 h-5 animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Crystals</div>
              <div className="text-cyan-400 font-bold text-base">{profile.crystals}</div>
            </div>
          </div>
        </div>
      </div>

      {/* HQ Navigation / Options Tab Bar */}
      <div className="grid grid-cols-4 gap-2 mb-6 bg-slate-900/40 p-1.5 border border-white/5 rounded-xl font-mono text-xs">
        <button
          onClick={() => { soundEngine.playClick(); setActiveTab('status'); }}
          className={`py-2.5 rounded-lg font-semibold uppercase tracking-wider cursor-pointer ${activeTab === 'status' ? 'bg-[#1F6FEB] text-white shadow-lg' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
        >
          🛰️ HQ Files
        </button>
        <button
          onClick={() => { soundEngine.playClick(); setActiveTab('rewards'); }}
          className={`py-2.5 rounded-lg font-semibold uppercase tracking-wider cursor-pointer ${activeTab === 'rewards' ? 'bg-[#1F6FEB] text-white shadow-lg' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
        >
          🎁 Daily Logs
        </button>
        <button
          onClick={() => { soundEngine.playClick(); setActiveTab('crates'); }}
          className={`py-2.5 rounded-lg font-semibold uppercase tracking-wider cursor-pointer ${activeTab === 'crates' ? 'bg-[#1F6FEB] text-white shadow-lg' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
        >
          📦 Crates Room
        </button>
        <button
          onClick={() => { soundEngine.playClick(); setActiveTab('achievements'); }}
          className={`py-2.5 rounded-lg font-semibold uppercase tracking-wider cursor-pointer ${activeTab === 'achievements' ? 'bg-[#1F6FEB] text-white shadow-lg' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}
        >
          🏆 Medals
        </button>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        
        {/* HQ Status Panel */}
        {activeTab === 'status' && (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Core Stats Overview */}
            <div className="md:col-span-1 bg-gradient-to-b from-slate-900 to-black border border-[#1F6FEB]/30 rounded-2xl p-5 shadow-xl">
              <h2 className="text-lg font-mono font-bold text-slate-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <User className="text-[#00E5FF] w-5 h-5" /> Agent File Card
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-slate-500 font-mono text-xs">COMM CODE</span>
                  <span className="text-slate-200 font-bold text-sm tracking-wide">{profile.username}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-slate-500 font-mono text-xs">SECURITY TIER</span>
                  <span className="text-[#FFD700] text-sm uppercase font-black font-mono">{profile.title}</span>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>SECTOR LEVEL {profile.level}</span>
                    <span>{profile.xp} / {profile.xpNeeded} XP</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                    <div 
                      className="bg-[#00E5FF] h-full"
                      style={{ width: `${(profile.xp / profile.xpNeeded) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono uppercase bg-black/40 p-3 rounded-xl border border-white/5">
                  <div className="border-r border-white/5">
                    <div className="text-slate-500">DECK COUNT</div>
                    <div className="text-lg font-bold text-[#00E5FF]">{profile.ownedHeroes.length} / 17 HEROES</div>
                  </div>
                  <div className="pl-2">
                    <div className="text-slate-500">LEVEL MEDALS</div>
                    <div className="text-lg font-bold text-[#FFD700]">{profile.achievements.filter(a => a.completed).length} BADGES</div>
                  </div>
                </div>

                <div className="p-3 bg-[#FF9500]/5 border border-[#FF9500]/20 rounded-xl flex items-start gap-2.5 mt-4 text-xs">
                  <Info className="text-[#FF9500] w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <p className="text-slate-400 leading-normal">
                    Upgrading cards on your Collection page increases overall Power Scores, increasing your chance of strategic victory.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick-play Action Sectors */}
            <div className="md:col-span-2 bg-gradient-to-b from-slate-900 to-black border border-[#1F6FEB]/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <Compass className="text-[#00E5FF] w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} /> Combat Interface Matrix
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Assemble your high-tech tactical team of 5 standard Avengers, upgrade levels via materials cards on the catalog room, and activate strategic Infinity Stones to unleash slow-motion ultimate counters against elite Multiverse AI simulated armies.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => { soundEngine.playClick(); onNavigate('TeamBuilder'); }}
                    className="group bg-[#1F6FEB]/10 hover:bg-[#1F6FEB]/20 border border-[#1F6FEB]/30 hover:border-[#00E5FF] rounded-xl p-4 text-left transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#FFD700] font-mono text-xs uppercase tracking-widest font-bold">🛠️ SQUAD MATRIX</span>
                      <Sparkles className="text-[#00E5FF] w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                    <div className="text-sm font-bold text-slate-100 uppercase font-sans">TEAM BUILDER</div>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">Drag or allocate heroes. Review overall team rating values and tactical win metrics.</p>
                  </button>

                  <button
                    onClick={() => { soundEngine.playClick(); onNavigate('Battle'); }}
                    className="group bg-[#7B2CBF]/10 hover:bg-[#7B2CBF]/20 border border-[#7B2CBF]/30 hover:border-[#7B2CBF] rounded-xl p-4 text-left transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#00E5FF] font-mono text-xs uppercase tracking-widest font-bold">⚔️ WAR HORIZON</span>
                      <Zap className="text-[#FFD700] w-4 h-4 animate-bounce" />
                    </div>
                    <div className="text-sm font-bold text-slate-100 uppercase font-sans">ENGAGE COMBAT</div>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">Engage turn-based strategy wars, defeat bosses, or survive cosmic alternate modifiers.</p>
                  </button>
                </div>
              </div>

              {/* S.H.I.E.L.D Seasonal Banner */}
              <div className="mt-6 bg-gradient-to-r from-red-950/40 via-[#7B2CBF]/10 to-transparent p-4 border border-white/5 rounded-xl flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#E63946] font-bold uppercase tracking-widest">LIMITED EVENT ACTIVATION:</span>
                  <div className="text-slate-200 font-bold uppercase text-sm font-sans mt-0.5">THE MULTIVERSE CRISIS</div>
                  <p className="text-slate-400 mt-0.5 leading-normal">Unlock exclusive custom card skins, alter spatial universe laws, and claim extreme credits bundles!</p>
                </div>
                <button 
                  onClick={() => { soundEngine.playClick(); onNavigate('Collection'); }}
                  className="bg-[#FFD700] text-black font-extrabold uppercase px-4 py-2 rounded-lg font-sans shadow-lg cursor-pointer hover:bg-white"
                >
                  CATALOG
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Daily Rewards Panel */}
        {activeTab === 'rewards' && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-slate-900/60 border border-[#1F6FEB]/30 rounded-2xl p-5 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <Calendar className="text-[#FFD700]" />
              <div>
                <h2 className="text-lg font-mono font-bold text-slate-100 uppercase">S.H.I.E.L.D Daily Flight Logs</h2>
                <p className="text-xs text-slate-400 font-mono">Uplink every 24 cycles to receive premium tactical card rewards.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {DAILY_ITEMS.map((item, idx) => {
                const claimed = profile.claimedDailyDays.includes(item.day);
                
                return (
                  <div
                    key={item.day}
                    className={`rounded-xl p-4 border flex flex-col justify-between items-center text-center relative font-mono transition-all duration-300 ${
                      claimed ? 'bg-slate-950/40 border-slate-800 text-slate-500' :
                      'bg-slate-900 border-[#1F6FEB]/30 hover:border-[#00E5FF]'
                    }`}
                  >
                    {claimed && (
                      <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                        <span className="text-xs text-[#00E5FF] font-bold uppercase tracking-widest bg-slate-900/90 px-2.5 py-1 rounded border border-[#00E5FF]/20">CLAIMED ✔</span>
                      </div>
                    )}
                    
                    <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider">DAY {item.day}</span>
                    
                    <div className="my-3">
                      {item.reward.type === 'gold' && <Coins className="w-10 h-10 text-amber-400 mx-auto" />}
                      {item.reward.type === 'crystals' && <Sparkles className="w-10 h-10 text-cyan-400 mx-auto" />}
                      {item.reward.type === 'card' && <Gift className="w-10 h-10 text-pink-500 mx-auto animate-bounce" />}
                    </div>

                    <div className="text-xs font-bold text-slate-200 mt-1 uppercase line-clamp-1 h-5">{item.name}</div>
                    
                    <button
                      id={`claim-day-${item.day}`}
                      onClick={() => handleClaimDaily(item.day, idx)}
                      disabled={claimed}
                      className={`w-full text-[10px] font-bold py-1.5 px-2 rounded-lg transition-all text-center uppercase tracking-wider ${
                        claimed ? 'bg-slate-800 text-slate-500 cursor-not-allowed' :
                        'bg-[#1F6FEB] hover:bg-[#00E5FF] text-white hover:text-black mt-2 cursor-pointer'
                      }`}
                    >
                      {claimed ? 'COLLECTED' : 'CLAIM'}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Crates Room Panel */}
        {activeTab === 'crates' && (
          <motion.div
            key="crates"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-slate-900/60 border border-[#1F6FEB]/30 rounded-2xl p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="text-[#FFD700] w-6 h-6 animate-bounce" />
                <div>
                  <h2 className="text-lg font-mono font-bold text-slate-100 uppercase">Armory Loot Crates</h2>
                  <p className="text-xs text-slate-400 font-mono">Unlock random nanotech cores to recruit new Avengers or collect power crystals.</p>
                </div>
              </div>

              {/* Crates Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {CRATES.map((crate) => {
                  const isGold = crate.costType === 'gold';
                  
                  return (
                    <div
                      key={crate.id}
                      className="bg-slate-950 rounded-2xl border border-[#1F6FEB]/20 hover:border-[#00E5FF]/50 p-4 transition-all hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <div className={`h-24 rounded-lg bg-gradient-to-br ${crate.color} flex items-center justify-center relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-all animate-pulse" />
                        <Gift className="w-12 h-12 text-white drop-shadow-lg" />
                      </div>

                      <div className="mt-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-black text-slate-100 leading-tight uppercase font-sans line-clamp-2">{crate.name}</h3>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1 block">TARGETS: {crate.rarity}+ CARDS</span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5">
                          <div className="flex justify-between items-center text-xs font-mono mb-2">
                            <span className="text-slate-500 uppercase">UNLOCK VALUE:</span>
                            <span className="font-bold text-slate-200 uppercase flex items-center gap-1">
                              {isGold ? <Coins size={12} className="text-[#FFD700]" /> : <Sparkles size={12} className="text-[#00E5FF]" />}
                              {crate.cost}
                            </span>
                          </div>

                          <button
                            id={`open-crate-${crate.id}`}
                            onClick={() => handleOpenCrate(crate)}
                            className="w-full bg-[#1F6FEB] hover:bg-[#00E5FF] hover:text-black text-white text-xs font-bold font-mono py-2 rounded-lg uppercase tracking-wider text-center cursor-pointer transition-all"
                          >
                            OPEN CORE
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Achievements / Medals Panel */}
        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-900/60 border border-[#1F6FEB]/30 rounded-2xl p-5 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <Award className="text-[#FFD700] w-6 h-6 animate-pulse" />
              <div>
                <h2 className="text-lg font-mono font-bold text-slate-100 uppercase">S.H.I.E.L.D Tactical Badges</h2>
                <p className="text-xs text-slate-400 font-mono">Claim medals to verify your tactical operational accomplishments.</p>
              </div>
            </div>

            <div className="space-y-3">
              {profile.achievements.map((item) => {
                const percent = Math.min(100, Math.floor((item.progress / item.targetProgress) * 100));
                
                return (
                  <div
                    key={item.id}
                    className="bg-black/60 border border-[#1F6FEB]/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-black/80 hover:border-[#1F6FEB]/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${item.completed ? 'bg-amber-400/10 border-amber-400 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        <Trophy size={20} className={item.completed ? 'animate-pulse' : ''} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-100 uppercase font-sans tracking-wide leading-tight">{item.title}</h3>
                        <p className="text-xs text-slate-450 font-mono mt-0.5 max-w-md">{item.description}</p>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2 shrink-0">
                      <div className="w-full sm:w-40">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>PROGRESS</span>
                          <span>{item.progress} / {item.targetProgress} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
                          <div 
                            className={`h-full ${item.completed ? 'bg-amber-400' : 'bg-[#00E5FF]'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-slate-500 uppercase">REWARD:</span>
                        <span className="text-amber-400 font-bold uppercase flex items-center gap-1">
                          {item.rewardType === 'gold' ? <Coins size={12} /> : <Sparkles size={12} />}
                          +{item.rewardAmount}
                        </span>
                        {item.completed ? (
                          <span className="text-[#00E5FF] font-bold text-[10px] border border-[#00E5FF]/20 px-1.5 py-0.5 rounded bg-[#1F6FEB]/10">DOCKET UNLOCKED</span>
                        ) : (
                          <span className="text-slate-500 text-[10.5px] uppercase">PENDING OPERATIVE</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Modern custom modal alert */}
      <AnimatePresence>
        {alertConfig && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-md w-full bg-slate-950 border-2 rounded-2xl p-6 shadow-2xl relative text-center"
              style={{ borderColor: alertConfig.type === 'error' ? '#E63946' : '#00E5FF' }}
            >
              <div 
                className="text-lg font-mono font-bold uppercase tracking-widest mb-3"
                style={{ color: alertConfig.type === 'error' ? '#E63946' : '#00E5FF' }}
              >
                🚨 {alertConfig.title} 🚨
              </div>
              <p className="text-xs text-slate-350 leading-relaxed font-mono whitespace-pre-line mb-6 uppercase">
                {alertConfig.message}
              </p>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setAlertConfig(null);
                }}
                className="w-full bg-[#1F6FEB] hover:bg-[#00E5FF] hover:text-black text-white font-extrabold py-3 px-6 rounded-xl font-mono text-xs tracking-widest uppercase cursor-pointer"
              >
                Acknowledge Directive
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
