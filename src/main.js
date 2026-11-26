import './styles/global.css';
import { createScramblePanel } from './components/ScramblePanel.js';
import { createPuzzleSelector } from './components/PuzzleSelector.js';
import { createTimer } from './components/Timer.js';
import { createHistory } from './components/History.js';
import { createSession } from './lib/session.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="app-header">
    <h1>Cube Trainer</h1>
    <p>Scrambles y algoritmos para 3x3 y 4x4</p>
  </header>
  <main id="content" class="app-main"></main>
`;

const content = document.querySelector('#content');
const session = createSession();

const scramblePanel = createScramblePanel(content);

const timer = createTimer(content, {
  onSolve: (ms, penalty) => {
    session.add({ ms, penalty, puzzle: scramblePanel.puzzle, scramble: scramblePanel.scramble });
    scramblePanel.next();
  },
});

const history = createHistory(content, {
  session,
  getPuzzle: () => scramblePanel.puzzle,
});

const puzzleSelector = createPuzzleSelector(scramblePanel.slot('left'), {
  value: scramblePanel.puzzle,
  onSelect: (puzzle) => {
    scramblePanel.setPuzzle(puzzle);
    history.render();
  },
});
