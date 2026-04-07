/**
 * @import { TileMap } from '../../classes/tileMap.js';
 */
import { Portal } from '../../classes/portal.js';
import { TileMap } from '../../classes/tileMap.js';
import { EventTrigger } from '../../classes/eventTrigger.js';
import { ASSETS_BASE } from '../../constants/assets.js';
import { TRAINER_SPRITE_SIZE } from '../../constants/player.js';
import {
  SCALED_TILE_SIZE,
  TILE_SCALING_AMOUNT,
} from '../../constants/tileset.js';
import { sharedLoader } from '../../utils/assetLoader.js';
import {
  MAP_MAIN_ROOM,
  MAP_MAIN_ROOM_SOLID_TILE_IDS,
  MAP_MAIN_ROOM_TILE_SIZE,
} from './constants.js';

await sharedLoader.loadImage(
  'tileset',
  `${ASSETS_BASE}Pokemon_RBY_Tile_Set_01.png`,
);
await sharedLoader.loadImage(
  'complete',
  `${ASSETS_BASE}gen-1-complete-tileset.png`,
);

/**
 * @extends {TileMap}
 */
export class MainRoomMap extends TileMap {
  constructor() {
    const tilesetImage = sharedLoader.get('tileset');
    const completeTilesetImage = sharedLoader.get('complete');

    super(
      MAP_MAIN_ROOM,
      MAP_MAIN_ROOM_SOLID_TILE_IDS,
      SCALED_TILE_SIZE,
      TILE_SCALING_AMOUNT,
      {
        tileset: {
          image: tilesetImage,
          width: tilesetImage.naturalWidth,
          height: tilesetImage.naturalHeight,
          tileSize: MAP_MAIN_ROOM_TILE_SIZE,
        },
        complete: {
          image: completeTilesetImage,
          width: completeTilesetImage.naturalWidth,
          height: completeTilesetImage.naturalHeight,
          tileSize: MAP_MAIN_ROOM_TILE_SIZE * 2,
        },
      },
      'tileset',
      new Portal([
        {
          targetMap: 'town',
          targetX: TRAINER_SPRITE_SIZE * 9,
          targetY: TRAINER_SPRITE_SIZE * 1,
          x: TRAINER_SPRITE_SIZE * 6,

          y: TRAINER_SPRITE_SIZE,
        },
      ]),
      'mainRoom',
      [
        new EventTrigger({
          name: 'computer',
          positions: [
            { x: TRAINER_SPRITE_SIZE * 0, y: TRAINER_SPRITE_SIZE * 1 },
          ],
          action: 'dialog',
          dialog: 'This is my computer... it is the best computer in town...',
        }),
      ],
    );
  }
}
