/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { PlayerProfile, HeroCard, CardRarity, HeroClass } from '../types';
import { Search, Filter, Shield, Coins, Sparkles, Sliders, ChevronRight, Zap, Info, Play, Trash2 } from 'lucide-react';
import { soundEngine } from './SoundSystem';
import { motion, AnimatePresence } from 'motion/react';

interface CollectionPageProps {
  profile: PlayerProfile;
  onUpdateProfile: (updatedItem: PlayerProfile) => void;
}

export default function CollectionPage({ profile, onUpdateProfile }: CollectionPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedRarity, setSelectedRarity] = useState<string>('All');
  const [alertConfig, setAlertConfig] = useState<{ title: string; message: string; type?: 'info' | 'error' | 'success' } | null>(null);

  // Currently inspected card in modal/panel view
  const [inspectedHero, setInspectedHero] = useState<HeroCard | null>(profile.ownedHeroes[0] || null);

  // Filters setup
  const filteredHeroes = profile.ownedHeroes.filter(hero => {
    const matchesSearch = hero.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All' || hero.class === selectedClass;
    const matchesRarity = selectedRarity === 'All' || hero.rarity === selectedRarity;
    return matchesSearch && matchesClass && matchesRarity;
  });

  const handleUpgradeHero = (hero: HeroCard) => {
    soundEngine.playClick();
    const upgradeCost = hero.level * 250; // Cost increases with level
    
    if (profile.gold < upgradeCost) {
      setAlertConfig({
        title: "UPGRADE ABORTED",
        message: "Your Tech Coins balance is insufficient to process this card level-up. Launch battles in the S.H.I.E.L.D Combat zone to replenish gold resources!",
        type: "error"
      });
      return;
    }

    const updated = { ...profile };
    const targetHero = updated.ownedHeroes.find(h => h.id === hero.id);

    if (targetHero) {
      updated.gold -= upgradeCost;
      targetHero.level += 1;
      targetHero.attack += 4;
      targetHero.defense += 4;
      targetHero.speed += 3;
      targetHero.health += 25;
      targetHero.maxHealth += 25;
      targetHero.powerRating = Math.floor(
        (targetHero.attack + targetHero.defense + targetHero.speed + targetHero.intelligence) / 4
      );

      // Trigger automatic evolutionary stage updates
      if (targetHero.level >= 30) {
        targetHero.evolutionStage = 'Infinity Form';
      } else if (targetHero.level >= 20) {
        targetHero.evolutionStage = 'Legendary';
      } else if (targetHero.level >= 10) {
        targetHero.evolutionStage = 'Elite';
      } else if (targetHero.level >= 5) {
        targetHero.evolutionStage = 'Enhanced';
      }

      soundEngine.playHeal();
      setInspectedHero({ ...targetHero });
      onUpdateProfile(updated);
    }
  };

  const handleChooseSkin = (hero: HeroCard, skinName: string) => {
    soundEngine.playClick();
    const updated = { ...profile };
    const targetHero = updated.ownedHeroes.find(h => h.id === hero.id);
    if (targetHero) {
      targetHero.currentSkin = skinName;
      setInspectedHero({ ...targetHero });
      onUpdateProfile(updated);
    }
  };

  const handleUnlockCustomSkin = (hero: HeroCard, skinName: string) => {
    soundEngine.playClick();
    const cost = 80; // 80 crystals per skin
    if (profile.crystals < cost) {
      setAlertConfig({
        title: "CRYSTAL INSUFFICIENCY",
        message: "You need at least 80 Cosmic Crystals to decrypt this legendary skins file. Complete tactical flight milestones or visit the Store!",
        type: "error"
      });
      return;
    }

    const updated = { ...profile };
    const targetHero = updated.ownedHeroes.find(h => h.id === hero.id);
    if (targetHero) {
      updated.crystals -= cost;
      if (!targetHero.skins.includes(skinName)) {
        targetHero.skins = [...targetHero.skins, skinName];
      }
      targetHero.currentSkin = skinName;
      setInspectedHero({ ...targetHero });
      onUpdateProfile(updated);
    }
  };

  // List of skins players can unlock
  const ALTERNATIVE_SKINS = [
    { id: 'endgame', name: 'Endgame Quantum Suit', desc: 'Sleek white nano tactical design' },
    { id: 'zombie', name: 'Multiverse Zombie form', desc: 'Rotting undead variant with glowing details' },
    { id: 'gilded', name: 'Gilded Golden Stark Armor', desc: 'Stark VIP gold plated alloys' },
    { id: 'classic', name: '80s Classic Retro form', desc: 'Vintage comic block shader outfit' }
  ];

  return (
    <div id="collection-hub" className="p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Search & Filters block */}
      <div className="bg-slate-900/60 border border-[#1F6FEB]/30 p-5 rounded-2xl mb-6 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-3.5 text-slate-500" />
          <input
            id="collection-search-input"
            type="text"
            placeholder="Search deck heroes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-[#1F6FEB]/20 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 outline-none text-xs font-mono focus:border-[#00E5FF] transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto font-mono text-xs">
          {/* Class Filters */}
          <select
            id="class-filter"
            value={selectedClass}
            onChange={(e) => { soundEngine.playClick(); setSelectedClass(e.target.value); }}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs focus:border-[#00E5FF] cursor-pointer"
          >
            <option value="All">All Classes</option>
            <option value="Tech">Tech Heroes</option>
            <option value="Mystic">Mystic Heroes</option>
            <option value="Power">Power Heroes</option>
            <option value="Tactical">Tactical Heroes</option>
            <option value="Cosmic">Cosmic Heroes</option>
          </select>

          {/* Rarity filter */}
          <select
            id="rarity-filter"
            value={selectedRarity}
            onChange={(e) => { soundEngine.playClick(); setSelectedRarity(e.target.value); }}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs focus:border-[#00E5FF] cursor-pointer"
          >
            <option value="All">All Rarities</option>
            <option value="Common">Common</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
            <option value="Mythic">Mythic</option>
            <option value="Infinity">Infinity</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main: Grid of Cards list */}
        <div className="lg:col-span-2 bg-slate-900/40 p-5 rounded-2xl border border-white/5 shadow-2xl h-[calc(100vh-180px)] overflow-y-auto">
          <h2 className="text-base font-mono font-bold text-slate-200 mb-4 uppercase tracking-wider">
            🏛️ Armory Catalog ({filteredHeroes.length} Owned Matching)
          </h2>

          {filteredHeroes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 font-mono">
              <Zap size={30} className="text-slate-700 mb-2 animate-bounce" />
              <span>No Matching Avengers Cards. Try clearing filter settings.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredHeroes.map((hero) => {
                const isSelected = inspectedHero && inspectedHero.id === hero.id;

                return (
                  <div
                    key={hero.id}
                    onClick={() => { soundEngine.playClick(); setInspectedHero(hero); }}
                    className="bg-slate-950 rounded-2xl border-2 p-3 transition-all cursor-pointer relative overflow-hidden group select-none min-h-[220px]"
                    style={{
                      borderColor: isSelected ? hero.accentColor : 'rgba(255,255,255,0.05)',
                      boxShadow: isSelected ? `0 0 15px ${hero.glowColor}` : 'none'
                    }}
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                      <span className="uppercase">{hero.class}</span>
                      <span className="bg-black/50 px-1.5 py-0.5 rounded uppercase mt-0.5" style={{ color: hero.accentColor }}>{hero.rarity}</span>
                    </div>

                    <div className="my-5 h-20 flex items-center justify-center relative">
                      <Shield size={40} style={{ color: hero.accentColor }} className="opacity-40 group-hover:opacity-80 transition-opacity" />
                      
                      {/* Evolution label wrapper */}
                      <span className="absolute bottom-0 text-[10px] bg-black/80 px-2 py-0.5 border border-white/10 rounded-full font-mono text-slate-350">
                        Lv {hero.level}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/5 text-center">
                      <h3 className="text-xs font-black text-slate-155 uppercase tracking-wide truncate">{hero.name}</h3>
                      <div className="text-[10px] text-amber-500 font-mono font-bold mt-1">
                        POWER: {hero.powerRating}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right side: Selected Card Inspection detail & Upgrades Panel */}
        <div className="lg:col-span-1">
          {inspectedHero ? (
            <div className="bg-slate-900 border border-[#1F6FEB]/30 p-5 rounded-2xl shadow-2xl relative flex flex-col justify-between min-h-[500px]">
              
              {/* Card visual mockup */}
              <div>
                <div 
                  className="rounded-2xl p-4 border-2 flex flex-col justify-between h-64 relative shadow-lg overflow-hidden mb-5 text-center bg-slate-950"
                  style={{
                    borderColor: inspectedHero.accentColor,
                    boxShadow: `0 0 25px ${inspectedHero.glowColor}`
                  }}
                >
                  <div className="flex justify-between items-center z-10 text-[10px] font-mono">
                    <span className="bg-slate-900 px-2 py-0.5 rounded uppercase border border-slate-800 text-slate-400">{inspectedHero.class}</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded uppercase border border-slate-800 font-bold" style={{ color: inspectedHero.accentColor }}>{inspectedHero.rarity}</span>
                  </div>

                  <div className="my-auto flex flex-col items-center justify-center z-10 text-center">
                    <Shield size={50} style={{ color: inspectedHero.accentColor }} className="animate-pulse mb-1" />
                    <span className="text-xs font-mono text-[#00E5FF] uppercase font-bold tracking-widest">{inspectedHero.evolutionStage} Stage</span>
                  </div>

                  <div className="z-10 text-left">
                    <h3 className="text-base font-black text-white uppercase tracking-wide">{inspectedHero.name}</h3>
                    <div className="text-[9px] text-[#FFD700] uppercase font-mono mt-0.5">Custom Skin Active: <span className="text-white uppercase font-bold">{inspectedHero.currentSkin}</span></div>
                  </div>
                </div>

                {/* Upgrade controls */}
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-slate-500 uppercase">Power Level Index:</span>
                    <span className="text-amber-450 font-bold text-sm">Level {inspectedHero.level}</span>
                  </div>

                  {/* Core Attribute matrix */}
                  <div className="grid grid-cols-2 gap-4 bg-black/40 p-3 rounded-xl border border-white/5 text-[10.5px]">
                    <div>
                      <span className="text-slate-500">ATTACK:</span>
                      <div className="text-slate-205 font-bold">{inspectedHero.attack}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">DEFENSE:</span>
                      <div className="text-slate-201 font-bold">{inspectedHero.defense}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">SPEED:</span>
                      <div className="text-slate-207 font-bold">{inspectedHero.speed}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">HEALTH:</span>
                      <div className="text-slate-209 font-bold">{inspectedHero.health} HP</div>
                    </div>
                  </div>

                  {/* Ultimate abilities highlight */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-white/5 text-[10px]">
                    <span className="text-[#00E5FF] font-bold uppercase tracking-wider block mb-1">⭐ Ultimate Special Energy Move:</span>
                    <strong className="text-slate-100 uppercase block">{inspectedHero.abilities[2].name}</strong>
                    <p className="text-slate-400 leading-normal mt-0.5">{inspectedHero.abilities[2].description}</p>
                  </div>

                  {/* Universe Custom Skins Picker */}
                  <div className="pt-3 border-t border-white/5">
                    <span className="text-slate-500 block uppercase mb-2">Multiverse skins:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleChooseSkin(inspectedHero, inspectedHero.id)}
                        className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold border transition-colors cursor-pointer ${inspectedHero.currentSkin === inspectedHero.id ? 'bg-[#1F6FEB] text-white border-[#1F6FEB]' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                      >
                        Default
                      </button>

                      {ALTERNATIVE_SKINS.map(skin => {
                        const unlocked = inspectedHero.skins.includes(skin.id);
                        
                        return (
                          <button
                            key={skin.id}
                            onClick={() => {
                              if (unlocked) {
                                handleChooseSkin(inspectedHero, skin.id);
                              } else {
                                handleUnlockCustomSkin(inspectedHero, skin.id);
                              }
                            }}
                            className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                              inspectedHero.currentSkin === skin.id ? 'bg-[#1F6FEB] text-white border-[#1F6FEB]' : 
                              unlocked ? 'bg-slate-950 border-slate-700 text-slate-300' : 
                              'bg-black border-dashed border-slate-800 text-slate-650 hover:border-[#00E5FF]'
                            }`}
                          >
                            {!unlocked && <span>💎 80</span>}
                            <span>{skin.id}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex gap-2 font-mono text-xs">
                <button
                  id="upgrade-hero-btn"
                  onClick={() => handleUpgradeHero(inspectedHero)}
                  className="flex-1 bg-amber-500 hover:bg-[#FFD700] hover:text-black text-black font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 uppercase transition-all tracking-wider cursor-pointer"
                >
                  <Coins size={14} />
                  <span>Level-Up (💰 {inspectedHero.level * 250})</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-[#1F6FEB]/30 p-10 rounded-2xl shadow-2xl relative text-center text-slate-500 font-mono h-full flex flex-col justify-center">
              <Zap size={30} className="text-slate-750 mb-3 mx-auto animate-bounce" />
              <span>Select an Avengers card to inspect power specs and upgrade parameters.</span>
            </div>
          )}
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
