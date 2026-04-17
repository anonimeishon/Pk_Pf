import { unlockAudio } from './classes/sounds/soundPlayer.js';
import { setupCameraSwitchButton } from './utils/cameraSwitchButton.js';
import { preloadGames, startGames } from './utils/gameBootstrap.js';
import { loadingManager } from './utils/loadingManager.js';
import { closeStartScreen } from './utils/startScreen.js';

let _startScreenElement = null;
let _mainCanvasElement = null;
let _renderCanvasElement = null;
let _preloadedGames = null;

window.onload = () => {
  _startScreenElement = document.getElementById('startScreen');
  _mainCanvasElement = document.getElementById('mainCanvas');
  _renderCanvasElement = document.getElementById('renderCanvas');

  setupCameraSwitchButton();
  loadingManager.init(
    _startScreenElement,
    document.getElementById('loadingBarContainer'),
    document.getElementById('loadingBar'),
    document.getElementById('startBtn'),
    document.getElementById('loadingText'),
  );

  _preloadedGames = preloadGames();
};

const requestPermissions = async () => {
  // iOS Safari: requestPermission MUST be called synchronously within the user
  // gesture handler — any await before it breaks the activation context and the
  // prompt will never appear. Start the request now, await the result later.
  const motionPermissionPromise =
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof DeviceMotionEvent.requestPermission === 'function'
      ? DeviceMotionEvent.requestPermission()
      : null;

  await unlockAudio();

  if (motionPermissionPromise) {
    try {
      await motionPermissionPromise;
      // Once granted, iOS delivers devicemotion events to the listener that
      // phoneMotionController registered at init time — no re-registration needed.
    } catch (error) {}
  }

  // Await the pre-loaded modules. If assets finished loading before the user
  // clicked start, these resolve instantly; otherwise they wait for the remainder.
  if (!_preloadedGames) {
    _preloadedGames = preloadGames();
  }

  await startGames(_preloadedGames, {
    mainCanvas: _mainCanvasElement,
    renderCanvas: _renderCanvasElement,
  });

  closeStartScreen(_startScreenElement);
};

window.requestPermissions = requestPermissions;
