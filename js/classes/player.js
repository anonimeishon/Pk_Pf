import { TRAINER_SPRITE_SIZE } from '../constants/game.js';
import { AssetLoader } from '../utils/assetLoader.js';

const loader = new AssetLoader();
await loader.loadImage(
  'trainer',
  '../assets/sprites/pokemon_gen_1_trainer_sprite.png',
);

const debugScale = 4;
export class Player {
  constructor(game) {
    this.game = game;
    this.width = TRAINER_SPRITE_SIZE;
    this.height = TRAINER_SPRITE_SIZE;
    this.x = 50;
    this.y = 50;
    this.sprite = this._trainerSprite();
  }
  _trainerSprite() {
    let trainer = loader.get('trainer');

    return trainer;
  }
  update() {
    this.x++;
  }
  draw(context) {
    // Save context state before scaling
    // context.save();

    // context.fillRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.sprite,
      0 * debugScale,
      0 * debugScale,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height,
    );

    // Restore context state (removes the scale)
    // context.restore();
  }
}
