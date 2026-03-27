const ALLOWED_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Enter',
];

export class InputHandler {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.keys = [];

    /**
     * @type {{ ArrowUp: HTMLDivElement, ArrowDown: HTMLDivElement, ArrowLeft: HTMLDivElement, ArrowRight: HTMLDivElement }}
     */
    this.virtualArrowKeys = {
      ArrowUp: arrowKeyUp,
      ArrowDown: arrowKeyDown,
      ArrowLeft: arrowKeyLeft,
      ArrowRight: arrowKeyRight,
    };

    this.virtualArrowKeys.ArrowUp.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.keys.indexOf('ArrowUp') === -1) this.keys.push('ArrowUp');
      return;
    });
    this.virtualArrowKeys.ArrowUp.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.keys.splice(this.keys.indexOf('ArrowUp'), 1);
      return;
    });
    this.virtualArrowKeys.ArrowDown.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.keys.indexOf('ArrowDown') === -1) this.keys.push('ArrowDown');
      return;
    });
    this.virtualArrowKeys.ArrowDown.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.keys.splice(this.keys.indexOf('ArrowDown'), 1);
      return;
    });
    this.virtualArrowKeys.ArrowLeft.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.keys.indexOf('ArrowLeft') === -1) this.keys.push('ArrowLeft');
      return;
    });
    this.virtualArrowKeys.ArrowLeft.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.keys.splice(this.keys.indexOf('ArrowLeft'), 1);
      return;
    });
    this.virtualArrowKeys.ArrowRight.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.keys.indexOf('ArrowRight') === -1) this.keys.push('ArrowRight');
      return;
    });
    this.virtualArrowKeys.ArrowRight.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.keys.splice(this.keys.indexOf('ArrowRight'), 1);
      return;
    });
    canvas.addEventListener('keydown', (e) => {
      if (ALLOWED_KEYS.includes(e.key)) {
        e.preventDefault(); // stop arrow keys from scrolling the page
        if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key);
      }
    });

    canvas.addEventListener('keyup', (e) => {
      if (ALLOWED_KEYS.includes(e.key)) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });

    // Clear all held keys when the canvas loses focus so inputs don't get stuck
    canvas.addEventListener('blur', () => {
      this.keys = [];
    });
  }
}
