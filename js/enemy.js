import { enemy, enemyTile, heroTile, enemyMovementPerTurn, tileCount, tileSize, setEnemyTile, setIsGameOver,isGameOver} from './data.js';
import { isObstacle } from './board.js';
import { showGameOverPopup, keyPressAction } from './ui.js';
import { playEnemyMoveSound, tryMonsterScream } from './sounds.js';

if (enemy) {
  enemy.style.width = `${tileSize}px`;
  enemy.style.height = `${tileSize}px`;
}

export const updateEnemyPosition = () => {
  gsap.to(enemy, {
    left: enemyTile.x * tileSize,
    top: enemyTile.y * tileSize,
    duration: 0.3
  });
};

const distSq = (x1, y1, x2, y2) => (x1 - x2) ** 2 + (y1 - y2) ** 2;

export const moveEnemyTowardHero = () => {
  if (isGameOver) return;

  for (let step = 0; step < enemyMovementPerTurn; step++) {
    playEnemyMoveSound();

    const dx = heroTile.x - enemyTile.x;
    const dy = heroTile.y - enemyTile.y;

    if (dx === 0 && dy === 0) {
      setIsGameOver(true);
      document.removeEventListener('keydown', keyPressAction);
      showGameOverPopup();
      break;
    }

    const currentDist = distSq(enemyTile.x, enemyTile.y, heroTile.x, heroTile.y);

    const priorityMoves = [];
    if (dx !== 0) priorityMoves.push({ x: dx > 0 ? 1 : -1, y: 0 });
    if (dy !== 0) priorityMoves.push({ x: 0, y: dy > 0 ? 1 : -1 });

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    priorityMoves.sort((a, b) => (absDx > absDy ? (b.x !== 0 ? -1 : 1) : absDy > absDx ? (b.y !== 0 ? -1 : 1) : 0));

    let moved = false;
    let finalMove = null;

    for (const move of priorityMoves) {
      const newX = enemyTile.x + move.x;
      const newY = enemyTile.y + move.y;
      if (newX >= 0 && newX < tileCount && newY >= 0 && newY < tileCount && !isObstacle(newX, newY)) {
        finalMove = move;
        moved = true;
        break;
      }
    }

    if (!moved) {
      const cardinalMoves = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      ];

      let bestMove = null;
      let bestDist = currentDist;

      for (const move of cardinalMoves) {
        const newX = enemyTile.x + move.x;
        const newY = enemyTile.y + move.y;

        if (newX >= 0 && newX < tileCount && newY >= 0 && newY < tileCount && !isObstacle(newX, newY)) {
          const newDist = distSq(newX, newY, heroTile.x, heroTile.y);
          if (newDist < bestDist) {
            bestDist = newDist;
            bestMove = move;
            moved = true;
          }
        }
      }

      if (!bestMove) {
        for (const move of cardinalMoves) {
          const newX = enemyTile.x + move.x;
          const newY = enemyTile.y + move.y;
          if (newX >= 0 && newX < tileCount && newY >= 0 && newY < tileCount && !isObstacle(newX, newY)) {
            const newDist = distSq(newX, newY, heroTile.x, heroTile.y);
            if (newDist <= currentDist) {
              bestMove = move;
              moved = true;
              break;
            }
          }
        }
      }

      finalMove = bestMove;
    }

    if (moved && finalMove) setEnemyTile({ x: enemyTile.x + finalMove.x, y: enemyTile.y + finalMove.y });
    else break;

    updateEnemyPosition();
    tryMonsterScream();

    if (enemyTile.x === heroTile.x && enemyTile.y === heroTile.y) {
      setIsGameOver(true);
      document.removeEventListener('keydown', keyPressAction);
      showGameOverPopup();
      break;
    }
  }
};
