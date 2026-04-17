export const setupCameraSwitchButton = () => {
  const cameraSwitchButton = document.getElementById('cameraSwitchButton');
  const rectFill = document.getElementById('rectFill');

  if (!cameraSwitchButton || !rectFill) return;

  cameraSwitchButton.addEventListener('click', () => {
    const isActive = cameraSwitchButton.classList.toggle('is-active');
  });
};
