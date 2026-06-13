/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HeroClass = 'Tech' | 'Mystic' | 'Power' | 'Tactical' | 'Cosmic';

export type CardRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Infinity' | 'Celestial';

export interface Ability {
  name: string;
  description: string;
  type: 'Basic' | 'Special' | 'Ultimate';
  dmgMultiplier: number;
  energyCost: number;
  effect?: string;
  effectDuration?: number;
}

export interface HeroCard {
  id: string;
  name: string;
  class: HeroClass;
  rarity: CardRarity;
  attack: number;
  defense: number;
  speed: number;
  intelligence: number;
  energy: number;
  health: number;
  maxHealth: number;
  powerRating: number;
  level: number;
  experience: number;
  xpNeeded: number;
  weakness: string;
  strength: string;
  skins: string[];
  currentSkin: string;
  evolutionStage: 'Base' | 'Enhanced' | 'Elite' | 'Legendary' | 'Infinity Form';
  abilities: Ability[];
  accentColor: string;
  glowColor: string;
  avatarUrl?: string; // fallback or styled avatar indicator
  cosmicSkinsUnlocked?: string[];
}

export interface InfinityStone {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  ability: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  unlocked: boolean;
  visualEffect: string;
}

export interface PlayerStats {
  wins: number;
  losses: number;
  battlesPlayed: number;
  bossesDefeated: string[];
  raritiesCollected: CardRarity[];
}

export type PlayerLevelTitle =
  | 'Recruit'
  | 'Agent'
  | 'SHIELD Operative'
  | 'Avenger'
  | 'Elite Avenger'
  | 'Hero Commander'
  | 'Universe Protector'
  | 'Infinity Guardian'
  | 'Multiverse Legend'
  | 'Celestial Champion';

export interface PlayerProfile {
  username: string;
  level: number;
  xp: number;
  xpNeeded: number;
  gold: number;
  crystals: number;
  title: PlayerLevelTitle;
  avatarId: string;
  unlockedChests: number;
  ownedHeroes: HeroCard[];
  achievements: Achievement[];
  claimedDailyDays: number[];
  bossesDefeated: string[];
  lastLoginDate: string; // ISO String
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeId: string;
  rewardType: 'gold' | 'crystals' | 'card';
  rewardAmount: number;
  completed: boolean;
  progress: number;
  targetProgress: number;
}

export interface BattleLogEntry {
  id: string;
  turn: number;
  sender: 'player' | 'opponent' | 'system';
  message: string;
  timestamp: string;
}

export interface BattleHeroState {
  id: string;
  heroId: string;
  name: string;
  class: HeroClass;
  rarity: CardRarity;
  attack: number;
  defense: number;
  speed: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  accentColor: string;
  glowColor: string;
  abilities: Ability[];
  statusEffects: { type: string; duration: number; value?: number }[];
  isDefeated: boolean;
}

export interface BattleState {
  id: string;
  mode: 'Quick' | 'Ranked' | 'Tournament' | 'Boss' | 'Multiverse' | 'Endgame';
  bossType?: 'Thanos' | 'Ultron' | 'Kang' | 'Dormammu' | 'Galactus';
  bossPhase?: number;
  universeModifier?: {
    name: string;
    description: string;
    effectType: string;
  };
  playerTeam: BattleHeroState[];
  aiTeam: BattleHeroState[];
  activePlayerIndex: number;
  activeAiIndex: number;
  turnNumber: number;
  currentTurnOwner: 'player' | 'opponent';
  battleLog: BattleLogEntry[];
  slowMoFinishing: boolean;
  winner?: 'player' | 'opponent';
  stonesAvailable: InfinityStone[];
  rewardClaimed?: boolean;
}

export type GameScreen = 'Hq' | 'Collection' | 'TeamBuilder' | 'Battle' | 'Store' | 'Leaderboards' | 'ShieldAi';
