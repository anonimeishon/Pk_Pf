import { MOVEMENT_KEYS } from './movement.js';

export const CONTROL_KEYS = {
  ...MOVEMENT_KEYS,
  A: 'Enter',
  B: 'b',
};

export const DPAD_ZONE = {
  minX: 0.125,
  maxX: 0.305,
  minZ: 0.12,
  maxZ: 0.3,
  centerX: 0.215,
  centerZ: 0.21,
  deadZone: 0.02,
};

export const ACTION_ZONE_A = {
  centerX: 0.863,
  centerZ: 0.237,
  halfSize: 0.08,
};

export const ACTION_ZONE_B = {
  centerX: 0.683,
  centerZ: 0.191,
  halfSize: 0.075,
};
