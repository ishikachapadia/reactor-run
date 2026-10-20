export const playSpace = document.querySelector("#playSpace");
export const hero = document.querySelector("#hero");
export const enemy = document.querySelector("#derplenaut");

export const tileCount = 10;
export const tileSize = 80;

export let heroTile = { x: 0, y: 0 };
export let enemyTile = { x: 0, y: 0 };

export let currentLevelIndex = 0;
export let enemyMovementPerTurn = 2;

export let isGameOver = false;
export let skipNextMove = false;

export const setHeroTile = (newTile) => heroTile = newTile;
export const setEnemyTile = (newTile) => enemyTile = newTile;
export const setEnemyMovementPerTurn = (value) => enemyMovementPerTurn = value;
export const setIsGameOver = (value) => isGameOver = value;
export const setSkipNextMove = (value) => skipNextMove = value;
export const setCurrentLevelIndex = (value) => currentLevelIndex = value;

export const loadLevel = (data, buildBoard, updateHeroPosition, updateEnemyPosition) => {
    const level = data.levels[currentLevelIndex];
    const enemyData = level.enemies[0];

    setHeroTile({ x: level.heroStartCoordinates[0], y: level.heroStartCoordinates[1] });
    setEnemyTile({ x: enemyData.startCoordinates[0], y: enemyData.startCoordinates[1] });
    setEnemyMovementPerTurn(enemyData.movementPerTurn);

    if (hero) hero.style.backgroundImage = `url(${data.heroStats.characterGraphic})`;
    if (enemy) enemy.style.backgroundImage = `url(${enemyData.characterGraphic})`;

    if (playSpace) playSpace.innerHTML = "";

    buildBoard(level);

    if (playSpace && hero) playSpace.appendChild(hero);
    if (playSpace && enemy) playSpace.appendChild(enemy);

    updateHeroPosition();
    updateEnemyPosition();
};

export const goToNextLevel = (data, buildBoard, updateHeroPosition, updateEnemyPosition) => {
    setCurrentLevelIndex(currentLevelIndex + 1);
    if (currentLevelIndex < data.levels.length) {
        loadLevel(data, buildBoard, updateHeroPosition, updateEnemyPosition);
    } else {
        console.log("Congratulations! You finished all levels.");
        setIsGameOver(true);
    }
};

export class GameData {
    constructor(dataSource, buildBoard, updateHeroPosition, updateEnemyPosition) {
        fetch(dataSource)
            .then(res => res.json())
            .then(data => {
                window.__GAME_DATA__ = data;
                loadLevel(data, buildBoard, updateHeroPosition, updateEnemyPosition);
            })
            .catch(console.error);
    }
}
