/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, HeroCard, BattleHeroState, InfinityStone, BattleState, BattleLogEntry, HeroClass } from '../types';
import { Shield, Sparkles, Swords, RefreshCw, Zap, Heart, AlertCircle, Play, ShieldAlert, Award, Star, ListCollapse } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from './SoundSystem';
import { INITIAL_STONES, BOSS_LIST, MULTIVERSE_MODIFIERS } from '../data/heroes';

interface BattleAreaProps {
  profile: PlayerProfile;
  squadIds: string[];
  onUpdateProfile: (updatedItem: PlayerProfile) => void;
  onNavigate: (screen: any) => void;
}

export default function BattleArea({ profile, squadIds, onUpdateProfile, onNavigate }: BattleAreaProps) {
  // Mode selection screen or active battle screen
  const [inBattle, setInBattle] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'Quick' | 'Ranked' | 'Boss' | 'Multiverse'>('Quick');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Normal' | 'Hard' | 'Nightmare' | 'Impossible'>('Normal');
  const [selectedBossIndex, setSelectedBossIndex] = useState(0); // Index for BOSS_LIST

  // active state variables
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [alertConfig, setAlertConfig] = useState<{ title: string; message: string; type?: 'info' | 'error' | 'success'; onClose?: () => void } | null>(null);
  
  // Floating numbers triggers
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; text: string; isCrit: boolean; position: { x: number; y: number } }[]>([]);

  // Screen animation flashes
  const [ultimateFlash, setUltimateFlash] = useState<string | null>(null); // name of hero executing ultimate
  const [lightningActive, setLightningActive] = useState(false);
  const [realityActive, setRealityActive] = useState(false);
  const [portalActive, setPortalActive] = useState(false);
  const [snapActive, setSnapActive] = useState(false);

  // Auto-scroll ref
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [battleState?.battleLog]);

  const addFloatingText = (text: string, side: 'left' | 'right', isCrit: boolean = false) => {
    const id = Math.random().toString();
    const position = {
      x: side === 'left' ? 30 + Math.random() * 20 : 60 + Math.random() * 20,
      y: 40 + Math.random() * 15
    };
    setFloatingTexts(prev => [...prev, { id, text, isCrit, position }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1200);
  };

  const handleStartBattle = () => {
    soundEngine.playClick();
    if (squadIds.length === 0) {
      setAlertConfig({
        title: "ARMORY GRID EMPTY",
        message: "You have no active heroes deployed. Assemble your 5-member Avengers vanguard team in the Team Builder menu first!",
        type: "error",
        onClose: () => onNavigate('TeamBuilder')
      });
      return;
    }

    // Populate actual active fighter units matching types
    const squadHeroes = profile.ownedHeroes.filter(h => squadIds.includes(h.id));
    const playerTeam: BattleHeroState[] = squadHeroes.map(h => ({
      id: Math.random().toString(),
      heroId: h.id,
      name: h.name,
      class: h.class,
      rarity: h.rarity,
      attack: h.attack,
      defense: h.defense,
      speed: h.speed,
      health: h.health,
      maxHealth: h.maxHealth,
      energy: 30, // Starts with 30 energy
      maxEnergy: 100,
      accentColor: h.accentColor,
      glowColor: h.glowColor,
      abilities: h.abilities,
      statusEffects: [],
      isDefeated: false
    }));

    // Generate opponent team
    let aiTeam: BattleHeroState[] = [];
    let stateMode = selectedMode;
    let bossType: any = undefined;
    let universeMod: any = undefined;

    const diffMultiplier = 
      selectedDifficulty === 'Easy' ? 0.8 :
      selectedDifficulty === 'Normal' ? 1.0 :
      selectedDifficulty === 'Hard' ? 1.25 :
      selectedDifficulty === 'Nightmare' ? 1.5 : 1.8;

    if (selectedMode === 'Boss') {
      const boss = BOSS_LIST[selectedBossIndex];
      bossType = boss.id;
      
      aiTeam = [
        {
          id: 'boss_unit',
          heroId: boss.id,
          name: boss.name,
          class: boss.class,
          rarity: 'Celestial',
          attack: Math.floor(boss.attack * diffMultiplier * 0.85),
          defense: Math.floor(boss.defense * diffMultiplier * 0.85),
          speed: Math.floor(boss.speed * diffMultiplier * 0.9),
          health: Math.floor(boss.health * diffMultiplier),
          maxHealth: Math.floor(boss.health * diffMultiplier),
          energy: 40,
          maxEnergy: 100,
          accentColor: '#EF4444',
          glowColor: 'rgba(239, 68, 68, 0.9)',
          abilities: boss.abilities.map(a => ({
            name: a.name,
            description: a.description,
            type: 'Special',
            dmgMultiplier: a.dmgMultiplier,
            energyCost: 30
          })),
          statusEffects: [],
          isDefeated: false
        }
      ];
    } else {
      // General random simulated squad matching level variables
      const aiTemplates = ['iron_man', 'thor', 'hulk', 'loki', 'thanos', 'captain_marvel', 'doctor_strange'];
      const chosenAIs = Array.from({ length: Math.min(5, squadHeroes.length) }).map(() => {
        const randTemplate = aiTemplates[Math.floor(Math.random() * aiTemplates.length)];
        const matchingBase = squadHeroes.find(h => h.id === randTemplate) || squadHeroes[0];
        return {
          id: Math.random().toString(),
          heroId: randTemplate,
          name: `Void ${matchingBase.name}`,
          class: matchingBase.class,
          rarity: matchingBase.rarity,
          attack: Math.floor(matchingBase.attack * diffMultiplier * 0.9),
          defense: Math.floor(matchingBase.defense * diffMultiplier * 0.9),
          speed: Math.floor(matchingBase.speed * diffMultiplier * 0.9),
          health: Math.floor(matchingBase.health * diffMultiplier * 0.95),
          maxHealth: Math.floor(matchingBase.health * diffMultiplier * 0.95),
          energy: 20,
          maxEnergy: 100,
          accentColor: '#7B2CBF',
          glowColor: 'rgba(123, 44, 191, 0.5)',
          abilities: matchingBase.abilities,
          statusEffects: [],
          isDefeated: false
        };
      });
      aiTeam = chosenAIs;
    }

    if (selectedMode === 'Multiverse') {
      const idx = Math.floor(Math.random() * MULTIVERSE_MODIFIERS.length);
      universeMod = MULTIVERSE_MODIFIERS[idx];
    }

    // Set Up initial logging
    const startLog: BattleLogEntry = {
      id: Math.random().toString(),
      turn: 0,
      sender: 'system',
      message: `🛰️ OPERATION LOCK ON. Mode: ${selectedMode}. Difficulty: ${selectedDifficulty}! Prepare active defense systems!`,
      timestamp: new Date().toLocaleTimeString()
    };

    if (universeMod) {
      startLog.message += `\n🌌 SPATIAL SHIFT: Entered [${universeMod.name}] space. Modifiers applied: ${universeMod.description}`;
    }

    // Active stones available mapping
    const savedStones = INITIAL_STONES.map(stone => {
      // Find if we have unlocked on progress
      const isClaimed = profile.bossesDefeated.includes(stone.id) || stone.unlocked;
      return {
        ...stone,
        unlocked: isClaimed,
        currentCooldown: 0
      };
    });

    setBattleState({
      id: Math.random().toString(),
      mode: stateMode,
      bossType,
      bossPhase: 1,
      universeModifier: universeMod,
      playerTeam,
      aiTeam,
      activePlayerIndex: 0,
      activeAiIndex: 0,
      turnNumber: 1,
      currentTurnOwner: playerTeam[0].speed >= aiTeam[0].speed ? 'player' : 'opponent',
      battleLog: [startLog],
      slowMoFinishing: false,
      stonesAvailable: savedStones
    });

    setInBattle(true);
    soundEngine.playVictory(); // play some entry trumpet fanfare!
  };

  // AI Active choice execution loop
  useEffect(() => {
    if (!battleState || battleState.winner || battleState.currentTurnOwner === 'player') return;

    // AI thinking state simulator
    const timer = setTimeout(() => {
      executeAiTurn();
    }, 1800);

    return () => clearTimeout(timer);
  }, [battleState?.currentTurnOwner, battleState?.winner]);

  const executeAiTurn = () => {
    if (!battleState) return;

    const updated = { ...battleState };
    const activeAi = updated.aiTeam[updated.activeAiIndex];
    const activePlayer = updated.playerTeam[updated.activePlayerIndex];

    if (!activeAi || activeAi.isDefeated || !activePlayer || activePlayer.isDefeated) return;

    let dmg = 0;
    let logMessage = '';
    const isCrit = Math.random() < 0.15;

    // AI Decision rules: Use Ultimate if possible, or Special, or basic
    if (activeAi.energy >= 90) {
      // Massive move
      dmg = Math.floor(activeAi.attack * 1.8 * (isCrit ? 1.5 : 1));
      activeAi.energy = 0;
      logMessage = `🔴 Opponent ${activeAi.name} triggers ULTIMATE Annihilation spell dealing ${dmg} damage!`;
      addFloatingText(`💥-${dmg}`, 'left', true);
      soundEngine.playLightning();
    } else if (activeAi.energy >= 35) {
      dmg = Math.floor(activeAi.attack * 1.3 * (isCrit ? 1.5 : 1));
      activeAi.energy -= 35;
      logMessage = `🔴 Opponent ${activeAi.name} charges special ray, hitting for ${dmg} damage.`;
      addFloatingText(`-${dmg}`, 'left', isCrit);
      soundEngine.playEnergyCharge();
    } else {
      dmg = Math.floor(activeAi.attack * 0.9 * (isCrit ? 1.5 : 1));
      activeAi.energy = Math.min(100, activeAi.energy + 15);
      logMessage = `🔴 Opponent ${activeAi.name} throws basic forward swipe, inflicting ${dmg} hits.`;
      addFloatingText(`-${dmg}`, 'left', isCrit);
      soundEngine.playImpact();
    }

    // Apply shields or modifiers
    let netDamage = Math.max(5, dmg - Math.floor(activePlayer.defense * 0.3));

    if (battleState.universeModifier?.effectType === 'double_dmg') {
      netDamage *= 2;
    }

    activePlayer.health = Math.max(0, activePlayer.health - netDamage);
    
    // Gain standard energy for player because they took hits
    activePlayer.energy = Math.min(100, activePlayer.energy + 10);

    // Logging
    updated.battleLog.push({
      id: Math.random().toString(),
      turn: updated.turnNumber,
      sender: 'opponent',
      message: logMessage + ` (Shield absorbed ${dmg - netDamage} damage)`,
      timestamp: new Date().toLocaleTimeString()
    });

    // Check if player died
    if (activePlayer.health <= 0) {
      activePlayer.isDefeated = true;
      updated.battleLog.push({
        id: Math.random().toString(),
        turn: updated.turnNumber,
        sender: 'system',
        message: `☠️ Player Vanguard unit [${activePlayer.name}] collapsed under physical impact!`,
        timestamp: new Date().toLocaleTimeString()
      });

      // Find next active player indexes that are alive
      const nextIndex = updated.playerTeam.findIndex(h => !h.isDefeated);
      if (nextIndex === -1) {
        // Player loses fully!
        updated.winner = 'opponent';
        updated.battleLog.push({
          id: Math.random().toString(),
          turn: updated.turnNumber,
          sender: 'system',
          message: `🛑 COMMANDER FAILURE: Your entire active vanguard division collapsed. The simulation returned deep failure ratios.`,
          timestamp: new Date().toLocaleTimeString()
        });
        soundEngine.playDefeat();
      } else {
        updated.activePlayerIndex = nextIndex;
        updated.battleLog.push({
          id: Math.random().toString(),
          turn: updated.turnNumber,
          sender: 'system',
          message: `🔄 Deployment shift parameters: Deployed alive reserve fighter [${updated.playerTeam[nextIndex].name}] into core duel field.`,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }

    // End turn swap
    updated.currentTurnOwner = 'player';
    updated.turnNumber += 1;

    setBattleState(updated);
  };

  // Main combat moves execution
  const executePlayerAction = (actionType: 'Basic' | 'Special' | 'Ultimate' | 'Defend') => {
    if (!battleState || battleState.winner || battleState.currentTurnOwner !== 'player') return;

    const updated = { ...battleState };
    const activePlayer = updated.playerTeam[updated.activePlayerIndex];
    const activeAi = updated.aiTeam[updated.activeAiIndex];

    if (!activePlayer || activePlayer.isDefeated || !activeAi || activeAi.isDefeated) return;

    let dmg = 0;
    let cost = 0;
    let effectAction = '';
    let isCrit = Math.random() < 0.20; // 20% critical hit chances

    if (actionType === 'Basic') {
      dmg = Math.floor(activePlayer.attack * 1.0 * (isCrit ? 1.5 : 1));
      activePlayer.energy = Math.min(100, activePlayer.energy + 15);
      effectAction = `🎯 ${activePlayer.name} charges forward utilizing standard basic core strike dealing ${dmg} damage.`;
      soundEngine.playImpact();
    } else if (actionType === 'Special') {
      cost = 30;
      if (activePlayer.energy < cost) {
        setAlertConfig({
          title: "CRITICAL ENERGY RESERVES",
          message: "Arc energy is too low. Execute standard Basic strikes first to gather thermal core charges!",
          type: "error"
        });
        return;
      }
      activePlayer.energy -= cost;
      dmg = Math.floor(activePlayer.attack * 1.45 * (isCrit ? 1.5 : 1));
      effectAction = `💥 Special Activation: ${activePlayer.name} unleashes secondary ability constructs dealing ${dmg} kinetic damage!`;
      soundEngine.playEnergyCharge();
    } else if (actionType === 'Ultimate') {
      cost = 100;
      if (activePlayer.energy < 100) {
        setAlertConfig({
          title: "REACTOR UNALIGNED",
          message: "Core output is below standard thresholds. Ultimate strikes require fully charged 100% energy indicators!",
          type: "error"
        });
        return;
      }
      activePlayer.energy = 0;
      dmg = Math.floor(activePlayer.attack * 2.8 * (isCrit ? 1.5 : 1));
      effectAction = `⚡ ULTIMATE OVERLOAD: ${activePlayer.name} aligns all system grids, unleashing his signature cinematic devastator, crushing structures for ${dmg} absolute hits!`;

      // Trigger gorgeous flashing ultimate visual backgrounds
      setUltimateFlash(activePlayer.name);
      
      if (activePlayer.name.includes("Thor")) {
        setLightningActive(true);
        soundEngine.playLightning();
        setTimeout(() => setLightningActive(false), 1500);
      } else if (activePlayer.name.includes("Scarlet")) {
        setRealityActive(true);
        setTimeout(() => setRealityActive(false), 1500);
      } else if (activePlayer.name.includes("Doctor Strange")) {
        setPortalActive(true);
        soundEngine.playHeal();
        // Heal active player
        activePlayer.health = Math.min(activePlayer.maxHealth, activePlayer.health + 180);
        setTimeout(() => setPortalActive(false), 1500);
      } else if (activePlayer.name.includes("Thanos")) {
        setSnapActive(true);
        setTimeout(() => setSnapActive(false), 1500);
        
        // 50% execute chance
        if (Math.random() < 0.50) {
          dmg = activeAi.health; // INSTANT SNAP DEVIOUS DEATH
          effectAction = `✨ THANOS SNAP ALIGNED! The gauntlet click echoes across active space. Opponent active unit disintegrated cleanly down to molecular dust!`;
        }
      } else {
        soundEngine.playLightning();
      }

      setTimeout(() => setUltimateFlash(null), 1800);
    } else if (actionType === 'Defend') {
      // Regenerate shield and buffer energy
      activePlayer.health = Math.min(activePlayer.maxHealth, activePlayer.health + 60);
      activePlayer.energy = Math.min(100, activePlayer.energy + 20);
      effectAction = `🛡️ Defensive Formation activated. Active core healed +60 points and gained 20 tactical Energy.`;
      soundEngine.playHeal();
    }

    if (actionType !== 'Defend') {
      let netDmg = Math.max(5, dmg - Math.floor(activeAi.defense * 0.25));
      
      if (battleState.universeModifier?.effectType === 'double_dmg') {
        netDmg *= 2;
      }

      activeAi.health = Math.max(0, activeAi.health - netDmg);
      addFloatingText(`💥-${netDmg}`, 'right', isCrit);

      // Gain standard energy for opponent
      activeAi.energy = Math.min(100, activeAi.energy + 15);
    }

    updated.battleLog.push({
      id: Math.random().toString(),
      turn: updated.turnNumber,
      sender: 'player',
      message: effectAction,
      timestamp: new Date().toLocaleTimeString()
    });

    // Check if opponent dies
    if (activeAi.health <= 0) {
      activeAi.isDefeated = true;
      updated.battleLog.push({
        id: Math.random().toString(),
        turn: updated.turnNumber,
        sender: 'system',
        message: `💀 Enemy Combatant [${activeAi.name}] neutralized completely!`,
        timestamp: new Date().toLocaleTimeString()
      });

      // Find next alive AI target
      const nextIndex = updated.aiTeam.findIndex(h => !h.isDefeated);
      if (nextIndex === -1) {
        // Player wins fully!
        updated.winner = 'player';
        updated.battleLog.push({
          id: Math.random().toString(),
          turn: updated.turnNumber,
          sender: 'system',
          message: `🌟 MISSION ACHIEVED: Worldwide threat matrix localized and neutral. The SHIELD satellite returned maximum victory values!`,
          timestamp: new Date().toLocaleTimeString()
        });

        // Trigger safe rewards allocation payout
        triggerBattleRewards(updated);
        soundEngine.playVictory();
      } else {
        // AI Phase transition or reserve deploying
        updated.activeAiIndex = nextIndex;
        updated.battleLog.push({
          id: Math.random().toString(),
          turn: updated.turnNumber,
          sender: 'system',
          message: `🔄 Simulated enemy backup: Deployed reserve counter unit [${updated.aiTeam[nextIndex].name}] into combat zones.`,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }

    // Toggle back turns ownership
    if (!updated.winner) {
      updated.currentTurnOwner = 'opponent';
    }

    setBattleState(updated);
  };

  const handleUseInfinityStone = (stone: InfinityStone) => {
    if (!battleState || battleState.winner || battleState.currentTurnOwner !== 'player') return;
    if (!stone.unlocked) {
      setAlertConfig({
        title: "SECURED IN DEEP VAULTS",
        message: "This Infinity Stone is locked inside highly classified S.H.I.E.L.D bunkers. Defeat cosmic bosses in Boss Raids mode to capture and unlock its power!",
        type: "error"
      });
      return;
    }

    const updated = { ...battleState };
    const activePlayer = updated.playerTeam[updated.activePlayerIndex];
    const activeAi = updated.aiTeam[updated.activeAiIndex];

    soundEngine.playLightning();
    addFloatingText(`💎 ENERGY BURST!`, 'right', true);

    let logMessage = '';

    if (stone.id === 'space_stone') {
      activeAi.health = Math.max(0, activeAi.health - 120);
      logMessage = `🌌 Space Stone Teleport Strike activated: Bypassed normal defenses to inflict 120 absolute dimensional damage.`;
    } else if (stone.id === 'time_stone') {
      logMessage = `⏳ Time Stone loop engaged! Extra strategic turn is secured successfully. Play another move immediately!`;
      updated.currentTurnOwner = 'player'; // keep it as player turn
    } else if (stone.id === 'mind_stone') {
      activeAi.energy = Math.max(0, activeAi.energy - 40);
      activePlayer.energy = Math.min(100, activePlayer.energy + 40);
      logMessage = `🧠 Mind Stone Siphon Alignment: Drained 40 energy straight from opponent active core into our active core indicator!`;
    } else if (stone.id === 'reality_stone') {
      const idx = Math.floor(Math.random() * MULTIVERSE_MODIFIERS.length);
      const randMod = MULTIVERSE_MODIFIERS[idx];
      updated.universeModifier = randMod;
      logMessage = `🔴 Reality Stone universe rupture: Warped current combat dimension to [${randMod.name}] space: ${randMod.description}`;
    } else if (stone.id === 'power_stone') {
      activePlayer.attack += 25;
      logMessage = `🔥 Power Stone Cosmic Surge: Active card attack value permanently boosted by +25 stats points for the remainder of this simulation!`;
    } else if (stone.id === 'soul_stone') {
      // Heal active to full
      activePlayer.health = activePlayer.maxHealth;
      logMessage = `🛡️ Soul Stone Phoenix Rebirth: Fully restored active fighter health counters [${activePlayer.name}] back to 100%!`;
    }

    updated.battleLog.push({
      id: Math.random().toString(),
      turn: updated.turnNumber,
      sender: 'player',
      message: logMessage,
      timestamp: new Date().toLocaleTimeString()
    });

    // Make state update
    setBattleState(updated);
  };

  // Safe battle rewards writer
  const triggerBattleRewards = (state: BattleState) => {
    if (state.rewardClaimed) return;
    state.rewardClaimed = true;

    const baseRewardCoins = selectedMode === 'Boss' ? 2000 : 800;
    const baseRewardCrystals = selectedMode === 'Boss' ? 100 : 25;

    const updatedProfile = { ...profile };
    updatedProfile.gold += baseRewardCoins;
    updatedProfile.crystals += baseRewardCrystals;
    updatedProfile.xp += 40;

    // Trigger XP security level up triggers
    if (updatedProfile.xp >= updatedProfile.xpNeeded) {
      updatedProfile.xp -= updatedProfile.xpNeeded;
      updatedProfile.level += 1;
      updatedProfile.xpNeeded = Math.floor(updatedProfile.xpNeeded * 1.25);
    }

    // Unlocking corresponding stones permanently if Boss mode defeated
    if (selectedMode === 'Boss' && state.bossType) {
      const boss = BOSS_LIST[selectedBossIndex];
      const stoneId = boss.stoneToUnlock;
      if (!updatedProfile.bossesDefeated.includes(boss.id)) {
        updatedProfile.bossesDefeated = [...updatedProfile.bossesDefeated, boss.id];
      }
    }

    // Achievements tracker checklist
    const firstVic = updatedProfile.achievements.find(a => a.id === 'first_victory');
    if (firstVic && !firstVic.completed) {
      firstVic.completed = true;
      updatedProfile.gold += firstVic.rewardAmount;
    }

    onUpdateProfile(updatedProfile);
  };

  return (
    <div id="battle-horizon" className="p-4 max-w-7xl mx-auto min-h-screen relative text-slate-100 uppercase">
      
      {/* Full screen animated cinematics backgrounds */}
      {ultimateFlash && (
        <div className="fixed inset-0 z-50 bg-red-950/90 flex flex-col items-center justify-center animate-pulse backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1.1, rotate: 0 }}
            className="text-center"
          >
            <div className="text-amber-400 font-mono text-xs tracking-widest leading-none mb-2">⚡ SPECIAL CINEMATIC RECON SYSTEM OVERRIDE ⚡</div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tight">{ultimateFlash} ACTIVATES</h1>
            <span className="text-xl font-mono text-cyan-400 mt-2 uppercase block">ULTIMATE STRIKE DESTROYER</span>
          </motion.div>
        </div>
      )}

      {/* Lightning Overlay */}
      {lightningActive && <div className="fixed inset-0 bg-[#00E5FF]/20 mix-blend-color-dodge z-40 animate-pulse border-8 border-[#00E5FF]/50" />}
      {realityActive && <div className="fixed inset-0 bg-red-650/20 mix-blend-color-dodge z-40 animate-pulse border-8 border-red-500/50" />}
      {portalActive && <div className="fixed inset-0 bg-amber-500/10 z-40 border-8 border-amber-400/40" />}

      {/* Configuration lobby screen */}
      {!inBattle ? (
        <div id="battle-config" className="max-w-xl mx-auto bg-slate-900/60 border border-[#1F6FEB]/30 p-6 rounded-3xl backdrop-blur-md space-y-6">
          <div className="text-center space-y-2">
            <Swords size={40} className="mx-auto text-red-500 animate-bounce" />
            <h1 className="text-2xl font-black tracking-wide uppercase">Operational war horizon</h1>
            <p className="text-xs text-slate-400 font-mono leading-normal">Configure combat rules, choose difficulty parameters, and deploy alive Reserve fighters into active strategy matrices.</p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Mode selector */}
            <div>
              <span className="text-slate-500 block mb-2 uppercase">WARFARE TARGET SCENARIO:</span>
              <div className="grid grid-cols-4 gap-2">
                {(['Quick', 'Ranked', 'Boss', 'Multiverse'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => { soundEngine.playClick(); setSelectedMode(mode); }}
                    className={`py-2 rounded-lg font-bold border transition-colors cursor-pointer text-center ${selectedMode === mode ? 'bg-[#1F6FEB] border-[#1F6FEB] text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Boss selector sub-level */}
            {selectedMode === 'Boss' && (
              <div className="bg-black/40 border border-[#EF4444]/20 p-4 rounded-xl space-y-3">
                <span className="text-[#EF4444] block font-bold uppercase tracking-widest flex items-center gap-1">👽 Active Elite Raid Target:</span>
                <div className="grid grid-cols-2 gap-2">
                  {BOSS_LIST.map((boss, idx) => (
                    <button
                      key={boss.id}
                      onClick={() => { soundEngine.playClick(); setSelectedBossIndex(idx); }}
                      className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${selectedBossIndex === idx ? 'bg-black/90 border-[#EF4444]' : 'bg-slate-950 border-slate-850 text-slate-450'}`}
                    >
                      <strong className="text-slate-200 block text-xs">{boss.name}</strong>
                      <span className="text-[9px] text-[#00E5FF] uppercase block mt-1">{boss.rewardText}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty select */}
            <div>
              <span className="text-slate-500 block mb-2">DIFFICULTY SYSTEM RATING:</span>
              <div className="grid grid-cols-5 gap-1 text-[10px]">
                {(['Easy', 'Normal', 'Hard', 'Nightmare', 'Impossible'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => { soundEngine.playClick(); setSelectedDifficulty(diff); }}
                    className={`py-2 rounded-lg font-bold border transition-colors cursor-pointer text-center ${selectedDifficulty === diff ? 'bg-red-650 border-[#E63946] text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Deploy launch button */}
            <button
              id="start-battle-trigger"
              onClick={handleStartBattle}
              className="w-full bg-[#1F6FEB] hover:bg-[#00E5FF] hover:text-black text-white font-extrabold py-3 rounded-xl text-sm transition-all tracking-widest cursor-pointer uppercase text-center block mt-6 font-sans shadow-lg"
            >
              ENGAGE COMBAT VECTOR 🦾
            </button>
          </div>
        </div>
      ) : (
        /* Inside active strategy battle screen UI */
        <div id="active-duel-board" className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Left Column: Player active hero card display (Col Span 4) */}
            <div className="md:col-span-4 bg-slate-950 border border-[#1F6FEB]/30 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              {(() => {
                const active = battleState?.playerTeam[battleState.activePlayerIndex];
                if (!active) return null;
                return (
                  <div className="space-y-3 relative uppercase font-mono">
                    <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg">
                      <span className="text-cyan-400 text-[10px] font-bold">ACTIVE WARRIOR</span>
                      <span className="text-[10px] border px-1.5 py-0.5 rounded" style={{ borderColor: active.accentColor, color: active.accentColor }}>{active.class}</span>
                    </div>

                    <div className="text-center py-6 border-b border-white/5 relative">
                      <Shield size={60} style={{ color: active.accentColor }} className="mx-auto drop-shadow-md animate-pulse" />
                      <h2 className="text-lg font-black text-slate-100 uppercase mt-4">{active.name}</h2>
                      <span className="text-xs text-slate-405 block">Rarity Index: {active.rarity}</span>
                    </div>

                    {/* Hp energy counters bar indicators */}
                    <div className="space-y-2 pt-2 text-[10px]">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>HEALTH MATRIX:</span>
                          <strong>{active.health} / {active.maxHealth} HP</strong>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                          <div id="player-active-hp" className="bg-emerald-500 h-full transition-all" style={{ width: `${(active.health / active.maxHealth) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>ULTIMATE energy:</span>
                          <strong>{active.energy}%</strong>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                          <div id="player-active-energy" className="bg-[#00E5FF] h-full transition-all" style={{ width: `${active.energy}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Middle Combat Log & interactive panel selector (Col Span 4) */}
            <div className="md:col-span-4 bg-slate-900/60 border border-[#1F6FEB]/20 rounded-2xl p-4 flex flex-col justify-between h-[450px]">
              
              {/* Universe modifiers banner */}
              {battleState?.universeModifier && (
                <div className="bg-purple-950/40 p-2 rounded border border-purple-500/20 text-[10px] font-mono text-center">
                  🌌 SPATIAL OVERRIDE: {battleState.universeModifier.name} Space is active. Multipliers applied!
                </div>
              )}

              {/* Scroll log console list */}
              <div id="combat-log-con" className="flex-1 overflow-y-auto bg-black/80 rounded border border-[#1F6FEB]/15 p-3 text-[10px] font-mono space-y-2 my-2 min-h-[220px]">
                {battleState?.battleLog.map((log) => {
                  const itemColor = 
                    log.sender === 'opponent' ? 'text-red-400' :
                    log.sender === 'system' ? 'text-[#FFD700]' : 'text-cyan-400';
                  
                  return (
                    <div key={log.id} className={`${itemColor} border-l border-white/5 pl-1.5 py-0.5`}>
                      <span className="text-slate-500 mr-1">[{log.timestamp}]</span>
                      <span className="leading-snug">{log.message}</span>
                    </div>
                  );
                })}
                <div ref={logEndRef} />
              </div>

              {/* Standard actions command panel buttons */}
              {battleState && (
                <div className="space-y-4 font-mono text-xs">
                  {battleState.winner ? (
                    <div className="bg-black/60 p-3 rounded border border-[#00E5FF]/20 text-center space-y-3">
                      <strong className="text-[#00E5FF] text-xs block uppercase">COMBAT COMPLETED INSTRUCTIONS</strong>
                      <span className="text-[10px] text-slate-450 uppercase leading-snug">
                        {battleState.winner === 'player' ? 
                          '🎉 Tactical victory! Earned +2000 Tech Coins and unlocked correspondings.' : 
                          '☠️ Mission critical error: Vanguard division collapsed.'}
                      </span>
                      <button
                        onClick={() => { soundEngine.playClick(); setInBattle(false); }}
                        className="w-full bg-[#1F6FEB] hover:bg-[#00E5FF] text-white hover:text-black font-extrabold uppercase py-2 rounded text-[11px] cursor-pointer"
                      >
                        RETURN BACK HQ
                      </button>
                    </div>
                  ) : (
                    <div>
                      {battleState.currentTurnOwner === 'player' ? (
                        <div className="space-y-2">
                          <span className="text-slate-450 text-[9px] uppercase tracking-wider block mb-1">CHOOSE YOUR TACTICAL MOVE:</span>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <button
                              id="action-basic"
                              onClick={() => executePlayerAction('Basic')}
                              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-400 font-bold py-2 rounded text-center cursor-pointer transition-colors"
                            >
                              ⚔️ Basic attack (+15 Energy)
                            </button>
                            <button
                              id="action-special"
                              onClick={() => executePlayerAction('Special')}
                              className="bg-[#1F6FEB]/10 hover:bg-[#1F6FEB]/20 border border-[#1F6FEB]/30 hover:border-[#00E5FF] font-black py-2 rounded text-center cursor-pointer transition-colors"
                            >
                              🔥 Special Strike (30 Energy)
                            </button>
                            <button
                              id="action-ultimate"
                              onClick={() => executePlayerAction('Ultimate')}
                              className="bg-amber-500 hover:bg-[#FFD700] hover:text-black text-black font-black py-2 rounded text-center cursor-pointer transition-colors col-span-2 shadow-lg"
                            >
                              ⚡ ULTIMATE ABILITY (100 Energy)
                            </button>
                            <button
                              id="action-defend"
                              onClick={() => executePlayerAction('Defend')}
                              className="bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-900 hover:border-emerald-400 font-bold py-2 rounded text-center cursor-pointer transition-colors col-span-2"
                            >
                              🛡️ Activate core Shields (+60 HP)
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-black/40 py-4 text-center text-[#E63946] font-bold border border-[#E63946]/10 rounded-xl flex items-center justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          <span>OPPONENT THINKING MOVEOUT ROUTES...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Right Column: AI Target Card status (Col Span 4) */}
            <div className="md:col-span-4 bg-slate-950 border border-red-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              {(() => {
                const active = battleState?.aiTeam[battleState.activeAiIndex];
                if (!active) return null;
                return (
                  <div className="space-y-3 relative uppercase font-mono">
                    <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg">
                      <span className="text-red-400 text-[10px] font-bold">OPPONENT ACTIVE TARGET</span>
                      <span className="bg-red-950 text-red-400 border border-red-900 border-radius-sm px-1 rounded text-[10px]">{active.class}</span>
                    </div>

                    <div className="text-center py-6 border-b border-white/5 relative">
                      <ShieldAlert size={60} className="mx-auto text-[#EF4444] animate-pulse" />
                      <h2 className="text-lg font-black text-slate-100 mt-4 tracking-wide">{active.name}</h2>
                      <span className="text-xs text-slate-451 block">Level multiplier: {active.rarity}</span>
                    </div>

                    <div className="space-y-2 pt-2 text-[10px]">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>HEALTH MATRIX:</span>
                          <strong>{active.health} / {active.maxHealth} HP</strong>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                          <div id="opponent-active-hp" className="bg-red-500 h-full transition-all" style={{ width: `${(active.health / active.maxHealth) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>ENERGY:</span>
                          <strong>{active.energy}%</strong>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                          <div id="opponent-active-energy" className="bg-[#7B2CBF] h-full transition-all" style={{ width: `${active.energy}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

          {/* Bottom active block: S.H.I.E.L.D Socketed active Infinity Stones controls */}
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl relative font-mono text-xs shadow-xl">
            <h3 className="font-bold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              💎 SOCKETED INFINITY STONES ACTIONS
            </h3>

            {battleState && (
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {battleState.stonesAvailable.map((stone) => {
                  const unlocked = stone.unlocked;
                  
                  return (
                    <button
                      key={stone.id}
                      onClick={() => handleUseInfinityStone(stone)}
                      disabled={!unlocked || battleState.currentTurnOwner !== 'player' || !!battleState.winner}
                      className={`relative p-3 border rounded-xl rounded-xl-sm text-center flex flex-col items-center justify-between transition-all select-none cursor-pointer ${
                        unlocked && battleState.currentTurnOwner === 'player' && !battleState.winner ? 'hover:scale-[1.03]' : ''
                      }`}
                      style={{
                        borderColor: unlocked ? stone.color : 'rgba(255,255,255,0.02)',
                        backgroundColor: unlocked ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.8)',
                        boxShadow: unlocked ? `0 0 10px ${stone.glowColor}` : 'none'
                      }}
                    >
                      <span className="w-5 h-5 rounded-full block mb-1.5" style={{ backgroundColor: unlocked ? stone.color : '#334155' }} />
                      <div className="text-[10px] font-black text-slate-105 uppercase tracking-wide leading-none">{stone.name}</div>
                      <p className="text-[9px] text-[#00E5FF] mt-1.5 uppercase leading-none truncate w-full h-3">
                        {unlocked ? stone.ability : 'Locked'}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

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
                  const callback = alertConfig.onClose;
                  setAlertConfig(null);
                  if (callback) callback();
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
