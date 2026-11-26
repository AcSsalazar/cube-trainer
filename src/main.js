import './styles/global.css';
import { createScramblePanel } from './components/ScramblePanel.js';
import { createPuzzleSelector } from './components/PuzzleSelector.js';
import { createTimer } from './components/Timer.js';
import { createHistory } from './components/History.js';
import { createStats } from './components/Stats.js';
import { createTrainer } from './components/Trainer.js';
import { createTabs } from './components/Tabs.js';
import { createSession } from './lib/session.js';
import { registerShortcuts } from './lib/shortcuts.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="app-header">
    <h1>Cube Trainer</h1>
    <p>Scrambles y algoritmos para 3x3 y 4x4</p>
  </header>
  <main class="app-main">
    <section id="timer-view" class="app-view"></section>
    <section id="trainer-view" class="app-view"></section>
  </main>
`;

const timerView = document.querySelector('#timer-view');
const trainerView = document.querySelector('#trainer-view');
const session = createSession();

const scramblePanel = createScramblePanel(timerView);

const timer = createTimer(timerView, {
  onSolve: (ms, penalty) => {
    session.add({ ms, penalty, puzzle: scramblePanel.puzzle, scramble: scramblePanel.scramble });
    scramblePanel.next();
  },
});

const stats = createStats(timerView, {
  session,
  getPuzzle: () => scramblePanel.puzzle,
});

const history = createHistory(timerView, {
  session,
  getPuzzle: () => scramblePanel.puzzle,
});

const puzzleSelector = createPuzzleSelector(scramblePanel.slot('left'), {
  value: scramblePanel.puzzle,
  onSelect: (puzzle) => {
    scramblePanel.setPuzzle(puzzle);
    history.render();
    stats.render();
  },
});

const trainer = createTrainer(trainerView);

const tabs = createTabs(document.querySelector('.app-header'), [
  { id: 'timer', label: 'Cronómetro', panel: timerView },
  { id: 'trainer', label: 'Entrenador', panel: trainerView },
]);

const onTimerTab = () => tabs.current === 'timer' && timer.state !== 'running';

registerShortcuts({
  n: () => (onTimerTab() ? scramblePanel.next() : tabs.current === 'trainer' ? trainer.next() : false),
  c: () => (onTimerTab() ? scramblePanel.copy() : false),
  r: () => (tabs.current === 'trainer' ? trainer.reveal() : false),
  1: () => (onTimerTab() ? puzzleSelector.select('3x3') : false),
  2: () => (onTimerTab() ? puzzleSelector.select('4x4') : false),
});
