/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { PlayerProfile } from '../types';
import { Trophy, Shield, Award, User, Zap } from 'lucide-react';
import { soundEngine } from './SoundSystem';

interface LeaderboardsProps {
  profile: PlayerProfile;
}

export default function Leaderboards({ profile }: LeaderboardsProps) {
  
  const STATIC_LEADERS = [
    { rank: 1, name: 'Director Fury', title: 'Multiverse Legend', power: 3480, wins: 412, iconColor: 'text-[#FFD700]' },
    { rank: 2, name: 'Iron Stark', title: 'Multiverse Legend', power: 3250, wins: 388, iconColor: 'text-slate-300' },
    { rank: 3, name: 'Danvers Binary', title: 'Infinity Guardian', power: 3100, wins: 367, iconColor: 'text-amber-600' },
    { rank: 4, name: 'Strange Sorcerer', title: 'Universe Protector', power: 2980, wins: 345, iconColor: 'text-slate-400' },
    { rank: 5, name: 'Wakanda King', title: 'Universe Protector', power: 2750, wins: 299, iconColor: 'text-slate-400' },
    { rank: 6, name: 'Gamora Assassin', title: 'Hero Commander', power: 2430, wins: 210, iconColor: 'text-slate-400' },
    { rank: 7, name: 'Barton Archer', title: 'Elite Avenger', power: 2150, wins: 184, iconColor: 'text-slate-400' },
  ];

  const totalPower = profile.ownedHeroes.reduce((sum, h) => sum + h.powerRating, 0);

  return (
    <div id="leaderboard-panel" className="p-6 max-w-4xl mx-auto min-h-screen font-mono">
      
      {/* Header card */}
      <div className="bg-slate-900/60 border border-[#1F6FEB]/30 p-5 rounded-2xl mb-6 backdrop-blur-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-100 uppercase tracking-wide flex items-center gap-2"><Trophy className="text-[#FFD700] animate-bounce" /> S.H.I.E.L.D Tactical Rankings</h1>
          <p className="text-xs text-slate-400">Review worldwide global and weekly battle ranks of active combat squads.</p>
        </div>

        <div className="bg-black/40 px-4 py-2 border border-[#00E5FF]/20 rounded-xl text-center">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Your Rank Position</div>
          <div className="text-lg font-black text-[#00E5FF] mt-0.5"># 8 VANGUARD</div>
        </div>
      </div>

      {/* Main rankings lists */}
      <div className="bg-slate-900/60 border border-[#1F6FEB]/20 rounded-2xl p-5 shadow-2xl relative">
        <h2 className="text-sm font-bold text-slate-250 mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
          🏆 Top Worldwide Avengers Commanders
        </h2>

        <div className="space-y-2">
          {STATIC_LEADERS.map((leader) => (
            <div
              key={leader.rank}
              className="bg-black/40 rounded-xl p-3 border border-slate-900/80 hover:border-[#1F6FEB]/25 flex justify-between items-center gap-4 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className={`text-base font-black w-6 text-center ${leader.iconColor}`}>#{leader.rank}</span>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">{leader.name}</h3>
                  <span className="text-[10px] text-slate-500 uppercase">{leader.title}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-right">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">SQUAD POWER</div>
                  <strong className="text-[#00E5FF]">{leader.power} PR</strong>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">COMBAT WINS</div>
                  <strong className="text-[#FFD700]">{leader.wins} WIN</strong>
                </div>
              </div>
            </div>
          ))}

          {/* Player stats injected inside leaderboard directly */}
          <div className="bg-[#1F6FEB]/10 border-2 border-[#1F6FEB] rounded-xl p-3 flex justify-between items-center gap-4 relative animate-pulse" style={{ animationDuration: '4s' }}>
            <div className="flex items-center gap-3">
              <span className="text-base font-black w-6 text-center text-[#00E5FF]">#8</span>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wide">{profile.username} (YOU)</h3>
                <span className="text-[10px] text-[#00E5FF] uppercase font-bold">{profile.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-right">
              <div>
                <div className="text-[9px] text-slate-400 uppercase">SQUAD POWER</div>
                <strong className="text-[#00E5FF]">{totalPower} PR</strong>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">COMBAT WINS</div>
                <strong className="text-[#FFD700]">{profile.level * 4 + 2} WIN</strong>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
