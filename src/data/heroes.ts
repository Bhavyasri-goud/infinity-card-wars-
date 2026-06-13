/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HeroCard, Ability, InfinityStone, Achievement } from '../types';

export const INITIAL_HEROES: Omit<HeroCard, 'level' | 'experience' | 'xpNeeded' | 'evolutionStage' | 'currentSkin' | 'skins'>[] = [
  {
    id: 'iron_man',
    name: 'Iron Man',
    class: 'Tech',
    rarity: 'Legendary',
    attack: 85,
    defense: 80,
    speed: 78,
    intelligence: 98,
    energy: 90,
    health: 480,
    maxHealth: 480,
    powerRating: 88,
    weakness: 'Mystic magic disrupts stark tech arcs',
    strength: 'Tactical analysis of physics patterns',
    accentColor: '#FF3B30',
    glowColor: 'rgba(255, 59, 48, 0.8)',
    abilities: [
      {
        name: 'Repulsor Blast',
        description: 'Fires high-intensity thermal particle beam from palm stabilizers.',
        type: 'Basic',
        dmgMultiplier: 1.0,
        energyCost: 10
      },
      {
        name: 'Unibeam Beam',
        description: 'Charges chest Arc Reactor to release a structural melting laser.',
        type: 'Special',
        dmgMultiplier: 1.5,
        energyCost: 40,
        effect: 'Burn'
      },
      {
        name: 'Hulkbuster Protocol',
        description: 'Drops heavy orbital defense armor, inflicting massive impact damage and deploying an energetic power shield.',
        type: 'Ultimate',
        dmgMultiplier: 2.5,
        energyCost: 100,
        effect: 'Shield'
      }
    ]
  },
  {
    id: 'captain_america',
    name: 'Captain America',
    class: 'Tactical',
    rarity: 'Epic',
    attack: 75,
    defense: 95,
    speed: 72,
    intelligence: 85,
    energy: 60,
    health: 540,
    maxHealth: 540,
    powerRating: 82,
    weakness: 'Cosmic scale manipulation bypasses defenses',
    strength: 'Mystic magic counter maneuvers',
    accentColor: '#1F6FEB',
    glowColor: 'rgba(31, 111, 235, 0.8)',
    abilities: [
      {
        name: 'Shield Strike',
        description: 'Direct vibranium shield charge with defensive rebound.',
        type: 'Basic',
        dmgMultiplier: 1.0,
        energyCost: 5
      },
      {
        name: 'Tactical Rebound',
        description: 'Throws ricocheting shield hitting multiple targets and stun-blocking them.',
        type: 'Special',
        dmgMultiplier: 1.3,
        energyCost: 30,
        effect: 'Stun'
      },
      {
        name: 'Brooklyn Grit',
        description: 'Rallies all allies, fully restoring defense stats and increasing health pool.',
        type: 'Ultimate',
        dmgMultiplier: 2.0,
        energyCost: 100,
        effect: 'Heal'
      }
    ]
  },
  {
    id: 'thor',
    name: 'Thor',
    class: 'Power',
    rarity: 'Legendary',
    attack: 95,
    defense: 78,
    speed: 80,
    intelligence: 72,
    energy: 95,
    health: 520,
    maxHealth: 520,
    powerRating: 92,
    weakness: 'Tactical disablers and clever strategic traps',
    strength: 'Tech systems overloaded by electromagnetic static',
    accentColor: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.8)',
    abilities: [
      {
        name: 'Mjolnir Throw',
        description: 'Hurls the mythical hammer which flies back automatically.',
        type: 'Basic',
        dmgMultiplier: 1.1,
        energyCost: 10
      },
      {
        name: 'Thunder Hammer',
        description: 'Slam hammer on ground creating localized shockwaves.',
        type: 'Special',
        dmgMultiplier: 1.6,
        energyCost: 35,
        effect: 'Shock'
      },
      {
        name: 'God of Thunder',
        description: 'Channels cosmic electrical storms, calling down legendary Bifrost lightning bolts onto all targets.',
        type: 'Ultimate',
        dmgMultiplier: 3.0,
        energyCost: 100,
        effect: 'Paralyze'
      }
    ]
  },
  {
    id: 'hulk',
    name: 'Hulk',
    class: 'Power',
    rarity: 'Legendary',
    attack: 98,
    defense: 90,
    speed: 68,
    intelligence: 55,
    energy: 40,
    health: 600,
    maxHealth: 600,
    powerRating: 90,
    weakness: 'Cosmic telepathy and spatial manipulation',
    strength: 'Physical structural units',
    accentColor: '#4CAF50',
    glowColor: 'rgba(76, 175, 80, 0.8)',
    abilities: [
      {
        name: 'Gamma Punch',
        description: 'A crushing right-hook fueled by pure rage.',
        type: 'Basic',
        dmgMultiplier: 1.2,
        energyCost: 0
      },
      {
        name: 'Thunderclap',
        description: 'Slams hands together generating a deafening acoustic energy wave.',
        type: 'Special',
        dmgMultiplier: 1.5,
        energyCost: 20,
        effect: 'Haze'
      },
      {
        name: 'Worldbreaker Smash',
        description: 'Deep seismic leaps crushing the battlefield causing infinite ground fractures.',
        type: 'Ultimate',
        dmgMultiplier: 2.8,
        energyCost: 100,
        effect: 'Rage'
      }
    ]
  },
  {
    id: 'black_widow',
    name: 'Black Widow',
    class: 'Tactical',
    rarity: 'Rare',
    attack: 74,
    defense: 70,
    speed: 88,
    intelligence: 90,
    energy: 50,
    health: 420,
    maxHealth: 420,
    powerRating: 78,
    weakness: 'Power category direct damage attacks',
    strength: 'Mystic and mental casting delay disrupts',
    accentColor: '#E63946',
    glowColor: 'rgba(230, 57, 70, 0.8)',
    abilities: [
      {
        name: 'Acrobatic Strike',
        description: 'Quick martial kicks targeting logical structural weaknesses.',
        type: 'Basic',
        dmgMultiplier: 1.0,
        energyCost: 5
      },
      {
        name: 'Widow Bite',
        description: 'Shoots high-voltage shocking pellets from wrist gauntlets.',
        type: 'Special',
        dmgMultiplier: 1.4,
        energyCost: 25,
        effect: 'Shock'
      },
      {
        name: 'Infiltration Matrix',
        description: 'Perfect tactical espionage that poisons and disables opponent active systems.',
        type: 'Ultimate',
        dmgMultiplier: 2.1,
        energyCost: 100,
        effect: 'Poison'
      }
    ]
  },
  {
    id: 'hawkeye',
    name: 'Hawkeye',
    class: 'Tactical',
    rarity: 'Rare',
    attack: 72,
    defense: 68,
    speed: 85,
    intelligence: 84,
    energy: 55,
    health: 415,
    maxHealth: 415,
    powerRating: 75,
    weakness: 'Tech armor high-impact defense shields',
    strength: 'Speed elements and aerial flight targets',
    accentColor: '#9B5DE5',
    glowColor: 'rgba(155, 93, 229, 0.8)',
    abilities: [
      {
        name: 'Recurve Shot',
        description: 'An exceptionally precise compound arrow release.',
        type: 'Basic',
        dmgMultiplier: 1.0,
        energyCost: 10
      },
      {
        name: 'Trick Arrow',
        description: 'Fires complex explosive or sonic arrow payloads.',
        type: 'Special',
        dmgMultiplier: 1.4,
        energyCost: 30,
        effect: 'Explosion'
      },
      {
        name: 'Vanguard Rain',
        description: 'Releases a massive arrows storm, marking and bleeding enemy targets for infinite turns.',
        type: 'Ultimate',
        dmgMultiplier: 2.0,
        energyCost: 100,
        effect: 'Bleed'
      }
    ]
  },
  {
    id: 'spider_man',
    name: 'Spider-Man',
    class: 'Tech',
    rarity: 'Epic',
    attack: 82,
    defense: 75,
    speed: 96,
    intelligence: 92,
    energy: 70,
    health: 440,
    maxHealth: 440,
    powerRating: 84,
    weakness: 'Power systems high explosive kinetic waves',
    strength: 'Mystic targets tracking difficulty',
    accentColor: '#FF0055',
    glowColor: 'rgba(255, 0, 85, 0.8)',
    abilities: [
      {
        name: 'Web shooter',
        description: 'High tensile web fluid binds.',
        type: 'Basic',
        dmgMultiplier: 0.9,
        energyCost: 5
      },
      {
        name: 'Acrobatic Takedown',
        description: 'Launches target into air and pulls back firmly into the ground.',
        type: 'Special',
        dmgMultiplier: 1.4,
        energyCost: 25,
        effect: 'Vulnerability'
      },
      {
        name: 'Spider-Sense Blitz',
        description: 'Omnidirectional evasion and rapid web combos binding all enemies.',
        type: 'Ultimate',
        dmgMultiplier: 2.3,
        energyCost: 100,
        effect: 'Entangle'
      }
    ]
  },
  {
    id: 'doctor_strange',
    name: 'Doctor Strange',
    class: 'Mystic',
    rarity: 'Legendary',
    attack: 88,
    defense: 80,
    speed: 78,
    intelligence: 97,
    energy: 100,
    health: 460,
    maxHealth: 460,
    powerRating: 93,
    weakness: 'Tactical physical espionage disruptors',
    strength: 'Cosmic magic feedback amplification',
    accentColor: '#FF9500',
    glowColor: 'rgba(255, 149, 0, 0.8)',
    abilities: [
      {
        name: 'Eldritch Whip',
        description: 'Weaves glowing pure magical orange whip constructs.',
        type: 'Basic',
        dmgMultiplier: 1.0,
        energyCost: 10
      },
      {
        name: 'Shield of Seraphim',
        description: 'Generates mystic defensive mandala matrices.',
        type: 'Special',
        dmgMultiplier: 1.2,
        energyCost: 40,
        effect: 'Protection'
      },
      {
        name: 'Time Reversal',
        description: 'Activates the Eye of Agamotto to rewind space, healing damages and restoring power variables.',
        type: 'Ultimate',
        dmgMultiplier: 2.2,
        energyCost: 100,
        effect: 'Rewind'
      }
    ]
  },
  {
    id: 'scarlet_witch',
    name: 'Scarlet Witch',
    class: 'Mystic',
    rarity: 'Legendary',
    attack: 94,
    defense: 72,
    speed: 82,
    intelligence: 91,
    energy: 98,
    health: 450,
    maxHealth: 450,
    powerRating: 94,
    weakness: 'Tech metal neutral stabilizers',
    strength: 'Mystic chaos force manipulation',
    accentColor: '#7B2CBF',
    glowColor: 'rgba(123, 44, 191, 0.8)',
    abilities: [
      {
        name: 'Hex Bolt',
        description: 'Fires crimson quantum fluctuation energy waves.',
        type: 'Basic',
        dmgMultiplier: 1.1,
        energyCost: 15
      },
      {
        name: 'Telekinetic Blast',
        description: 'Direct force disruption that breaks physical shield elements.',
        type: 'Special',
        dmgMultiplier: 1.5,
        energyCost: 35,
        effect: 'Disrupt'
      },
      {
        name: 'Chaos Reality',
        description: 'Ripped reality barriers rewriting stats, healing ratios, and inflicting unpredictable logic effects.',
        type: 'Ultimate',
        dmgMultiplier: 3.2,
        energyCost: 100,
        effect: 'Confusion'
      }
    ]
  },
  {
    id: 'vision',
    name: 'Vision',
    class: 'Tech',
    rarity: 'Epic',
    attack: 80,
    defense: 88,
    speed: 84,
    intelligence: 95,
    energy: 85,
    health: 490,
    maxHealth: 490,
    powerRating: 87,
    weakness: 'Electric disruption signals or logic virus',
    strength: 'Tactical physical damage avoidance',
    accentColor: '#00F5D4',
    glowColor: 'rgba(0, 245, 212, 0.8)',
    abilities: [
      {
        name: 'Solar Beam',
        description: 'Releases pure cosmic heat energy gathered in forehead stone.',
        type: 'Basic',
        dmgMultiplier: 1.0,
        energyCost: 10
      },
      {
        name: 'Density Alteration',
        description: 'Phases cleanly through incoming damage structures to reduce impact.',
        type: 'Special',
        dmgMultiplier: 1.3,
        energyCost: 30,
        effect: 'Intangibility'
      },
      {
        name: 'Synthezoid Blast',
        description: 'Combines full mind force density with maximum thermal ray output.',
        type: 'Ultimate',
        dmgMultiplier: 2.6,
        energyCost: 100,
        effect: 'Deconstruct'
      }
    ]
  },
  {
    id: 'black_panther',
    name: 'Black Panther',
    class: 'Tactical',
    rarity: 'Epic',
    attack: 84,
    defense: 86,
    speed: 92,
    intelligence: 89,
    energy: 65,
    health: 470,
    maxHealth: 470,
    powerRating: 86,
    weakness: 'Energy projection melting armor barriers',
    strength: 'Power melee collision redirection',
    accentColor: '#242424',
    glowColor: 'rgba(255, 255, 255, 0.3)',
    abilities: [
      {
        name: 'Vibranium Claws',
        description: 'Fast slash using mineral alloys.',
        type: 'Basic',
        dmgMultiplier: 1.0,
        energyCost: 5
      },
      {
        name: 'Kinetic Wave',
        description: 'Releases absorbed kinetic damage outward.',
        type: 'Special',
        dmgMultiplier: 1.4,
        energyCost: 25,
        effect: 'Stun'
      },
      {
        name: 'Ancestral Strike',
        description: 'Summons black panther guardian energy, making his speed and defense absolute while applying a devastating bleed effect.',
        type: 'Ultimate',
        dmgMultiplier: 2.4,
        energyCost: 100,
        effect: 'Bleed'
      }
    ]
  },
  {
    id: 'ant_man',
    name: 'Ant-Man',
    class: 'Tech',
    rarity: 'Rare',
    attack: 70,
    defense: 75,
    speed: 90,
    intelligence: 88,
    energy: 60,
    health: 430,
    maxHealth: 430,
    powerRating: 77,
    weakness: 'Mystic field wide tracking arrays',
    strength: 'Tactical heavy dynamic structures evasion',
    accentColor: '#FF1493',
    glowColor: 'rgba(255, 20, 147, 0.8)',
    abilities: [
      {
        name: 'Pym Punch',
        description: 'Shrinks then grows mid-punch to add dense momentum.',
        type: 'Basic',
        dmgMultiplier: 1.0,
        energyCost: 10
      },
      {
        name: 'Ant Swarm',
        description: 'Summons millions of tiny ants to crawl on targets, reducing their speed and attack capability.',
        type: 'Special',
        dmgMultiplier: 1.3,
        energyCost: 25,
        effect: 'Vulnerability'
      },
      {
        name: 'Giant-Man Slam',
        description: 'Expands into a massive 60-foot giant crushing the battlefield with colossal footwork.',
        type: 'Ultimate',
        dmgMultiplier: 2.2,
        energyCost: 100,
        effect: 'Crush'
      }
    ]
  },
  {
    id: 'captain_marvel',
    name: 'Captain Marvel',
    class: 'Cosmic',
    rarity: 'Mythic',
    attack: 96,
    defense: 85,
    speed: 90,
    intelligence: 82,
    energy: 99,
    health: 550,
    maxHealth: 550,
    powerRating: 95,
    weakness: 'Mystic chaos spells and runes',
    strength: 'Vast energy signatures absorption',
    accentColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.8)',
    abilities: [
      {
        name: 'Photon Blast',
        description: 'Launches concentrated star-fire plasma from hands.',
        type: 'Basic',
        dmgMultiplier: 1.1,
        energyCost: 15
      },
      {
        name: 'Binary Charge',
        description: 'Powers up flight metrics to double attack potential.',
        type: 'Special',
        dmgMultiplier: 1.5,
        energyCost: 35,
        effect: 'Empower'
      },
      {
        name: 'Starhawk Buster',
        description: 'Enters state of glowing Binary fury, flying through target core units like a literal meteor.',
        type: 'Ultimate',
        dmgMultiplier: 3.2,
        energyCost: 100,
        effect: 'Stun'
      }
    ]
  },
  {
    id: 'falcon',
    name: 'Falcon',
    class: 'Tactical',
    rarity: 'Rare',
    attack: 74,
    defense: 72,
    speed: 91,
    intelligence: 80,
    energy: 55,
    health: 425,
    maxHealth: 425,
    powerRating: 76,
    weakness: 'High power gravity magic spells',
    strength: 'Heavy kinetic speed combatants',
    accentColor: '#C42021',
    glowColor: 'rgba(196, 32, 33, 0.8)',
    abilities: [
      {
        name: 'Redwing Strike',
        description: 'Deploys tiny smart drone Redwing to distract and fire mini payloads.',
        type: 'Basic',
        dmgMultiplier: 1.0,
        energyCost: 5
      },
      {
        name: 'Sonic Dive',
        description: 'Quick flight descend performing a sonic aerial slam.',
        type: 'Special',
        dmgMultiplier: 1.4,
        energyCost: 25,
        effect: 'Shock'
      },
      {
        name: 'Vanguard Swoop',
        description: 'Launches full wing thrusters, cutting through multiple enemy layers while buffing speed.',
        type: 'Ultimate',
        dmgMultiplier: 2.1,
        energyCost: 100,
        effect: 'SpeedUp'
      }
    ]
  },
  {
    id: 'winter_soldier',
    name: 'Winter Soldier',
    class: 'Tactical',
    rarity: 'Epic',
    attack: 83,
    defense: 80,
    speed: 82,
    intelligence: 84,
    energy: 50,
    health: 480,
    maxHealth: 480,
    powerRating: 81,
    weakness: 'Shield magic blocks physically based moves',
    strength: 'Mystic targets with standard low defense',
    accentColor: '#5C677D',
    glowColor: 'rgba(92, 103, 125, 0.8)',
    abilities: [
      {
        name: 'Tactical Rifle',
        description: 'Burst rifle discharges targeting high danger points.',
        type: 'Basic',
        dmgMultiplier: 1.1,
        energyCost: 10
      },
      {
        name: 'Bionic Punch',
        description: 'A titanium-hard dynamic punch using mechanical arm.',
        type: 'Special',
        dmgMultiplier: 1.5,
        energyCost: 30,
        effect: 'Vulnerability'
      },
      {
        name: 'Siberian Tempest',
        description: 'Furious strategic assault combining weaponry with cybernetic strikes.',
        type: 'Ultimate',
        dmgMultiplier: 2.3,
        energyCost: 100,
        effect: 'Wound'
      }
    ]
  },
  {
    id: 'loki',
    name: 'Loki',
    class: 'Mystic',
    rarity: 'Epic',
    attack: 78,
    defense: 76,
    speed: 88,
    intelligence: 94,
    energy: 92,
    health: 450,
    maxHealth: 450,
    powerRating: 85,
    weakness: 'Power category direct heavy physical strikes',
    strength: 'Tactical combat strategies disruption',
    accentColor: '#38A3A5',
    glowColor: 'rgba(56, 163, 165, 0.8)',
    abilities: [
      {
        name: 'Trickster Dagger',
        description: 'Quick precise throwing knives containing mystic toxins.',
        type: 'Basic',
        dmgMultiplier: 1.0,
        energyCost: 5
      },
      {
        name: 'Mirror Image',
        description: 'Spawns green light copies, completely confusing target active hits.',
        type: 'Special',
        dmgMultiplier: 1.3,
        energyCost: 30,
        effect: 'Illusion'
      },
      {
        name: 'God of Mischief',
        description: 'Deploys illusions that paralyze the opponent and transfer current debuffs back to them.',
        type: 'Ultimate',
        dmgMultiplier: 2.2,
        energyCost: 100,
        effect: 'Curse'
      }
    ]
  },
  {
    id: 'thanos',
    name: 'Thanos',
    class: 'Cosmic',
    rarity: 'Infinity',
    attack: 99,
    defense: 94,
    speed: 76,
    intelligence: 94,
    energy: 100,
    health: 580,
    maxHealth: 580,
    powerRating: 98,
    weakness: 'Team coordinate magic chain attacks',
    strength: 'General life form structures',
    accentColor: '#7B2CBF',
    glowColor: 'rgba(123, 44, 191, 0.95)',
    abilities: [
      {
        name: 'Titan Slam',
        description: 'Crushes targets using double-bladed colossal sword.',
        type: 'Basic',
        dmgMultiplier: 1.2,
        energyCost: 10
      },
      {
        name: 'Cosmic Singularity',
        description: 'Creates a mini black hole drawing in and damaging targets.',
        type: 'Special',
        dmgMultiplier: 1.6,
        energyCost: 40,
        effect: 'Burn'
      },
      {
        name: 'Infinity Snap',
        description: 'With a golden glove click, Thanos seeks balance, with a 50% chance to immediately execute a random opponent target.',
        type: 'Ultimate',
        dmgMultiplier: 4.0,
        energyCost: 100,
        effect: 'Snap'
      }
    ]
  }
];

