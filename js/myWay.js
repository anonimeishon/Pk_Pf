import { CANVAS_SCALE, TILE_SIZE } from './constants/game.js';

const imageNumTiles = 10; // Number of tiles per row in the tileset image

export const startGame = () => {
  const tileset = new Image();
  tileset.src = '../assets/Pokemon_RBY_Tile_Set_01.png';
  const map = [
    [1, 1, 30, 31, 1, 1, 1, 1, 1, 1],
    [1, 1, 6, 7, 1, 1, 1, 1, 1, 1],
    [1, 1, 22, 23, 1, 38, 39, 40, 41, 1],
    [1, 1, 14, 15, 1, 54, 55, 56, 57, 1],
    [1, 1, 30, 31, 1, 44, 42, 42, 43, 1],
    [1, 1, 1, 1, 1, 60, 58, 58, 59, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  tileset.onload = () => {
    const tilesPerRow = tileset.width / TILE_SIZE;
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    ctx.scale(CANVAS_SCALE, CANVAS_SCALE); // Scale up for better visibility
    ctx.imageSmoothingEnabled = false;
    const draw = () => {
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
          const tileIndex = map[row][col];

          const tileX = (tileIndex % tilesPerRow) * TILE_SIZE;
          const tileY = Math.floor(tileIndex / tilesPerRow) * TILE_SIZE;

          ctx.drawImage(
            tileset,
            tileX,
            tileY,
            TILE_SIZE,
            TILE_SIZE,
            col * TILE_SIZE,
            row * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
          );
        }
      }
    };
    draw();
    document.addEventListener('keydown', (e) => {
      console.log('🚀 ~ myWay.js:50 ~ e:', e);

      let offsetX = 0;
      let offsetY = 0;

      if (e.key === 'ArrowUp') offsetY -= TILE_SIZE;
      if (e.key === 'ArrowDown') offsetY += TILE_SIZE;
      if (e.key === 'ArrowLeft') offsetX -= TILE_SIZE;
      if (e.key === 'ArrowRight') offsetX += TILE_SIZE;

      ctx.translate(offsetX, offsetY);
      draw();
    });
    canvas.addEventListener('click', (e) => {
      console.log('🚀 ~ myWay.js:64 ~ e:', e);
    });
  };

  const DEBUG_TILE_SIZE = 8;
  const debugTileset = new Image();
  debugTileset.src = '../assets/Pokemon_RBY_Tile_Set_01.png';

  debugTileset.onload = () => {
    const tilesPerRow = Math.floor(debugTileset.width / DEBUG_TILE_SIZE);

    const debugCanvas = document.getElementById('debug-canvas');
    const ctx = debugCanvas.getContext('2d');
    ctx.scale(4, 4); // Scale up for better visibility
    // ✅ Ensure canvas fits 10x10 tiles
    // debugCanvas.width = DEBUG_TILE_SIZE * 10;
    // debugCanvas.height = DEBUG_TILE_SIZE * 10;

    // ✅ Make text visible
    ctx.font = '3px monospace ';
    ctx.fillStyle = 'red';

    for (let i = 0; i < 100; i++) {
      const x = (i % 10) * DEBUG_TILE_SIZE;
      const y = Math.floor(i / 10) * DEBUG_TILE_SIZE;

      const sx = (i % tilesPerRow) * DEBUG_TILE_SIZE;
      const sy = Math.floor(i / tilesPerRow) * DEBUG_TILE_SIZE;

      ctx.drawImage(
        debugTileset,
        sx,
        sy,
        DEBUG_TILE_SIZE,
        DEBUG_TILE_SIZE, // source
        x,
        y,
        DEBUG_TILE_SIZE,
        DEBUG_TILE_SIZE, // destination
      );

      ctx.fillText(i.toString(), x + 2, y + 6);
    }
  };
};
