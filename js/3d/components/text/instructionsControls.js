import { Text } from './Text.js';

export const createInstructionsControls = () => {
  const text = new Text({
    text: 'Enter key to interact\nArrow keys to move\nP to open menu\nEscape to cancel',
    size: 0.1,
    color: 0xffffff,
    position: { x: 0, y: -1.4, z: 0.1 },
    mediaQuery: '(min-width: 600px)',
  });
  return text;
};