export const INITIAL_STONES: Omit<InfinityStone, 'currentCooldown'>[] = [
  {
    id: 'space_stone',
    name: 'Space Stone',
    color: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.9)',
    ability: 'Teleport Strike',
    description: 'Bypasses enemy defenses entirely for this turn, executing standard moves with 100% Armor Penetration.',
    cooldown: 4,
    unlocked: true,
    visualEffect: 'blue-portal'
  },
  {
    id: 'time_stone',
    name: 'Time Stone',
    color: '#34D399',
    glowColor: 'rgba(52, 211, 153, 0.9)',
    ability: 'Temporal Loop',
    description: 'Instantly grants you an extra turn, bypassing the current opponent turn sequence.',
    cooldown: 6,
    unlocked: true,
    visualEffect: 'green-rewind'
  },
  {
    id: 'mind_stone',
    name: 'Mind Stone',
    color: '#FBBF24',
    glowColor: 'rgba(251, 191, 36, 0.9)',
    ability: 'Synergy Tap',
    description: 'Stuns the major enemy active fighter, draining 50 energy straight into your active team fighter.',
    cooldown: 5,
    unlocked: false,
    visualEffect: 'yellow-mind-blast'
  },
  {
    id: 'reality_stone',
    name: 'Reality Stone',
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.9)',
    ability: 'Chaos Shift',
    description: 'Randomly alters current universe modifiers, converting active opponent status buffs to damage over time.',
    cooldown: 4,
    unlocked: false,
    visualEffect: 'red-reality-shatter'
  },
  {
    id: 'power_stone',
    name: 'Power Stone',
    color: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.9)',
    ability: 'Cosmic Surge',
    description: 'Empowers active hero, multiplying critical hit chances by 3 and upgrading attack by 50% for 3 turns.',
    cooldown: 5,
    unlocked: false,
    visualEffect: 'purple-shockwave'
  },
  {
    id: 'soul_stone',
    name: 'Soul Stone',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.9)',
    ability: 'Phoenix Rebirth',
    description: 'Fully revives a fallen hero in your reserve with 50% Max health, or heals active hero to full.',
    cooldown: 7,
    unlocked: false,
    visualEffect: 'orange-soul-drain'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_victory',
    title: 'First Victory',
    description: 'Win your first strategy battle in Quick Battle or Boss Raids.',
    badgeId: 'medal',
    rewardType: 'gold',
    rewardAmount: 500,
    completed: false,
    progress: 0,
    targetProgress: 1
  },
  {
    id: '100_wins',
    title: 'Avengers Legend',
    description: 'Win 100 battles total, achieving elite status.',
    badgeId: 'shield',
    rewardType: 'crystals',
    rewardAmount: 200,
    completed: false,
    progress: 0,
    targetProgress: 100
  },
  {
    id: 'thor_master',
    title: 'Thor Master',
    description: 'Use Thor in your team and win 5 battles.',
    badgeId: 'zap',
    rewardType: 'gold',
    rewardAmount: 800,
    completed: false,
    progress: 0,
    targetProgress: 5
  },
  {
    id: 'ultimate_strategist',
    title: 'Ultimate Strategist',
    description: 'Perform 10 Ultimate Abilities total.',
    badgeId: 'award',
    rewardType: 'crystals',
    rewardAmount: 50,
    completed: false,
    progress: 0,
    targetProgress: 10
  },
  {
    id: 'infinity_collector',
    title: 'Infinity Collector',
    description: 'Unlock 4 separate unique Infinity Stones.',
    badgeId: 'gem',
    rewardType: 'crystals',
    rewardAmount: 100,
    completed: false,
    progress: 0,
    targetProgress: 4
  }
];

