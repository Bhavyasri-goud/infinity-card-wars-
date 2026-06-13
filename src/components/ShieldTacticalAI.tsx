/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeroCard, PlayerProfile } from '../types';
import { Terminal, Shield, Cpu, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { soundEngine } from './SoundSystem';

interface ShieldTacticalAIProps {
  profile: PlayerProfile;
}

export default function ShieldTacticalAI({ profile }: ShieldTacticalAIProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string>(
    "S.H.I.E.L.D Satellite Uplink secure. Welcome, Commander. I am H.O.M.E.R. v2, your tactical combat operations consultant. Feed me any tactical scenario or ask for a calculation of your current squad's combat efficiency."
  );
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const squadNames = profile.ownedHeroes.slice(0, 5).map(h => h.name).join(', ') || 'No heroes assigned';
  const totalPower = profile.ownedHeroes.slice(0, 5).reduce((sum, h) => sum + h.powerRating, 0);

  const handleQuickInquiry = async (topic: string, question: string) => {
    soundEngine.playClick();
    setPrompt(question);
    await triggerQuery(question);
  };

  const triggerQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setErrorText(null);
    soundEngine.playEnergyCharge();

    try {
      const res = await fetch('/api/shield-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          context: {
            username: profile.username,
            title: profile.title,
            level: profile.level,
            squad: squadNames,
            totalPower,
            gold: profile.gold,
            crystals: profile.crystals
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data.advice);
      } else {
        setResponse(data.advice || "Satellite transmission interrupted. System returned offline response protocols.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorText("Uplink failed. Falling back to local offline mainframe core.");
      setResponse(
        `[OFFLINE S.H.I.E.L.D PROTOCOL] Local calculations complete.\n\nAdvice: Your current active team power is evaluated at ${totalPower} points. Ensure you stack Tech (e.g. Iron Man) and Mystic (e.g. Doctor Strange) cards together to benefit from 'Nexus Shield' passive modifiers. When battling Cosmic opponents like Thanos, rely on tactical speed traps to stall their ultimate Infinity Snaps!`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="shield-ai-panel" className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 min-h-[500px]">
      
      {/* Sidebar: System status & analytical diagnostics */}
      <div className="lg:col-span-1 bg-slate-900/80 border border-[#1F6FEB]/40 rounded-xl p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 border-b border-[#1F6FEB]/30 pb-3 mb-4">
            <Cpu className="text-[#00E5FF] w-6 h-6 animate-pulse" />
            <h2 className="text-xl font-bold tracking-wider text-slate-100 font-mono">STARK.H.O.M.E.R</h2>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="bg-black/40 p-3 rounded-lg border border-[#00E5FF]/20">
              <span className="text-[#FFD700]">ACTIVE USER:</span>
              <p className="text-slate-300 font-bold">{profile.username} ({profile.title})</p>
            </div>

            <div className="bg-black/40 p-3 rounded-lg border border-[#00E5FF]/20">
              <span className="text-[#FFD700]">TEAM SCANNER CORES:</span>
              <p className="text-slate-300 line-clamp-2 mt-1">{squadNames}</p>
              <div className="mt-2 text-[#00E5FF] font-bold">Squad Rating: {totalPower} PR</div>
            </div>

            <div className="bg-black/40 p-3 rounded-lg border border-[#00E5FF]/20">
              <span className="text-slate-400">MAINFRAME NET STATE:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                <span className="text-[#00E5FF]">SECURE SATELLITE ENCRYPTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick scenarios questions */}
        <div className="mt-6">
          <h3 className="text-xs font-mono text-[#FFD700] mb-2 uppercase tracking-widest">TACTICAL SCENARIOS:</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleQuickInquiry("Synergies", "How can I combine Tech and Cosmic cards for maximum shields?")}
              className="w-full text-left bg-[#1F6FEB]/10 hover:bg-[#1F6FEB]/20 text-slate-200 border border-[#1F6FEB]/30 rounded px-3 py-2 text-xs font-mono transition-all"
            >
              ⚡ Tech + Cosmic Synergies
            </button>
            <button
              onClick={() => handleQuickInquiry("Thanos Counter", "Provide the optimal team build and combat route to defeat Thanos in Nightmare mode.")}
              className="w-full text-left bg-[#1F6FEB]/10 hover:bg-[#1F6FEB]/20 text-slate-200 border border-[#1F6FEB]/30 rounded px-3 py-2 text-xs font-mono transition-all"
            >
              👾 Defeating Thanos Raid Tactics
            </button>
            <button
              onClick={() => handleQuickInquiry("Infinity Stones", "What is the absolute best sequence for activating the Time and Space stones?")}
              className="w-full text-left bg-[#1F6FEB]/10 hover:bg-[#1F6FEB]/20 text-slate-200 border border-[#1F6FEB]/30 rounded px-3 py-2 text-xs font-mono transition-all"
            >
              💎 Infinity Stones Ultimate Combos
            </button>
          </div>
        </div>
      </div>

      {/* Main console screen */}
      <div className="lg:col-span-2 bg-slate-900/60 border border-[#1F6FEB]/30 rounded-xl p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
        
        {/* Output Screen */}
        <div className="flex-1 min-h-[250px] bg-black/80 rounded-lg p-4 border border-[#1F6FEB]/20 font-mono text-sm overflow-y-auto mb-4 relative">
          <div className="absolute top-3 right-3 text-xs bg-slate-800 px-2 py-0.5 rounded border border-[#00E5FF]/30 text-[#00E5FF] flex items-center gap-1">
            <Terminal size={12} className="animate-pulse" /> Uplink-Online
          </div>

          <div className="space-y-4">
            <div className="text-xs text-slate-500 mb-2">/* H.O.M.E.R v2 INTELLIGENCE SYSTEMS REPORT */</div>
            {errorText && (
              <div className="flex items-center gap-2 p-2 bg-[#E63946]/10 border border-[#E63946]/30 rounded text-xs text-[#E63946]">
                <AlertCircle size={14} />
                <span>{errorText}</span>
              </div>
            )}
            
            <div className="text-[#00E5FF] leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-[#1F6FEB]/50">
              {response}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            triggerQuery(prompt);
          }}
          className="flex items-center gap-2 bg-black/40 border border-[#1F6FEB]/20 rounded-lg p-1.5 focus-within:border-[#00E5FF] transition-all"
        >
          <input
            id="shield-ai-input"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Query H.O.M.E.R tactician core..."
            className="flex-1 bg-transparent border-0 ring-0 outline-none text-slate-200 font-mono px-3 py-2 text-sm placeholder-slate-500"
            disabled={loading}
          />
          <button
            id="shield-ai-send"
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-[#1F6FEB] hover:bg-[#00E5FF] text-black font-semibold uppercase px-4 py-2 rounded font-mono text-xs flex items-center gap-2 transition-all disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="animate-spin w-4 h-4" />
            ) : (
              <>
                <span>TRANSMIT</span>
                <Send size={12} />
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
