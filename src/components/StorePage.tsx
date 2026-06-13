/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { Sparkles, Coins, ShoppingBag, ShieldCheck, Gem, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from './SoundSystem';

interface StorePageProps {
  profile: PlayerProfile;
  onUpdateProfile: (updatedItem: PlayerProfile) => void;
}

export default function StorePage({ profile, onUpdateProfile }: StorePageProps) {
  const [alertConfig, setAlertConfig] = useState<{ title: string; message: string; type?: 'info' | 'error' | 'success' } | null>(null);
  
  const handleBuyCrystals = (goldCost: number, crystalsAmount: number) => {
    soundEngine.playClick();
    if (profile.gold < goldCost) {
      setAlertConfig({
        title: "INSUFFICIENT COINS",
        message: "Your Tech Coins balance is insufficient to exchange for Cosmic Crystals. Win standard simulated missions to command replacement funding!",
        type: "error"
      });
      return;
    }

    const updated = { ...profile };
    updated.gold -= goldCost;
    updated.crystals += crystalsAmount;
    
    soundEngine.playUnlockChest();
    onUpdateProfile(updated);
  };

  const PACKS = [
    { title: 'Alpha Tech Bundle', desc: 'Secure 1500 tech coins plus high speed crystals.', cost: 80, rewardCrystals: 200, rewardGold: 1500, color: 'from-blue-600 to-cyan-500' },
    { title: 'Asgard Cosmic Chest', desc: 'Instantly claim 12000 gold and power materials.', cost: 200, rewardCrystals: 500, rewardGold: 3000, color: 'from-[#7B2CBF] to-pink-600' },
    { title: 'Thanos Infinity Vault', desc: 'Unpack 1000 premium cosmic crystals + massive gold reserves.', cost: 500, rewardCrystals: 1200, rewardGold: 8000, color: 'from-amber-500 to-red-650' }
  ];

  return (
    <div id="store-panel" className="p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Introduction */}
      <div className="bg-slate-900/60 border border-[#1F6FEB]/30 p-5 rounded-2xl mb-6 backdrop-blur-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-100 uppercase tracking-wide flex items-center gap-2"><ShoppingBag className="text-[#00E5FF]" /> S.H.I.E.L.D Exchange Armory</h1>
          <p className="text-xs text-slate-400 font-mono">Convert currency resources to unlock exclusive cards, multiverse cosmetics, and boosters.</p>
        </div>

        <div className="flex gap-3 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-1.5 border border-white/5 rounded-xl text-amber-400 font-bold">💰 {profile.gold} Coins</div>
          <div className="bg-slate-950 px-3 py-1.5 border border-white/5 rounded-xl text-cyan-400 font-bold animate-pulse">💎 {profile.crystals} Crystals</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        
        {/* Crystal bundles list */}
        {PACKS.map((pack, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-[#1F6FEB]/20 hover:border-[#00E5FF]/40 rounded-2xl p-5 flex flex-col justify-between transition-all hover:scale-[1.01]"
          >
            <div>
              <div className={`h-24 rounded-xl bg-gradient-to-br ${pack.color} flex items-center justify-center mb-4 relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                <Gem size={38} className="text-white filter drop-shadow-md animate-bounce" style={{ animationDuration: '3s' }} />
              </div>

              <h2 className="text-base font-black text-slate-100 uppercase leading-wide">{pack.title}</h2>
              <p className="text-xs text-slate-450 mt-1 lines-clamp-2 leading-relaxed h-10">{pack.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>INCLUDED RES:</span>
                <span className="text-[#00E5FF] font-bold">💎 {pack.rewardCrystals} + 💰 {pack.rewardGold}</span>
              </div>

              <button
                _id={`buy-pack-${idx}`}
                onClick={() => {
                  soundEngine.playClick();
                  // Simulate purchasing using gold
                  const updated = { ...profile };
                  updated.gold += pack.rewardGold;
                  updated.crystals += pack.rewardCrystals;
                  soundEngine.playUnlockChest();
                  onUpdateProfile(updated);
                }}
                className="w-full bg-[#1F6FEB] hover:bg-[#00E5FF] text-white hover:text-black font-extrabold py-2.5 rounded-lg text-xs uppercase cursor-pointer transition-colors"
              >
                DEPLOY CORE (SWAP)
              </button>
            </div>
          </div>
        ))}
        
      </div>

      {/* S.H.I.E.L.D security notice */}
      <div className="p-4 bg-[#FF9500]/5 border border-[#FF9500]/20 rounded-xl flex items-center gap-3 mt-8 font-mono text-xs">
        <ShieldCheck className="text-[#FF9500] w-6 h-6 shrink-0" />
        <p className="text-slate-400 leading-normal">
          SECURE TRANSACTIONS VERIFIED BY STARK ENCRYPTION CORE CORES. Standard simulation play only; no external credit card processors are enabled or requested inside this prototype. Enjoy offline safe tactical recruitment!
        </p>
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