export const BOSS_LIST = [
  {
    id: 'ultron',
    name: 'Ultron Prime',
    class: 'Tech' as const,
    health: 1200,
    maxHealth: 1200,
    attack: 85,
    defense: 90,
    speed: 80,
    abilities: [
      { name: 'Drone Army swarm', dmgMultiplier: 1.2, description: 'Summons self-replicating drone constructs.' },
      { name: 'Encephalon Beam', dmgMultiplier: 1.6, description: 'High-damage mind laser that disables defense shields.' }
    ],
    rewardText: 'Unlocks Mind Stone + 2000 Gold',
    stoneToUnlock: 'mind_stone'
  },
  {
    id: 'kang',
    name: 'Kang the Conqueror',
    class: 'Cosmic' as const,
    health: 1500,
    maxHealth: 1500,
    attack: 90,
    defense: 85,
    speed: 88,
    abilities: [
      { name: 'Timeline Collapse', dmgMultiplier: 1.3, description: 'Alters timelines causing random structural collapses.' },
      { name: 'Temporal Siphon', dmgMultiplier: 1.8, description: 'High damage shot stealing target Energy.' }
    ],
    rewardText: 'Unlocks Reality Stone + 3000 Gold',
    stoneToUnlock: 'reality_stone'
  },
  {
    id: 'dormammu',
    name: 'Dormammu of Dark Dimension',
    class: 'Mystic' as const,
    health: 1800,
    maxHealth: 1800,
    attack: 95,
    defense: 80,
    speed: 75,
    abilities: [
      { name: 'Dark Void', dmgMultiplier: 1.4, description: 'Sucks heroes into dimension of agony, burning each turn.' },
      { name: 'Reality Despair', dmgMultiplier: 2.0, description: 'Catastrophic disintegration spell.' }
    ],
    rewardText: 'Unlocks Power Stone + 4000 Gold',
    stoneToUnlock: 'power_stone'
  },
  {
    id: 'thanos_raid',
    name: 'Thanos the Mad Titan',
    class: 'Cosmic' as const,
    health: 2500,
    maxHealth: 2500,
    attack: 105,
    defense: 98,
    speed: 78,
    abilities: [
      { name: 'Double Blade Slam', dmgMultiplier: 1.5, description: 'Colossal physical swipe.' },
      { name: 'Infinitum Devastation', dmgMultiplier: 2.5, description: 'Unleashes extreme beam using all socketed stones.' }
    ],
    rewardText: 'Unlocks Soul Stone + Thanos Card Skin!',
    stoneToUnlock: 'soul_stone'
  }
];

