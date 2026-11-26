import './styles/global.css';
import { createScramblePanel } from './components/ScramblePanel.js';
import { createPuzzleSelector } from './components/PuzzleSelector.js';
import { createTimer } from './components/Timer.js';
import { createHistory } from './components/History.js';
import { createStats } from './components/Stats.js';
import { createTrainer } from './components/Trainer.js';
import { createTabs } from './components/Tabs.js';
import { createManual } from './components/Manual.js';
import { createSession } from './lib/session.js';
import { registerShortcuts } from './lib/shortcuts.js';
import { createThemeToggle } from './lib/theme.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="app-header">
    <h1>Cube Trainer</h1>
    <p>Scrambles y algoritmos para 3x3 y 4x4</p>
    <p class="date">${new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
  </header>
  <main class="app-main">
    <section id="timer-view" class="app-view"></section>
    <section id="trainer-view" class="app-view"></section>
    <section id="manual-view" class="app-view"></section>
  </main>
`;

const timerView = document.querySelector('#timer-view');
const trainerView = document.querySelector('#trainer-view');
const session = createSession();
createThemeToggle(document.querySelector('.app-header'));

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

const manual = createManual(document.querySelector('#manual-view'), {
  onTrain: (set) => {
    tabs.select('trainer');
    trainer.selectSet(set);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
});

const tabs = createTabs(document.querySelector('.app-header'), [
  { id: 'timer', label: 'Cronómetro', panel: timerView },
  { id: 'trainer', label: 'Entrenador', panel: trainerView },
  { id: 'manual', label: 'Manual', panel: document.querySelector('#manual-view') },
]);

const onTimerTab = () => tabs.current === 'timer' && timer.state !== 'running';

registerShortcuts({
  n: () => (onTimerTab() ? scramblePanel.next() : tabs.current === 'trainer' ? trainer.next() : false),
  c: () => (onTimerTab() ? scramblePanel.copy() : false),
  r: () => (tabs.current === 'trainer' ? trainer.reveal() : false),
  1: () => (onTimerTab() ? puzzleSelector.select('3x3') : false),
  2: () => (onTimerTab() ? puzzleSelector.select('4x4') : false),
});
