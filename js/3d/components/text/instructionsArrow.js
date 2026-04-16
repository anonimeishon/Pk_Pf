import { Text } from './Text.js';

export const createInstructionsArrow = () => {
  const text = new Text({
    text: '↗',
    size: 0.4,
    color: 0xffffff,
    position: { x: 0.4, y: 1.2, z: 0.1 },
    depth: 0.04,
  });
  return text;
};
