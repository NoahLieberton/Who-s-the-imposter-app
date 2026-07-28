import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from './game/useGame'
import { ProgressSteps } from './components/ProgressSteps'
import { SoundToggle } from './components/SoundToggle'
import { SetupScreen } from './screens/SetupScreen'
import { RoleRevealScreen } from './screens/RoleRevealScreen'
import { DiscussionScreen } from './screens/DiscussionScreen'
import { VotingScreen } from './screens/VotingScreen'
import { ManualResultScreen } from './screens/ManualResultScreen'
import { ResultsScreen } from './screens/ResultsScreen'

const BACKGROUND_BY_SCREEN: Record<string, string> = {
  setup: 'from-violet-50 via-white to-white',
  reveal: 'from-violet-100 via-violet-50 to-white',
  discussion: 'from-amber-50 via-white to-white',
  voting: 'from-violet-50 via-white to-white',
  'manual-result': 'from-violet-50 via-white to-white',
  results: 'from-slate-50 via-white to-white',
}

function App() {
  const { state, dispatch } = useGame()

  return (
    <div
      className={`min-h-dvh bg-gradient-to-b transition-colors duration-700 ${BACKGROUND_BY_SCREEN[state.screen]}`}
    >
      <SoundToggle />
      <main className="mx-auto max-w-md px-4 py-8 pb-[env(safe-area-inset-bottom)]">
        {state.screen !== 'setup' && (
          <p className="mb-1 text-center text-xs font-semibold tracking-wide text-violet-400">
            🕵️ WHO'S THE IMPOSTER
          </p>
        )}
        {state.screen !== 'setup' && (
          <ProgressSteps current={state.screen === 'manual-result' ? 'voting' : state.screen} />
        )}

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
                players={state.players}
                onPlayersChange={(players) => dispatch({ type: 'SET_PLAYERS', players })}
                onAddPlayer={() => dispatch({ type: 'ADD_PLAYER' })}
                onRemovePlayer={(id) => dispatch({ type: 'REMOVE_PLAYER', id })}
                onNext={() => dispatch({ type: 'START_ROUND' })}
                hasProgress={state.usedWords.length > 0}
                onNewGame={() => dispatch({ type: 'RESET_ALL' })}
              />
            )}

            {state.screen === 'reveal' && state.round && (
              <RoleRevealScreen
                players={state.players}
                round={state.round}
                currentRevealIndex={state.currentRevealIndex}
                onAdvance={() => dispatch({ type: 'ADVANCE_REVEAL' })}
                onPrevious={() => dispatch({ type: 'PREVIOUS_REVEAL' })}
                onStop={() => dispatch({ type: 'STOP_ROUND' })}
              />
            )}

            {state.screen === 'discussion' && state.round && (
              <DiscussionScreen
                config={state.config}
                players={state.players}
                startingPlayerId={state.startingPlayerId}
                onStartVoting={() => dispatch({ type: 'START_VOTING' })}
                onStartManualResult={() => dispatch({ type: 'START_MANUAL_RESULT' })}
                onBackToReveal={() => dispatch({ type: 'BACK_TO_REVEAL' })}
                onStop={() => dispatch({ type: 'STOP_ROUND' })}
              />
            )}

            {state.screen === 'manual-result' && state.round && (
              <ManualResultScreen
                players={state.players}
                round={state.round}
                onSubmit={(result) => dispatch({ type: 'SUBMIT_MANUAL_RESULT', result })}
                onBackToDiscussion={() => dispatch({ type: 'BACK_TO_DISCUSSION' })}
                onStop={() => dispatch({ type: 'STOP_ROUND' })}
              />
            )}

            {state.screen === 'voting' && (
              <VotingScreen
                players={state.players}
                currentVoterIndex={state.currentVoterIndex}
                numImposters={state.config.numImposters}
                votes={state.votes}
                onVote={(votedForId) =>
                  dispatch({
                    type: 'CAST_VOTE',
                    vote: { voterId: state.players[state.currentVoterIndex].id, votedForId },
                  })
                }
                onPrevious={() => dispatch({ type: 'PREVIOUS_VOTE' })}
                onBackToDiscussion={() => dispatch({ type: 'BACK_TO_DISCUSSION' })}
                onStop={() => dispatch({ type: 'STOP_ROUND' })}
              />
            )}

            {state.screen === 'results' && state.round && (
              <ResultsScreen
                players={state.players}
                round={state.round}
                votes={state.votes}
                manualResult={state.manualResult}
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
