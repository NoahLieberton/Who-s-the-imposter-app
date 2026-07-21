import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from './game/useGame'
import { ProgressSteps } from './components/ProgressSteps'
import { SetupScreen } from './screens/SetupScreen'
import { PlayerNamesScreen } from './screens/PlayerNamesScreen'
import { RoleRevealScreen } from './screens/RoleRevealScreen'
import { DiscussionScreen } from './screens/DiscussionScreen'
import { VotingScreen } from './screens/VotingScreen'
import { ResultsScreen } from './screens/ResultsScreen'

const BACKGROUND_BY_SCREEN: Record<string, string> = {
  setup: 'from-violet-50 via-white to-white',
  players: 'from-violet-50 via-white to-white',
  reveal: 'from-violet-100 via-violet-50 to-white',
  discussion: 'from-amber-50 via-white to-white',
  voting: 'from-violet-50 via-white to-white',
  results: 'from-slate-50 via-white to-white',
}

function App() {
  const { state, dispatch } = useGame()

  return (
    <div
      className={`min-h-dvh bg-gradient-to-b transition-colors duration-700 ${BACKGROUND_BY_SCREEN[state.screen]}`}
    >
      <main className="mx-auto max-w-md px-4 py-8 pb-[env(safe-area-inset-bottom)]">
        {state.screen !== 'setup' && <ProgressSteps current={state.screen} />}

        <AnimatePresence mode="wait">
          <motion.div
            key={state.screen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {state.screen === 'setup' && (
              <SetupScreen
                config={state.config}
                onChange={(config) => dispatch({ type: 'SET_CONFIG', config })}
                onNext={() => dispatch({ type: 'GO_TO_PLAYERS' })}
              />
            )}

            {state.screen === 'players' && (
              <PlayerNamesScreen
                players={state.players}
                onChange={(players) => dispatch({ type: 'SET_PLAYERS', players })}
                onBack={() => dispatch({ type: 'GO_TO_SETUP' })}
                onNext={() => dispatch({ type: 'START_ROUND' })}
              />
            )}

            {state.screen === 'reveal' && state.round && (
              <RoleRevealScreen
                players={state.players}
                round={state.round}
                currentRevealIndex={state.currentRevealIndex}
                onAdvance={() => dispatch({ type: 'ADVANCE_REVEAL' })}
              />
            )}

            {state.screen === 'discussion' && state.round && (
              <DiscussionScreen
                round={state.round}
                config={state.config}
                players={state.players}
                startingPlayerId={state.startingPlayerId}
                onStartVoting={() => dispatch({ type: 'START_VOTING' })}
              />
            )}

            {state.screen === 'voting' && (
              <VotingScreen
                players={state.players}
                currentVoterIndex={state.currentVoterIndex}
                onVote={(votedForId) =>
                  dispatch({
                    type: 'CAST_VOTE',
                    vote: { voterId: state.players[state.currentVoterIndex].id, votedForId },
                  })
                }
              />
            )}

            {state.screen === 'results' && state.round && (
              <ResultsScreen
                players={state.players}
                round={state.round}
                votes={state.votes}
                score={state.score}
                onPlayAgain={() => dispatch({ type: 'RESTART_SAME_PLAYERS' })}
                onNewGame={() => dispatch({ type: 'RESET_ALL' })}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
