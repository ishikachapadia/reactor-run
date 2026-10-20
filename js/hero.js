import {hero, heroTile, tileCount, tileSize, setHeroTile, setSkipNextMove, skipNextMove, setIsGameOver, isGameOver} from './data.js';
import { getTileAction } from './board.js';
import { updateEnemyPosition, moveEnemyTowardHero } from './enemy.js';
import { showWinPopup, keyPressAction } from './ui.js';
import { playHeroMoveSound } from './sounds.js';

if (hero) {
  hero.style.width = `${tileSize}px`;
  hero.style.height = `${tileSize}px`;
}

export const updateHeroPosition = () => {
  gsap.to(hero, {
    left: heroTile.x * tileSize,
    top: heroTile.y * tileSize,
    duration: 0.2
  });
};

export const moveHero = (dir) => {
  if (isGameOver) return;

  playHeroMoveSound();

  if (skipNextMove) {
    console.log("Uh oh, careful with what you step on! Your next turn is skipped.");
    setSkipNextMove(false);
    moveEnemyTowardHero(); 
    return;
  }

  let newX = Math.max(0, Math.min(tileCount - 1, heroTile.x + dir.hs));
  let newY = Math.max(0, Math.min(tileCount - 1, heroTile.y + dir.vs));

  const tileAction = getTileAction(newX, newY);

  if (tileAction === 'skip') {
    setSkipNextMove(true);
    console.log("Uh oh, careful with what you step on! Your next turn is skipped.");
  } else if (tileAction === 'win') {
    setIsGameOver(true);
    document.removeEventListener('keydown', keyPressAction);
    showWinPopup();
    return;
  }

  setHeroTile({ x: newX, y: newY });
  updateHeroPosition();

  if (tileAction !== 'win') moveEnemyTowardHero();
};
