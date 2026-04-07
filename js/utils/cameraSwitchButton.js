export const setupCameraSwitchButton = () => {
  const cameraSwitchButton = document.getElementById('cameraSwitchButton');
  const rectFill = document.getElementById('rectFill');

  if (!cameraSwitchButton || !rectFill) return;

  cameraSwitchButton.addEventListener('click', () => {
    // Toggle the active state
    const isActive = cameraSwitchButton.classList.toggle('is-active');

    // Optional: If you want to change the border or icon color when filled
    if (isActive) {
      console.log('Square Filled');
    } else {
      console.log('Square Unfilled');
    }
  });
};
