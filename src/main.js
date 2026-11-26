import './styles/global.css';
import { createScramblePanel } from './components/ScramblePanel.js';
import { createPuzzleSelector } from './components/PuzzleSelector.js';
import { createTimer } from './components/Timer.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <header class="app-header">
    <h1>Cube Trainer</h1>
    <p>Scrambles y algoritmos para 3x3 y 4x4</p>
  </header>
  <main id="content" class="app-main"></main>
`;

const content = document.querySelector('#content');

const scramblePanel = createScramblePanel(content);

const puzzleSelector = createPuzzleSelector(scramblePanel.slot('left'), {
  value: scramblePanel.puzzle,
  onSelect: (puzzle) => scramblePanel.setPuzzle(puzzle),
});

const timer = createTimer(content, {
  onSolve: () => scramblePanel.next(),
});
