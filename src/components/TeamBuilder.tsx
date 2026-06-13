/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { PlayerProfile, HeroCard, HeroClass } from '../types';
import { Shield, Sparkles, AlertCircle, Trash2, CheckCircle, Info, Zap } from 'lucide-react';
import { soundEngine } from './SoundSystem';
import { motion, AnimatePresence } from 'motion/react';

interface TeamBuilderProps {
  profile: PlayerProfile;
  activeSquadIds: string[];
  onChangeSquad: (squadIds: string[]) => void;
  onNavigate: (screen: any) => void;
}

export default function TeamBuilder({ profile, activeSquadIds, onChangeSquad, onNavigate }: TeamBuilderProps) {
  const [alertConfig, setAlertConfig] = useState<{ title: string; message: string; type?: 'info' | 'error' | 'success' } | null>(null);
  
  const handleToggleHero = (heroId: string) => {
    soundEngine.playClick();
    const isSelected = activeSquadIds.includes(heroId);

    if (isSelected) {
      onChangeSquad(activeSquadIds.filter(id => id !== heroId));
    } else {
      if (activeSquadIds.length >= 5) {
        setAlertConfig({
          title: "SQUAD CAP REACHED",
          message: "The active dispatch grid is limited to exactly 5 active Avengers. Deselect an existing squad member before assigning additional heroes!",
          type: "error"
        });
        return;
      }
      onChangeSquad([...activeSquadIds, heroId]);
    }
  };

  const handleClearSquad = () => {
    soundEngine.playClick();
    onChangeSquad([]);
  };

  // Compute stats on active squad
  const activeHeroes = profile.ownedHeroes.filter(h => activeSquadIds.includes(h.id));
  const teamPower = activeHeroes.reduce((sum, h) => sum + h.powerRating, 0);

  // Class Synergies analysis
  const classCounts: Record<HeroClass, number> = {} as any;
  activeHeroes.forEach(h => {
    classCounts[h.class] = (classCounts[h.class] || 0) + 1;
  });

  const synergies: { title: string; desc: string; color: string }[] = [];
  Object.entries(classCounts).forEach(([className, count]) => {
    const cls = className as HeroClass;
    if (count >= 2) {
      if (cls === 'Tech') synergies.push({ title: 'Nanotech Grid [TIER I]', desc: 'Improves active defense shields by 25%.', color: 'text-cyan-400 border-cyan-500/30' });
      if (cls === 'Mystic') synergies.push({ title: 'Astral Resonance [TIER I]', desc: 'Reduces energy cast costs by 20% for mystic abilities.', color: 'text-purple-400 border-purple-500/30' });
      if (cls === 'Power') synergies.push({ title: 'Gamma Frenzy [TIER I]', desc: 'Rage damage output boosted by 15%.', color: 'text-emerald-400 border-emerald-500/30' });
      if (cls === 'Tactical') synergies.push({ title: 'SHIELD Protocol [TIER I]', desc: 'Increases speed evasion by 10 points.', color: 'text-red-400 border-red-500/30' });
      if (cls === 'Cosmic') synergies.push({ title: 'Celestial Force [TIER I]', desc: 'Gains 5 energy automatically at the start of every turn.', color: 'text-amber-400 border-amber-500/30' });
    }
  });

  // Strength / Weakness analytics
  const teamStrengths = Array.from(new Set(activeHeroes.map(h => h.strength)));
  const teamWeaknesses = Array.from(new Set(activeHeroes.map(h => h.weakness)));

  // Mock Win probability calculation
  const baseProb = activeHeroes.length > 0 ? Math.min(99, Math.max(12, Math.floor((teamPower / 480) * 100))) : 0;

  // Recommendations generator
  const unusedHeroes = profile.ownedHeroes.filter(h => !activeSquadIds.includes(h.id));
  const recommendedHero = unusedHeroes.sort((a, b) => b.powerRating - a.powerRating)[0];

  return (
    <div id="teambuilder-panel" className="relative p-6 max-w-7xl mx-auto">
      
      {/* Top action row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-slate-900/60 border border-[#1F6FEB]/30 p-5 rounded-2xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-black text-slate-100 uppercase tracking-wide">Squad Assembly</h1>
          <p className="text-xs text-slate-400 font-mono">Deploy up to 5 Avengers from your roster to form your active vanguard squad.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={handleClearSquad}
            disabled={activeSquadIds.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-slate-700 hover:border-red-500 text-slate-400 hover:text-red-400 font-mono text-xs px-4 py-2.5 rounded-lg transition-all uppercase cursor-pointer disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-700"
          >
            <Trash2 size={13} />
            <span>Clear Grid</span>
          </button>
          <button
            onClick={() => { soundEngine.playClick(); onNavigate('Battle'); }}
            disabled={activeSquadIds.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-[#1F6FEB] hover:bg-[#00E5FF] text-white hover:text-black font-extrabold px-6 py-2.5 rounded-lg font-mono text-sm uppercase shadow-lg transition-all transition-duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>LAUNCH SQUAD</span> 🦾
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Squad Grid representation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
            <h2 className="text-sm font-mono font-bold text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
              🛡️ Deployment Slots <span className="text-[#00E5FF]">({activeHeroes.length}/5 Assigned)</span>
            </h2>

            {/* Display list of placeholders or selected cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, idx) => {
                const hero = activeHeroes[idx];
                
                if (hero) {
                  return (
                    <div
                      key={hero.id}
                      onClick={() => handleToggleHero(hero.id)}
                      className="bg-slate-950 border-2 rounded-xl p-3 flex flex-col justify-between items-center text-center cursor-pointer hover:border-red-500 relative transition-all group select-none"
                      style={{ borderColor: hero.accentColor }}
                    >
                      <button className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors z-10">
                        <Trash2 size={11} />
                      </button>

                      <div className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10 text-white font-mono text-xs relative overflow-hidden bg-black/40 mb-2">
                        <Shield size={20} style={{ color: hero.accentColor }} />
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-100 uppercase line-clamp-1">{hero.name}</div>
                        <div className="text-[9px] font-mono mt-0.5 uppercase" style={{ color: hero.accentColor }}>{hero.class}</div>
                      </div>

                      <div className="mt-2 text-[10px] font-bold text-amber-400 bg-black/60 px-1.5 py-0.5 rounded border border-white/5 font-mono">
                        {hero.powerRating} PR
                      </div>
                    </div>
                  );
                }

                // Placeholder state
                return (
                  <div
                    key={idx}
                    className="border-2 border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center h-32 select-none"
                  >
                    <div className="w-9 h-9 rounded-full border border-dashed border-slate-800 flex items-center justify-center text-slate-600 font-mono text-xs mb-2">
                      +
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest leading-tight">Sector Empty</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Allocation Deck picker */}
          <div className="bg-slate-900/60 border border-[#1F6FEB]/20 rounded-2xl p-5 shadow-xl">
            <h2 className="text-sm font-mono font-bold text-slate-100 mb-4 uppercase tracking-wider">
              📥 Choose Avengers from your Armory Card Deck
            </h2>

            {profile.ownedHeroes.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-black/30 border border-white/5 rounded-xl">
                <AlertCircle className="text-[#FF9500] w-12 h-12 mb-3 animate-pulse" />
                <h3 className="text-sm font-mono text-slate-300">NO HEROES RECRUITED</h3>
                <p className="text-xs text-slate-500 mt-1">Unlock mystery crates inside the Headquarters menu first.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {profile.ownedHeroes.map((hero) => {
                  const active = activeSquadIds.includes(hero.id);
                  
                  return (
                    <div
                      key={hero.id}
                      onClick={() => handleToggleHero(hero.id)}
                      className={`relative rounded-xl p-3 border cursor-pointer select-none transition-all duration-200 ${
                        active ? 'bg-[#1F6FEB]/10 border-[#1F6FEB]' : 'bg-slate-950 border-slate-800 hover:border-[#1F6FEB]/50'
                      }`}
                    >
                      {active && (
                        <div className="absolute top-2 right-2 text-cyan-400">
                          <CheckCircle size={14} className="fill-cyan-950" />
                        </div>
                      )}

                      <div className="flex justify-between items-start font-mono text-[9px] text-slate-500">
                        <span className="uppercase">{hero.class}</span>
                        <span className="font-bold text-white bg-slate-800 px-1 rounded">{hero.rarity[0]}</span>
                      </div>

                      <div className="text-xs font-bold text-slate-200 uppercase mt-2">{hero.name}</div>
                      
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5 text-[10px] font-mono">
                        <span className="text-slate-500">POWER Score:</span>
                        <span className="font-black text-amber-400">{hero.powerRating}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tactical Metrics sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-black border border-[#1F6FEB]/30 rounded-2xl p-5 shadow-xl">
            <h2 className="text-base font-mono font-bold text-slate-105 mb-4 border-b border-white/5 pb-2 uppercase tracking-wide flex items-center gap-2">
              📊 Mission Analytics Matrix
            </h2>

            <div className="space-y-4 font-mono text-xs">
              
              {/* Aggregated Power Score */}
              <div>
                <span className="text-slate-500 block uppercase">TOTAL SQUAD POWER:</span>
                <div className="text-2xl font-black text-[#00E5FF]">{teamPower} PR</div>
              </div>

              {/* Dynamic Win Chance Estimation */}
              <div>
                <span className="text-slate-500 block uppercase">WIN PROBABILITY:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                    <div 
                      className="bg-gradient-to-r from-red-500 via-amber-400 to-[#00E5FF] h-full"
                      style={{ width: `${baseProb}%` }}
                    />
                  </div>
                  <span className="text-amber-400 font-bold font-mono text-sm leading-none shrink-0">{baseProb}%</span>
                </div>
              </div>

              {/* Class Synergy Badges */}
              <div>
                <span className="text-slate-500 block uppercase mb-1">TEAM COMBAT SYNERGIES:</span>
                {synergies.length === 0 ? (
                  <span className="text-slate-600 italic block text-[11px]">No active synergies. Stack 2 identical classes (Tech, Power, Tactical etc) to activate bonuses.</span>
                ) : (
                  <div className="space-y-2 mt-2">
                    {synergies.map((syn, idx) => (
                      <div key={idx} className={`p-2 rounded border bg-black/40 ${syn.color}`}>
                        <div className="font-bold flex items-center gap-1 uppercase text-[10px]"><Zap size={10} /> {syn.title}</div>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-normal">{syn.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Weakness analysis check list */}
              <div>
                <span className="text-slate-500 block uppercase border-t border-white/5 pt-3">Vanguard Vulnerabilities:</span>
                <div className="space-y-1 mt-1 text-[10px] text-slate-400">
                  {teamWeaknesses.length > 0 ? (
                    teamWeaknesses.slice(0, 2).map((weak, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{weak}</span>
                      </div>
                    ))
                  ) : <span className="italic text-slate-600 text-[10px]">No weaknesses detected. Deploy heroes to scan.</span>}
                </div>
              </div>

              {/* STARK Tactical Team builder suggestion */}
              {recommendedHero && (
                <div className="p-3 bg-[#1F6FEB]/10 border border-[#1F6FEB]/30 rounded-xl">
                  <span className="text-[#00E5FF] font-bold text-[10px] uppercase block tracking-widest">💡 STARK LAB RECOMMENDATION:</span>
                  <p className="text-slate-350 text-[10.5px] mt-1 leading-normal">
                    Deploy <span className="font-bold text-white uppercase">{recommendedHero.name}</span> ({recommendedHero.powerRating} PR) to significantly boost your overall Win Probability and counter high Mystic shielding.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

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
