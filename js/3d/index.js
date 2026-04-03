import { World } from './GameWorld.js';
import { GameBoy } from './GameBoy.js';

export const renderScreen = ({ renderCanvas }) => {
  const world = new World();
  world.add(new GameBoy(world));
  world.startLoop(renderCanvas);
};
