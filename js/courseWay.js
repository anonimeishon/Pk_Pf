import { Game } from './classes/game.js';
import { CANVAS_HEIGHT, CANVAS_SCALE, CANVAS_WIDTH } from './constants/game.js';

export const startGameCourse = () => {
  const canvas = mainCanvas;
  const ctx = canvas.getContext('2d');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  ctx.scale(CANVAS_SCALE, CANVAS_SCALE);

  ctx.imageSmoothingEnabled = false;

  const game = new Game(canvas.width, canvas.height);
  game.animate(ctx);
  console.log(game);
};
