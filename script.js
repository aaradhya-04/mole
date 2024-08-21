
document.addEventListener("DOMContentLoaded", () => {
    const holes = document.querySelectorAll('.grid-item');
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const resumeButton = document.getElementById('resume-button');
    let score = 0;
    let lastHole;
    let timeUp = false;
    let paused = false;
    let gameInterval;

    const player = {
        name: 'Player 1',
        score: 0
    };

    const gameState = {
        currentHole: null,
        score: 0,
        timeRemaining: 10000, // 10 seconds
        pausedTime: 0
    };

    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        if (hole === lastHole) {
            return randomHole(holes);
        }
        lastHole = hole;
        return hole;
    }

    function showMole() {
        const time = randomTime(500, 1000);
        const hole = randomHole(holes);
        gameState.currentHole = hole;
        const mole = document.createElement('div');
        mole.classList.add('mole');
        hole.appendChild(mole);
        mole.classList.add('active');

        setTimeout(() => {
            mole.classList.remove('active');
            hole.removeChild(mole);
            if (!timeUp && !paused) showMole();
        }, time);
    }

    function startGame() {
        timeUp = false;
        score = 0;
        player.score = 0;
        gameState.score = 0;
        gameState.pausedTime = 0;
        document.getElementById('score').textContent = `Score: ${score}`;
        showMole();
        startButton.disabled = true;
        stopButton.disabled = false;
        resumeButton.disabled = true;
        gameInterval = setTimeout(() => {
            timeUp = true;
            startButton.disabled = false;
            stopButton.disabled = true;
        }, gameState.timeRemaining);
    }

    function stopGame() {
        paused = true;
        clearTimeout(gameInterval);
        gameState.pausedTime = new Date().getTime();
        stopButton.disabled = true;
        resumeButton.disabled = false;
    }

    function resumeGame() {
        paused = false;
        const pauseDuration = new Date().getTime() - gameState.pausedTime;
        gameState.timeRemaining -= pauseDuration;
        stopButton.disabled = false;
        resumeButton.disabled = true;
        gameInterval = setTimeout(() => {
            timeUp = true;
            startButton.disabled = false;
            stopButton.disabled = true;
        }, gameState.timeRemaining);
        showMole();
    }

    holes.forEach(hole => {
        hole.addEventListener('click', (e) => {
            if (e.target.classList.contains('mole') && !paused) {
                score++;
                player.score = score;
                gameState.score = score;
                document.getElementById('score').textContent = `Score: ${score}`;
                e.target.classList.remove('active');
            }
        });
    });

    startButton.addEventListener('click', startGame);
    stopButton.addEventListener('click', stopGame);
    resumeButton.addEventListener('click', resumeGame);
});
