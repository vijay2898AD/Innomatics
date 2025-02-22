document.addEventListener("DOMContentLoaded", () => {
    const categories = {
        fruits: ['🍎', '🍌', '🍇', '🍉', '🍓', '🍍', '🍊', '🍑'],
        emojis: ['😀', '😂', '😍', '😎', '😢', '😡', '😱', '🤔'],
        animals: ['🐶', '🐱', '🐰', '🐸', '🐷', '🐮', '🐔', '🦁'],
        planets: ['🌍', '🌕', '🌟', '🌌', '🌑', '🌞', '🌎', '🌏'],
        flags: ['🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇯🇵', '🇧🇷']
    };
    window.flipSound = new Audio("sound/flipcard-91468.mp3");
window.matchSound = new Audio("sound/success-1-6297.mp3");
window.gameOverSound = new Audio("sound/videogame-death-sound-43894.mp3");

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("gameState")) {
        console.log("No saved game, waiting for user to start.");
    } else {
        loadGameState();
    }
});

document.body.addEventListener("click", () => {
    flipSound.play().catch(() => {});
}, { once: true });

    let selectedCategory = null;
    let difficulty = null;
    let cards, flippedCards, score, timer, timeLeft;

    function setDifficulty(level) {
        difficulty = level;
        console.log("Difficulty set to:", level);
        document.getElementById('selected-difficulty').innerText = `Difficulty: ${level.toUpperCase()}`;

        document.querySelectorAll(".difficulty button").forEach(button => {
            button.classList.remove("selected");
        });

        const selectedButton = document.querySelector(`button[data-difficulty="${level}"]`);
        if (selectedButton) {
            selectedButton.classList.add("selected");
    }
    }

    function startGame(category) {
        if (!difficulty) {
            alert("Please select a difficulty first!");
            return;
        }
        console.log(`Starting game with category: ${category} and difficulty: ${difficulty}`);
        selectedCategory = category;
        cards = createCards(selectedCategory);
        score = 0;
        timeLeft = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 45 : 30;

        document.getElementById('score').innerText = `Score: ${score}`;
        document.getElementById('timer').innerText = `Time: ${timeLeft}`;
        
        document.getElementById('landing-page').style.display = "none";
        document.getElementById('game-container').style.display = "flex";

        renderCards();
        startTimer();
        saveGameState();
    }

    function createCards(category) {
        const cardValues = [...categories[category], ...categories[category]];
        return shuffle(cardValues);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderCards() {
        const cardsContainer = document.getElementById('cards-container');
        cardsContainer.innerHTML = '';
        flippedCards = [];

        cards.forEach((value, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-value', value);
            card.setAttribute('data-index', index);
            card.addEventListener('click', handleCardClick);
            cardsContainer.appendChild(card);
        });
    }

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.log("Sound play blocked:", error));
    }

    function handleCardClick(event) {
        const card = event.currentTarget;
        if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
            card.classList.add('flipped');
            card.innerText = card.getAttribute('data-value');
            flippedCards.push(card);

            playSound(flipSound);

            if (flippedCards.length === 2) {
                setTimeout(checkForMatch, 800);
            }
        }

        saveGameState();
    }

    function checkForMatch() {
        const [firstCard, secondCard] = flippedCards;
        if (firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value')) {
            score += 10;
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            firstCard.removeEventListener('click', handleCardClick);
            secondCard.removeEventListener('click', handleCardClick);

            matchSound.play();

        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard.innerText = '';
                secondCard.innerText = '';
            }, 500);
        }

        flippedCards = [];
        document.getElementById('score').innerText = `Score: ${score}`;
        checkGameOver();
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').innerText = `Time: ${timeLeft}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame(false);
            }
        }, 1000);
    }

    function checkGameOver() {
        const matchedCards = document.querySelectorAll('.matched');
        if (matchedCards.length === cards.length) {
            endGame(true);
        }
    }

    function endGame(isWin) {
        clearInterval(timer);
        gameOverSound.play();
        const gameOverMessage = document.getElementById('game-over');
        gameOverMessage.innerText = isWin ? `You Win! Final Score: ${score}` : `Game Over! Final Score: ${score}`;
        gameOverMessage.classList.remove('hidden');
        document.getElementById('restart-btn').classList.remove('hidden');
        document.querySelectorAll('.card').forEach(card => {
            card.removeEventListener('click', handleCardClick);
        });
    
        localStorage.removeItem('gameState');
    }

    function restartGame() {
        document.getElementById('game-container').style.display = "none";
        document.getElementById('landing-page').style.display = "block";
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('restart-btn').classList.add('hidden');
        score = 0;
        timeLeft = 30;
    }

    function saveGameState() {
        const gameState = {
            selectedCategory,
            difficulty,
            score,
            timeLeft,
            cards: [...cards],
            flippedCards: flippedCards.map(card => card.getAttribute('data-index'))
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }
    
    function loadGameState() {
        console.log("Loading game state...");
        const savedState = localStorage.getItem('gameState');
    
        if (!savedState) {
            console.log("No saved game state found. Starting new.");
            return;
        }
    
        console.log("Game state found:", savedState);
        const gameState = JSON.parse(savedState);
    
        selectedCategory = gameState.selectedCategory;
        difficulty = gameState.difficulty;
        score = gameState.score;
        timeLeft = gameState.timeLeft;
        cards = gameState.cards || [];

        document.getElementById('score').innerText = `Score: ${score}`;
        document.getElementById('timer').innerText = `Time: ${timeLeft}`;
    
        renderCards();
    
        gameState.flippedCards.forEach(index => {
            const card = document.querySelector(`.card[data-index="${index}"]`);
            if (card) {
                card.classList.add('flipped');
                card.innerText = card.getAttribute('data-value');
            }
        });
    
        startTimer();
    }

    window.addEventListener("beforeunload", saveGameState);


    window.setDifficulty = setDifficulty;
    window.startGame = startGame;
    window.restartGame = restartGame;
});
