const board = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer-display');
const restartBtn = document.getElementById('restart');

const startScreen = document.getElementById('start-screen');
const difficultyScreen = document.getElementById('difficulty-screen');
const gameScreen = document.getElementById('game-screen');

const sounds = {
    click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    flip: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
    match: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'),
    wrong: new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'),
    win: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'),
    gameover: new Audio('https://assets.mixkit.co/active_storage/sfx/253/253-preview.mp3')
};

function playSound(soundName) {
    if (sounds[soundName]) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play().catch(() => {});
    }
}

function toggleFullScreen() {
    playSound('click');
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

const icons = ['🔥', '⚡', '🍗', '⚔️', '🛡️', '🗡️', '🍺', '🏹'];
let cards = [...icons, ...icons];
let flippedCards = [];
let matchedCount = 0;
let countdown;
let timeLeft;

function showDifficulty() {
    playSound('click');
    startScreen.style.display = 'none';
    difficultyScreen.style.display = 'block';
}

function startGame(seconds) {
    playSound('click');
    timeLeft = seconds;
    difficultyScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    matchedCount = 0;
    flippedCards = [];
    timerDisplay.classList.remove('danger');
    createBoard();
    startTimer();
}

function startTimer() {
    clearInterval(countdown);
    updateTimerDisplay();
    
    countdown = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 10 && !timerDisplay.classList.contains('danger')) {
            timerDisplay.classList.add('danger');
        }

        if (timeLeft <= 0) {
            clearInterval(countdown);
            playSound('gameover');
            setTimeout(() => {
                alert('GAME OVER! O tempo acabou, bárbaro! 💀');
                resetToMain();
            }, 100);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `Tempo: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    board.innerHTML = '';
    shuffle(cards).forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="front">${icon}</div>
            <div class="back">⚔️</div>
        `;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flip') && !this.classList.contains('matched')) {
        playSound('flip');
        this.classList.add('flip');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const icon1 = card1.querySelector('.front').innerText;
    const icon2 = card2.querySelector('.front').innerText;

    if (icon1 === icon2) {
        matchedCount++;
        playSound('match');
        
        // Adiciona a classe matched e MANTÉM a classe flip ativa
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        // Remove os ouvintes de clique para evitar interações posteriores
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        
        flippedCards = [];

        if (matchedCount === icons.length) {
            clearInterval(countdown);
            playSound('win');
            setTimeout(() => {
                alert('VITÓRIA! Você honrou seus ancestrais! 🏆');
                resetToMain();
            }, 600);
        }
    } else {
        playSound('wrong');
        card1.classList.add('wrong');
        card2.classList.add('wrong');

        setTimeout(() => {
            // Em caso de erro, remove apenas as classes flip e wrong
            card1.classList.remove('flip', 'wrong');
            card2.classList.remove('flip', 'wrong');
            flippedCards = [];
        }, 800);
    }
}

function resetToMain() {
    clearInterval(countdown);
    timerDisplay.classList.remove('danger');
    gameScreen.style.display = 'none';
    difficultyScreen.style.display = 'none';
    startScreen.style.display = 'block';
}

restartBtn.addEventListener('click', () => {
    playSound('click');
    resetToMain();
});