export const setupMenuButton = () => {
  const toggleButton = document.getElementById('menuToggleButton');
  const modal = document.getElementById('portfolioModal');
  const closeButton = document.getElementById('portfolioModalClose');

  if (!toggleButton || !modal) return;

  const openModal = () => {
    modal.classList.add('is-open');
    toggleButton.classList.add('is-active');
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
    toggleButton.classList.remove('is-active');
  };

  toggleButton.addEventListener('click', openModal);
  closeButton?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
};
