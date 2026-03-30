import {
  DIALOG_CHARS_PER_FRAME,
  DIALOG_CHARACTER_WIDTH,
  DIALOG_FONT,
  DIALOG_LINE_HEIGHT,
  DIALOG_LINES_PER_PAGE,
  DIALOG_MARGIN,
  DIALOG_PADDING,
} from '../constants/dialog.js';
import { CANVAS_WIDTH } from '../constants/game.js';

const MAX_CHARS_PER_LINE = Math.floor(
  (CANVAS_WIDTH - DIALOG_MARGIN * 2 - DIALOG_PADDING * 2) /
    DIALOG_CHARACTER_WIDTH,
);

export class Dialog {
  /**
   * @param {string} text
   */
  constructor(text) {
    // Collapse newlines and extra whitespace into single spaces
    this._text = text.replace(/\s+/g, ' ').trim();
    this._wrappedLines = this._wrapLines();
    this.lineOffset = 0;
    this.charIndex = 0;
  }

  reset() {
    // this._wrappedLines = this._wrapLines();
    this.lineOffset = 0;
    this.charIndex = 0;
  }

  _wrapLines() {
    const words = this._text.split(' ');
    const lines = [];
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (test.length > MAX_CHARS_PER_LINE) {
        if (current) lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  _visibleLines() {
    return this._wrappedLines.slice(
      this.lineOffset,
      this.lineOffset + DIALOG_LINES_PER_PAGE,
    );
  }

  /** @param {import('./game.js').Game} game */
  update(game) {
    const visibleLines = this._visibleLines();
    const totalChars = visibleLines.reduce((sum, l) => sum + l.length, 0);

    if (this.charIndex < totalChars) {
      this.charIndex = Math.min(
        this.charIndex + DIALOG_CHARS_PER_FRAME,
        totalChars,
      );
    }

    if (game.input.keys.includes('Enter')) {
      game.input.consumeKey('Enter');
      if (this.charIndex < totalChars) {
        // Skip typewriter to end of current window
        this.charIndex = totalChars;
      } else {
        const nextOffset = this.lineOffset + DIALOG_LINES_PER_PAGE;
        if (nextOffset < this._wrappedLines.length) {
          this.lineOffset = nextOffset;
          this.charIndex = 0;
        } else {
          this.close(game);
        }
      }
    }
  }

  /** @param {import('./game.js').Game} game */
  close(game) {
    const event = game.state.activeEvent;
    game.state.saveStateBackup({
      interactions: {
        [game.map.currentMapKey]: {
          [event.name]: { interacted: true },
        },
      },
    });
    this.reset();
    game.player.enableMovement = true;
    game.state.activeEvent = null;
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @param {import('./game.js').Game} game
   */
  draw(context, game) {
    const BOX_W = game.width - DIALOG_MARGIN * 2;

    context.save();
    context.font = DIALOG_FONT;
    context.textBaseline = 'top';

    const visibleLines = this._visibleLines();
    const totalChars = visibleLines.reduce((sum, l) => sum + l.length, 0);

    const BOX_H =
      DIALOG_PADDING * 2 + DIALOG_LINES_PER_PAGE * DIALOG_LINE_HEIGHT;
    const BOX_X = DIALOG_MARGIN;
    const BOX_Y = game.height - BOX_H - DIALOG_MARGIN;

    context.fillStyle = 'rgba(255,255,255,1)';
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(BOX_X, BOX_Y, BOX_W, BOX_H, 6);
    context.fill();
    context.stroke();

    context.fillStyle = 'black';

    let charsLeft = this.charIndex;
    for (let i = 0; i < visibleLines.length; i++) {
      if (charsLeft <= 0) break;
      const visible = visibleLines[i].slice(0, charsLeft);
      charsLeft -= visibleLines[i].length;
      context.fillText(
        visible,
        BOX_X + DIALOG_PADDING,
        BOX_Y + DIALOG_PADDING + i * DIALOG_LINE_HEIGHT,
      );
    }

    // Advance/close indicator when current window is fully shown
    if (this.charIndex >= totalChars) {
      context.fillText(
        '\u25bc',
        BOX_X + BOX_W - DIALOG_PADDING - 8,
        BOX_Y + BOX_H - DIALOG_PADDING - DIALOG_LINE_HEIGHT,
      );
    }

    context.restore();
  }
}