export const MULTIVERSE_MODIFIERS = [
  { name: 'Double Damage Universe', description: 'All attack actions deal 200% damage! Pure high-stakes warfare.', effectType: 'double_dmg' },
  { name: 'No Magic Universe', description: 'Mystic class abilities cost 3x energy! Pure physical muscle brawl.', effectType: 'no_magic' },
  { name: 'Infinite Energy Universe', description: 'Every card gains 25 energy per turn instead of 10. Ultimate rules apply.', effectType: 'inf_energy' },
  { name: 'Mirror Universe', description: 'All healing effects damage opponents, and all damage self-protects with a minor shield.', effectType: 'mirror' },
  { name: 'Zombie Universe', description: 'Fallen heroes return as undead with 1HP after 2 turns to take one last strike!', effectType: 'zombie' }
];

export const TITLES_LIST: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: 'Recruit' },
  { minLevel: 3, title: 'Agent' },
  { minLevel: 7, title: 'SHIELD Operative' },
  { minLevel: 12, title: 'Avenger' },
  { minLevel: 18, title: 'Elite Avenger' },
  { minLevel: 25, title: 'Hero Commander' },
  { minLevel: 35, title: 'Universe Protector' },
  { minLevel: 48, title: 'Infinity Guardian' },
  { minLevel: 65, title: 'Multiverse Legend' },
  { minLevel: 85, title: 'Celestial Champion' }
];
