import { playSpace, tileCount, tileSize } from './data.js';

// ! Building the board w the tiles
export const buildBoard = (level) => {
  playSpace.style.width = `${tileCount * tileSize}px`;
  playSpace.style.height = `${tileCount * tileSize}px`;

  level.terrain.forEach(tileType => {
    tileType.coordinates.forEach(([x, y]) => {
      const div = document.createElement('div');
      div.classList.add('tile', tileType.type);
      div.dataset.type = tileType.type;
      div.dataset.x = x;
      div.dataset.y = y;
      div.style.left = `${x * tileSize}px`;
      div.style.top = `${y * tileSize}px`;
      div.style.backgroundImage = `url(${tileType.graphic})`;
      playSpace.appendChild(div);
    });
  });
};

// ! Checks for obstacles
export const isObstacle = (x, y) => {
  const tiles = document.querySelectorAll(`.tile[data-x="${x}"][data-y="${y}"]`);
  return Array.from(tiles).some(tile =>
    ["Slime", "Gas", "GlassShards"].includes(tile.dataset.type)
  );
};

// ! Checks for tile actions for the hero
export const getTileAction = (x, y) => {
  const tiles = document.querySelectorAll(`.tile[data-x="${x}"][data-y="${y}"]`);
  if (!tiles.length) return null;

  for (const tile of tiles) {
    const type = tile.dataset.type;
    if (["Gas", "GlassShards", "Slime"].includes(type)) return "skip";
    if (type === "Exit") return "win";
  }
  return null;
};