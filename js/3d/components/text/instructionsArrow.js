import { Text } from './Text.js';
const movementVariation = Math.random() * 1000; // for subtle desynchronized bobbing
export const createInstructionsArrow = () => {
  const text = new Text({
    text: '↗',
    size: 0.4,
    color: 0xffffff,
    position: { x: 0.4, y: 1.2, z: 0.1 },
    depth: 0.04,
    variateMovement: true,
    movementVariationX: movementVariation,
    movementVariationY: movementVariation,
  });
  return text;
};
