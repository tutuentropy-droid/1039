import { motion } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { SchoolSelect } from '@/components/game/SchoolSelect';
import { StatusPanel } from '@/components/game/StatusPanel';
import { ActionPanel } from '@/components/game/ActionPanel';
import { GameMap } from '@/components/game/GameMap';
import { EventLog } from '@/components/game/EventLog';
import { EventModal } from '@/components/game/EventModal';
import { GameResult } from '@/components/game/GameResult';
import { ActionType } from '@/types';

const GamePage = () => {
  const {
    gameState,
    activeEvent,
    selectSchool,
    performAction,
    useAbility,
    endTurn,
    handleEventChoice,
    selectRuler,
    resetGame,
  } = useGameState();

  const handleAction = (action: ActionType) => {
    performAction(action);
  };

  const handleUseAbility = (abilityId: string) => {
    useAbility(abilityId);
  };

  if (gameState.phase === 'select') {
    return <SchoolSelect onSelect={selectSchool} />;
  }

  if (gameState.phase === 'ended') {
    return <GameResult gameState={gameState} onRestart={resetGame} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-stone-50 to-ochre/10 py-8 px-4"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <StatusPanel gameState={gameState} />
          </div>
          <div className="lg:col-span-3">
            <GameMap gameState={gameState} onSelectRuler={selectRuler} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ActionPanel
              gameState={gameState}
              onAction={handleAction}
              onUseAbility={handleUseAbility}
              onEndTurn={endTurn}
            />
          </div>
          <div className="lg:col-span-1">
            <EventLog events={gameState.eventLog} />
          </div>
        </div>
      </div>

      <EventModal event={activeEvent} onChoice={handleEventChoice} />
    </motion.div>
  );
};

export default GamePage;
