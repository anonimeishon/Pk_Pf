import { unlockAudio } from './classes/sounds/soundPlayer.js';
import { gltfModelLoader } from './3d/helpers/gltfLoader.js';
import { loadingManager } from './utils/loadingManager.js';

let startScreenElement = null;

// Module promises kicked off at window.onload so asset loading begins immediately.
// requestPermissions awaits these — by then the assets may already be ready.
let _gameEnginePromise = null;
let _3dGamePromise = null;

window.onload = () => {
  startScreenElement = document.getElementById('startScreen');
  loadingManager.init(
    startScreenElement,
    document.getElementById('loadingBarContainer'),
    document.getElementById('loadingBar'),
    document.getElementById('startBtn'),
    document.getElementById('loadingText'),
  );

  // Start loading all assets immediately — no user interaction required.
  // The dynamic imports trigger top-level awaits in the module graph
  // (tileset, trainer sprite) so images load in parallel with the GLTF model.
  gltfModelLoader.instance.loadModel('gameboy');
  _gameEnginePromise = import('./startGameEngine.js');
  _3dGamePromise = import('./3d/index.js');
};

const requestPermissions = async () => {
  await unlockAudio();

  if (
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) {
    try {
      await DeviceMotionEvent.requestPermission();
    } catch (error) {}
  }

  // Await the pre-loaded modules. If assets finished loading before the user
  // clicked start, these resolve instantly; otherwise they wait for the remainder.
  const { startGameEngine } = await _gameEnginePromise;
  startGameEngine(mainCanvas);
  const { start3DGame } = await _3dGamePromise;
  start3DGame({ renderCanvas });

  startScreenElement.classList.add('start-screen-closing');
  startScreenElement.addEventListener(
    'animationend',
    () => {
      return startScreenElement.remove();
    },
    {
      once: true,
    },
  );
};

window.requestPermissions = requestPermissions;
