import { FADE_DURATION } from './cameraButtonState.js';

export const fadeHtmlControls = (targetOpacity, onComplete) => {
  const htmlControls = document.getElementById('htmlCameraControls');
  if (!htmlControls) {
    onComplete?.();
    return;
  }

  if (targetOpacity === 0) {
    htmlControls.classList.add('is-hidden');
  } else {
    htmlControls.classList.remove('is-hidden');
  }

  if (onComplete) {
    setTimeout(onComplete, FADE_DURATION);
  }
};
