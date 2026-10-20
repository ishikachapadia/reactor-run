import { GameData } from './data.js';
import { buildBoard } from './board.js';
import { updateHeroPosition } from './hero.js';
import { updateEnemyPosition } from './enemy.js';
import { keyPressAction } from './ui.js';
import { setupMusicButton } from './sounds.js';

const startScreen = document.createElement('section');
startScreen.id = 'startScreen';
startScreen.classList.add('start-screen');
document.body.appendChild(startScreen);

const title = document.createElement('h1');
title.textContent = 'Reactor Run';
startScreen.appendChild(title);

const buttonsDiv = document.createElement('div');
buttonsDiv.classList.add('buttons');
startScreen.appendChild(buttonsDiv);

const instructionsButton = document.createElement('button');
instructionsButton.textContent = 'Instructions';
buttonsDiv.appendChild(instructionsButton);

const playButton = document.createElement('button');
playButton.textContent = 'Play Game';
buttonsDiv.appendChild(playButton);


const instructionsText = document.createElement('div');
instructionsText.id = 'instructionsText';
instructionsText.classList.add('instructions-card');
instructionsText.style.display = 'none';
instructionsText.innerHTML = `
    <div class="instructions-header">
        <h2>How to Play</h2>
    </div>
    <div class="instructions-body">
        <p class="instructions-welcome">Welcome to <strong>Reactor Run</strong>! Guide your hero safely through hazardous terrain to reach the exit.</p>
        <ul class="instructions-list">
            <li><span class="instructions-label">Move:</span> <span class="key">Arrow Keys</span></li>
            <li><span class="instructions-label">Avoid:</span> Hazards and enemies</li>
            <li><span class="instructions-label">Goal:</span> Reach the exit tile to win!</li>
        </ul>
        <p class="instructions-goodluck">Good luck, and stay alert!</p>
    </div>
`;
startScreen.appendChild(instructionsText);

instructionsButton.id = 'instructionsButton';
playButton.id = 'startButton';

instructionsButton.addEventListener('click', () => {
    const isVisible = instructionsText.style.display === 'block';
    if (!isVisible) {
        instructionsText.style.display = 'block';
        instructionsText.classList.add('visible');
    } else {
        instructionsText.classList.remove('visible');
        setTimeout(() => instructionsText.style.display = 'none', 350);
    }
});

playButton.addEventListener('click', () => {
    gsap.to(startScreen, {
        duration: 0.5,
        y: '-100%',
        opacity: 0,
        onComplete: () => startScreen.remove()
    });

    const game = new GameData(
        'data.json', buildBoard, updateHeroPosition, updateEnemyPosition
    );

    document.addEventListener('keydown', keyPressAction);

    setupMusicButton();
});

