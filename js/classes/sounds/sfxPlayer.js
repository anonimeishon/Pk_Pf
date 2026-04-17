import { SoundPlayer } from './soundPlayer.js';

import { ASSETS_BASE } from '../../constants/assets.js';

const SOUNDS_PATH = `${ASSETS_BASE}sounds`;

const SOUNDS = {
  bump: { audio: new Audio(`${SOUNDS_PATH}/Bump.wav`), interval: 500 },
  confirm: { audio: new Audio(`${SOUNDS_PATH}/Confirm.wav`), interval: 0 },
  cancel: { audio: new Audio(`${SOUNDS_PATH}/Cancel.wav`), interval: 0 },
  menuMove: { audio: new Audio(`${SOUNDS_PATH}/MenuMove.wav`), interval: 0 },
};

export class SfxPlayer extends SoundPlayer {
  constructor() {
    super();
    this.sounds = SOUNDS;
  }
}
