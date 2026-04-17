export const closeStartScreen = (startScreenElement) => {
  if (!startScreenElement) {
    return;
  }

  // Double rAF: gives the browser two frames to finish painting the current
  // state before starting the animation, preventing the first-frame chop on
  // Chrome and ensuring a clean start in all browsers.
  startScreenElement.classList.add('start-screen-closing');
  startScreenElement.addEventListener(
    'animationend',
    () => {
      startScreenElement.remove();
    },
    {
      once: true,
    },
  );
};
