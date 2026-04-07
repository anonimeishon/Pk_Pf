/**
 * @import { TileMap } from '../../classes/tileMap.js';
 */
import { Portal } from '../../classes/portal.js';
import { TileMap } from '../../classes/tileMap.js';
import { ASSETS_BASE } from '../../constants/assets.js';
import { TRAINER_SPRITE_SIZE } from '../../constants/player.js';
import {
  SCALED_TILE_SIZE,
  TILE_SCALING_AMOUNT,
} from '../../constants/tileset.js';
import { sharedLoader } from '../../utils/assetLoader.js';
import {
  MAP_MAIN_TOWN,
  MAP_MAIN_TOWN_SOLID_TILE_IDS,
  MAP_MAIN_TOWN_TILE_SIZE,
} from './constants.js';

await sharedLoader.loadImage(
  'tileset',
  `${ASSETS_BASE}Pokemon_RBY_Tile_Set_01.png`,
);

/**
 * @extends {TileMap}
 */
export class TownMap extends TileMap {
  constructor() {
    const tilesetImage = sharedLoader.get('tileset');
    super(
      MAP_MAIN_TOWN,
      MAP_MAIN_TOWN_SOLID_TILE_IDS,
      SCALED_TILE_SIZE,
      TILE_SCALING_AMOUNT,
      {
        tileset: {
          image: tilesetImage,
          width: tilesetImage.naturalWidth,
          height: tilesetImage.naturalHeight,
          tileSize: MAP_MAIN_TOWN_TILE_SIZE,
        },
      },
      'tileset',
      new Portal([
        {
          targetMap: 'mainRoom',
          targetX: TRAINER_SPRITE_SIZE * 6,
          targetY: TRAINER_SPRITE_SIZE * 1,
          x: TRAINER_SPRITE_SIZE * 9,

          y: TRAINER_SPRITE_SIZE,
        },
      ]),
      'town',
    );
  }
}
