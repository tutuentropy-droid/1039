import { useState, useCallback } from 'react';
import {
  GameState,
  GamePhase,
  ActionType,
  RulerAlignment,
  ACTION_CONFIGS,
  GameEvent,
  RandomEvent,
} from '@/types';
import {
  rulers,
  getSchoolGameConfig,
  getRandomEvent,
  getDefaultSchoolAbilities,
} from '@/data/gameData';
import { getSchoolById } from '@/data/schools';

const INITIAL_MAX_TURNS = 20;
const INITIAL_ENERGY = 100;

const createInitialState = (): GameState => ({
  phase: 'select',
  currentTurn: 1,
  maxTurns: INITIAL_MAX_TURNS,
  playerSchoolId: null,
  state: {
    influence: {},
    prestige: 0,
    disciples: 0,
    energy: INITIAL_ENERGY,
    maxEnergy: INITIAL_ENERGY,
  },
  rulers: {},
  abilities: [],
  eventLog: [],
  selectedRulerId: null,
  gameResult: null,
});

const createRulerStates = (): Record<string, GameState['rulers'][string]> => {
  const states: Record<string, GameState['rulers'][string]> = {};
  rulers.forEach((ruler) => {
    states[ruler.id] = {
      id: ruler.id,
      alignment: 'neutral' as RulerAlignment,
      influence: 0,
      adoptedSchoolId: null,
    };
  });
  return states;
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [activeEvent, setActiveEvent] = useState<RandomEvent | null>(null);

  const selectSchool = useCallback((schoolId: string) => {
    const config = getSchoolGameConfig(schoolId);
    if (!config) return;

    const initialRulerStates = createRulerStates();
    Object.entries(config.startingInfluence).forEach(([rulerId, influence]) => {
      if (initialRulerStates[rulerId]) {
        initialRulerStates[rulerId].influence = influence;
        if (influence >= 60) {
          initialRulerStates[rulerId].alignment = 'supportive';
        } else if (influence <= 20) {
          initialRulerStates[rulerId].alignment = 'opposed';
        }
      }
    });

    setGameState({
      phase: 'playing',
      currentTurn: 1,
      maxTurns: INITIAL_MAX_TURNS,
      playerSchoolId: schoolId,
      state: {
        influence: config.startingInfluence,
        prestige: config.startingPrestige,
        disciples: config.startingDisciples,
        energy: INITIAL_ENERGY,
        maxEnergy: INITIAL_ENERGY,
      },
      rulers: initialRulerStates,
      abilities: getDefaultSchoolAbilities(schoolId),
      eventLog: [
        {
          id: 'game-start',
          turn: 1,
          type: 'system' as const,
          title: '游戏开始',
          description: `你已成为${getSchoolById(schoolId)?.name || ''}的掌门人，开始传播你的思想吧！`,
          effects: {},
        },
      ],
      selectedRulerId: rulers[0]?.id || null,
      gameResult: null,
    });
  }, []);

  const addEvent = useCallback((event: Omit<GameEvent, 'id' | 'turn'>) => {
    setGameState((prev) => ({
      ...prev,
      eventLog: [
        ...prev.eventLog,
        {
          ...event,
          id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          turn: prev.currentTurn,
        },
      ].slice(-50),
    }));
  }, []);

  const updateAlignment = useCallback((rulerId: string, influence: number): RulerAlignment => {
    if (influence >= 70) return 'supportive';
    if (influence >= 30) return 'neutral';
    return 'opposed';
  }, []);

  const performAction = useCallback(
    (actionType: ActionType, targetRulerId?: string) => {
      const config = ACTION_CONFIGS[actionType];
      const schoolConfig = gameState.playerSchoolId
        ? getSchoolGameConfig(gameState.playerSchoolId)
        : null;

      if (!schoolConfig || gameState.state.energy < config.energyCost) {
        return { success: false, reason: '体力不足' };
      }

      const bonusKey = `${actionType}Bonus` as keyof typeof schoolConfig;
      const bonus = (schoolConfig[bonusKey] as number) || 0;
      const successRate = config.baseSuccessRate + bonus / 100;
      const success = Math.random() < successRate;

      const rulerId = targetRulerId || gameState.selectedRulerId;
      if (!rulerId) return { success: false, reason: '未选择目标' };

      const currentInfluence = gameState.state.influence[rulerId] || 0;
      const currentRulerInfluence = gameState.rulers[rulerId]?.influence || 0;

      let influenceGain = 0;
      let prestigeGain = 0;
      let disciplesGain = 0;

      if (success) {
        switch (actionType) {
          case 'lecture':
            influenceGain = Math.floor(15 + Math.random() * 10 + bonus / 2);
            disciplesGain = Math.floor(5 + Math.random() * 10);
            prestigeGain = Math.floor(3 + Math.random() * 5);
            break;
          case 'debate':
            influenceGain = Math.floor(20 + Math.random() * 15 + bonus / 2);
            prestigeGain = Math.floor(10 + Math.random() * 15);
            break;
          case 'persuade':
            influenceGain = Math.floor(30 + Math.random() * 20 + bonus / 2);
            prestigeGain = Math.floor(15 + Math.random() * 20);
            break;
          case 'write':
            influenceGain = Math.floor(10 + Math.random() * 10 + bonus / 2);
            prestigeGain = Math.floor(20 + Math.random() * 25);
            disciplesGain = Math.floor(10 + Math.random() * 15);
            break;
        }
      } else {
        influenceGain = -Math.floor(5 + Math.random() * 10);
        prestigeGain = -Math.floor(3 + Math.random() * 5);
      }

      const newInfluence = Math.max(0, Math.min(100, currentInfluence + influenceGain));
      const newRulerInfluence = Math.max(0, Math.min(100, currentRulerInfluence + influenceGain));
      const newAlignment = updateAlignment(rulerId, newRulerInfluence);

      const eventTitle = success
        ? `${config.name}成功`
        : `${config.name}受挫`;

      const eventDescription = success
        ? `在${rulers.find(r => r.id === rulerId)?.stateName || ''}${config.name}，获得${influenceGain}点影响力，${prestigeGain}点声望${disciplesGain > 0 ? `，${disciplesGain}名门徒` : ''}。`
        : `在${rulers.find(r => r.id === rulerId)?.stateName || ''}${config.name}未能达到预期效果，影响力下降${Math.abs(influenceGain)}点。`;

      setGameState((prev) => ({
        ...prev,
        state: {
          ...prev.state,
          energy: prev.state.energy - config.energyCost,
          prestige: Math.max(0, prev.state.prestige + prestigeGain),
          disciples: Math.max(0, prev.state.disciples + disciplesGain),
          influence: {
            ...prev.state.influence,
            [rulerId]: newInfluence,
          },
        },
        rulers: {
          ...prev.rulers,
          [rulerId]: {
            ...prev.rulers[rulerId],
            influence: newRulerInfluence,
            alignment: newAlignment,
          },
        },
        eventLog: [
          ...prev.eventLog,
          {
            id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            turn: prev.currentTurn,
            type: 'action' as const,
            title: eventTitle,
            description: eventDescription,
            effects: {
              influence: { [rulerId]: influenceGain },
              prestige: prestigeGain,
              disciples: disciplesGain,
              energy: -config.energyCost,
            },
          },
        ].slice(-50),
      }));

      return { success, gain: influenceGain };
    },
    [gameState, updateAlignment]
  );

  const useAbility = useCallback(
    (abilityId: string, targetRulerId?: string) => {
      const ability = gameState.abilities.find((a) => a.id === abilityId);
      if (!ability || ability.currentCooldown > 0) {
        return { success: false, reason: '技能冷却中' };
      }

      const rulerId = targetRulerId || gameState.selectedRulerId;
      const config = gameState.playerSchoolId
        ? getSchoolGameConfig(gameState.playerSchoolId)
        : null;
      if (!config) return { success: false, reason: '未选择学派' };

      let effectApplied = false;
      let effects: GameEvent['effects'] = {};

      switch (ability.id.replace(/^.*-ability-/, '')) {
        case '0':
          if (rulerId && config.schoolId === 'confucianism') {
            const ruler = gameState.rulers[rulerId];
            const gain = ruler.alignment === 'supportive' ? 40 : ruler.alignment === 'neutral' ? 20 : 10;
            effects = { influence: { [rulerId]: gain } };
            effectApplied = true;
          } else if (rulerId && config.schoolId === 'taoism') {
            const allInfluence: Record<string, number> = {};
            Object.keys(gameState.rulers).forEach((id) => {
              allInfluence[id] = 10;
            });
            effects = { influence: allInfluence };
            effectApplied = true;
          } else if (rulerId && config.schoolId === 'legalism') {
            effects = { influence: { [rulerId]: 35 } };
            effectApplied = true;
          } else if (config.schoolId === 'mohism') {
            const allInfluence: Record<string, number> = {};
            Object.keys(gameState.rulers).forEach((id) => {
              allInfluence[id] = 15;
            });
            effects = { influence: allInfluence, disciples: 20 };
            effectApplied = true;
          } else if (config.schoolId === 'logicians') {
            effects = { prestige: 25 };
            effectApplied = true;
          } else if (rulerId && config.schoolId === 'yin-yang') {
            const ruler = rulers.find((r) => r.id === rulerId);
            const gain = ruler && ruler.power >= 75 ? 45 : 25;
            effects = { influence: { [rulerId]: gain } };
            effectApplied = true;
          }
          break;
        case '1':
          if (config.schoolId === 'confucianism') {
            effects = { disciples: 30, energy: 20 };
            effectApplied = true;
          } else if (config.schoolId === 'taoism') {
            effects = { energy: gameState.state.maxEnergy, prestige: 10 };
            effectApplied = true;
          } else if (rulerId && config.schoolId === 'legalism') {
            effects = { influence: { [rulerId]: 25 } };
            effectApplied = true;
          } else if (rulerId && config.schoolId === 'mohism') {
            effects = { influence: { [rulerId]: 50 } };
            effectApplied = true;
          } else if (rulerId && config.schoolId === 'logicians') {
            effectApplied = true;
          } else if (config.schoolId === 'yin-yang') {
            effectApplied = true;
          }
          break;
      }

      if (effectApplied) {
        setGameState((prev) => {
          const newState = { ...prev.state };
          const newRulers = { ...prev.rulers };

          if (effects.influence) {
            Object.entries(effects.influence).forEach(([id, gain]) => {
              const current = prev.state.influence[id] || 0;
              newState.influence = {
                ...newState.influence,
                [id]: Math.max(0, Math.min(100, current + gain)),
              };
              const rulerCurrent = prev.rulers[id]?.influence || 0;
              const newRulerInfluence = Math.max(0, Math.min(100, rulerCurrent + gain));
              newRulers[id] = {
                ...newRulers[id],
                influence: newRulerInfluence,
                alignment: updateAlignment(id, newRulerInfluence),
              };
            });
          }
          if (effects.prestige) {
            newState.prestige = Math.max(0, newState.prestige + effects.prestige);
          }
          if (effects.disciples) {
            newState.disciples = Math.max(0, newState.disciples + effects.disciples);
          }
          if (effects.energy) {
            newState.energy = Math.max(0, Math.min(newState.maxEnergy, newState.energy + effects.energy));
          }

          if (ability.id.includes('logicians') && ability.id.endsWith('1') && rulerId) {
            const current = newRulers[rulerId];
            if (current.alignment === 'opposed') {
              newRulers[rulerId] = { ...current, alignment: 'neutral' };
            } else if (current.alignment === 'neutral') {
              newRulers[rulerId] = { ...current, alignment: 'supportive' };
            }
          }

          if (ability.id.includes('legalism') && ability.id.endsWith('1') && rulerId) {
            newRulers[rulerId] = { ...newRulers[rulerId], alignment: 'supportive' };
          }

          if (ability.id.includes('yin-yang') && ability.id.endsWith('1')) {
            Object.keys(newRulers).forEach((id) => {
              if (newRulers[id].alignment === 'opposed') {
                newRulers[id] = { ...newRulers[id], alignment: 'neutral' };
              }
            });
          }

          return {
            ...prev,
            state: newState,
            rulers: newRulers,
            abilities: prev.abilities.map((a) =>
              a.id === abilityId ? { ...a, currentCooldown: a.cooldown } : a
            ),
            eventLog: [
              ...prev.eventLog,
              {
                id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                turn: prev.currentTurn,
                type: 'action' as const,
                title: `使用技能：${ability.name}`,
                description: ability.description,
                effects,
              },
            ].slice(-50),
          };
        });
      }

      return { success: effectApplied };
    },
    [gameState, updateAlignment]
  );

  const endTurn = useCallback(() => {
    const event = getRandomEvent();
    if (event && event.choices) {
      setActiveEvent(event);
      return;
    }

    finishTurn();
  }, []);

  const handleEventChoice = useCallback(
    (choiceIndex: number) => {
      if (!activeEvent || !activeEvent.choices) return;

      const choice = activeEvent.choices[choiceIndex];
      const effects = choice.effects;

      setGameState((prev) => {
        const newState = { ...prev.state };
        const newRulers = { ...prev.rulers };

        if (effects.influence) {
          Object.entries(effects.influence).forEach(([id, gain]) => {
            const current = prev.state.influence[id] || 0;
            newState.influence = {
              ...newState.influence,
              [id]: Math.max(0, Math.min(100, current + gain)),
            };
            const rulerCurrent = prev.rulers[id]?.influence || 0;
            const newRulerInfluence = Math.max(0, Math.min(100, rulerCurrent + gain));
            newRulers[id] = {
              ...newRulers[id],
              influence: newRulerInfluence,
              alignment: updateAlignment(id, newRulerInfluence),
            };
          });
        }
        if (effects.prestige) {
          newState.prestige = Math.max(0, newState.prestige + effects.prestige);
        }
        if (effects.disciples) {
          newState.disciples = Math.max(0, newState.disciples + effects.disciples);
        }
        if (effects.energy) {
          newState.energy = Math.max(0, Math.min(newState.maxEnergy, newState.energy + effects.energy));
        }

        return {
          ...prev,
          state: newState,
          rulers: newRulers,
          eventLog: [
            ...prev.eventLog,
            {
              id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              turn: prev.currentTurn,
              type: 'random' as const,
              title: activeEvent.title,
              description: choice.text,
              effects,
            },
          ].slice(-50),
        };
      });

      setActiveEvent(null);
      finishTurn();
    },
    [activeEvent, updateAlignment]
  );

  const finishTurn = useCallback(() => {
    setGameState((prev) => {
      const nextTurn = prev.currentTurn + 1;
      const energyRecovery = 20 + Math.floor(prev.state.disciples / 20);

      const newAbilities = prev.abilities.map((a) => ({
        ...a,
        currentCooldown: Math.max(0, a.currentCooldown - 1),
      }));

      const newState = {
        ...prev.state,
        energy: Math.min(prev.state.maxEnergy, prev.state.energy + energyRecovery),
      };

      let gameResult: GameState['gameResult'] = null;
      let phase: GamePhase = prev.phase;

      if (nextTurn > prev.maxTurns) {
        phase = 'ended';
        const totalInfluence = Object.values(newState.influence).reduce((a, b) => a + b, 0);
        const supportiveRulers = Object.values(prev.rulers).filter(
          (r) => r.alignment === 'supportive'
        ).length;

        if (totalInfluence >= 400 || supportiveRulers >= 4) {
          gameResult = 'victory';
        } else {
          gameResult = 'defeat';
        }
      }

      const newEventLog = [
        ...prev.eventLog,
        {
          id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          turn: prev.currentTurn,
          type: 'system' as const,
          title: `第${prev.currentTurn}回合结束`,
          description: `体力恢复${energyRecovery}点。`,
          effects: { energy: energyRecovery },
        },
      ];

      if (phase === 'ended') {
        newEventLog.push({
          id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          turn: prev.currentTurn,
          type: 'system' as const,
          title: gameResult === 'victory' ? '百家独尊' : '道消势微',
          description:
            gameResult === 'victory'
              ? '恭喜！你的思想已经传遍天下，成为百家之首！'
              : '可惜，你的思想未能在有生之年发扬光大...',
          effects: {},
        });
      }

      return {
        ...prev,
        currentTurn: nextTurn,
        state: newState,
        abilities: newAbilities,
        phase,
        gameResult,
        eventLog: newEventLog.slice(-50),
      };
    });
  }, []);

  const selectRuler = useCallback((rulerId: string) => {
    setGameState((prev) => ({
      ...prev,
      selectedRulerId: rulerId,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialState());
    setActiveEvent(null);
  }, []);

  return {
    gameState,
    activeEvent,
    selectSchool,
    performAction,
    useAbility,
    endTurn,
    handleEventChoice,
    selectRuler,
    resetGame,
  };
};

export default useGameState;
