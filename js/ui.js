import { isGameOver, setIsGameOver, setSkipNextMove, playSpace, hero, enemy, GameData } from './data.js';
import { buildBoard } from './board.js';
import { updateHeroPosition, moveHero } from './hero.js';
import { updateEnemyPosition } from './enemy.js';
import { playHeroDeathSound } from './sounds.js';
import { currentLevelIndex, setCurrentLevelIndex, loadLevel } from './data.js';

export let keyPressAction;

// ! Event listener supporting arrow and wasd keys (defined as a named function)
keyPressAction = (e) => {
    switch(e.keyCode){
        case 38: case 87: 
            moveHero({hs:0, vs:-1});
            break;
        case 40: case 83: 
            moveHero({hs:0, vs:1});
            break;
        case 37: case 65: 
            moveHero({hs:-1, vs:0});
            break
        case 39: case 68: 
            moveHero({hs:1, vs:0});
            break;
    }
}

// ! Restart/Game Over/Win Popups

export function restartGame() {
    setIsGameOver(false);
    setSkipNextMove(false);

    const savedHero = hero; 
    const savedEnemy = enemy;

    if (playSpace) playSpace.innerHTML = "";
    
    loadLevel(
        window.__GAME_DATA__,
        buildBoard,
        updateHeroPosition,
        updateEnemyPosition
    );

    if (playSpace && savedHero) playSpace.appendChild(savedHero);
    if (playSpace && savedEnemy) playSpace.appendChild(savedEnemy);

    document.addEventListener("keydown", keyPressAction);

    const losePopup = document.querySelector("#gameOverPopup");
    if (losePopup) losePopup.classList.remove('visible');
    
    const winPopup = document.querySelector("#winPopup");
    if (winPopup) winPopup.classList.remove('visible');
}


export function showGameOverPopup() {
    setIsGameOver(true);
    playHeroDeathSound();
    document.removeEventListener("keydown", keyPressAction);
    
    let popup = document.querySelector("#gameOverPopup");
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'gameOverPopup';
        popup.classList.add('popup', 'game-over-popup')     

        popup.innerHTML = `
            <h2>GAME OVER!</h2>
            <p>Try escaping again?</p>
            <button id="restartButton">Restart Level</button>
        `;
        document.body.appendChild(popup);
        
        document.getElementById('restartButton').addEventListener('click', restartGame);
    }
    
    popup.classList.add('visible');
}

export function showWinPopup() {
    setIsGameOver(true);
    document.removeEventListener("keydown", keyPressAction);

    let popup = document.querySelector("#winPopup");
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'winPopup';
        popup.classList.add('popup', 'win-popup');
        document.body.appendChild(popup);
    }
    
    const totalLevels = window.__GAME_DATA__ ? window.__GAME_DATA__.levels.length : 3;

    let titleText, buttonText, buttonId, paragraphText, buttonAction;

    if (currentLevelIndex < totalLevels - 1) { 
        titleText = `LEVEL ${currentLevelIndex + 1} ESCAPED!`;
        paragraphText = `Ready for Level ${currentLevelIndex + 2}?`;
        buttonText = "Go to Next Level";
        buttonId = "nextLevelButton";
        
        buttonAction = () => {
            setCurrentLevelIndex(currentLevelIndex + 1);
            setIsGameOver(false);
            setSkipNextMove(false);
            
            loadLevel(
                window.__GAME_DATA__,
                buildBoard,
                updateHeroPosition,
                updateEnemyPosition
            );

            document.addEventListener("keydown", keyPressAction);
            document.querySelector('#winPopup').classList.remove('visible');
        };

    } else { 
        titleText = "CONGRATULATIONS!";
        paragraphText = "GEE! YOU WON!!! CONGRATS ON ESCAPING ALL LEVELS!";
        buttonText = "Restart Game)";
        buttonId = "finalRestartButton";

        buttonAction = () => {
            setCurrentLevelIndex(0); 
            restartGame();
        };
    }

    popup.innerHTML = `
        <h2>${titleText}</h2>
        <p>${paragraphText}</p>
        <button id="${buttonId}">${buttonText}</button>
    `;

    document.getElementById(buttonId).addEventListener('click', buttonAction);
    
    popup.classList.add('visible');
}