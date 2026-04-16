import { CurvedText } from './CurvedText.js';

export const createModelCredits = () =>
  new CurvedText({
    text: 'Model by Wikiti on Sketchfab',
    size: 0.035,
    color: 0xffffff,
    arc: {
      center: { x: 0, y: 1.08, z: 0.12 },
      radius: 2,
      tilt: 0,
    },
  });
