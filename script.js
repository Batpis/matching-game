// script.js
document.addEventListener('DOMContentLoaded', () => {
    const cards = [
        'assets/images/image1.jpg', 'assets/images/image1.jpg', 
        'assets/images/image2.jpg', 'assets/images/image2.jpg',
        'assets/images/image3.jpg', 'assets/images/image3.jpg',
        'assets/images/image4.jpg', 'assets/images/image4.jpg',
        'assets/images/image5.jpg', 'assets/images/image5.jpg',
        'assets/images/image6.jpg', 'assets/images/image6.jpg',
        'assets/images/image7.jpg', 'assets/images/image7.jpg',
        'assets/images/image8.jpg', 'assets/images/image8.jpg'
    ];

    const gameTitle = document.getElementById('game-title');
    const gameBoard = document.getElementById('game-board');
    const bgm = document.getElementById('bgm');
    const introVideo = document.getElementById('intro-video');
    const endVideoContainer = document.getElementById('end-video-container');
    const endVideo = document.getElementById('end-video');

    let clickSound, correctSound, incorrectSound, winSound;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;

    // Load sound effects
    function loadSounds() {
        try {
            clickSound = new Audio('assets/audio/click.mp3');
            correctSound = new Audio('assets/audio/correct.mp3');
            incorrectSound = new Audio('assets/audio/incorrect.mp3');
            winSound = new Audio('assets/audio/win.mp3');
        } catch (error) {
            console.error('Error loading sounds:', error);
        }
    }

    // Shuffle the cards
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    // Create the cards
    function createBoard() {
        shuffle(cards);
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.card = card;

            const innerElement = document.createElement('div');
            innerElement.classList.add('inner');

            const frontElement = document.createElement('div');
            frontElement.classList.add('front');

            const backElement = document.createElement('div');
            backElement.classList.add('back');
            
            const imgElement = document.createElement('img');
            imgElement.src = card;
            backElement.appendChild(imgElement);

            const correctOverlay = document.createElement('img');
            correctOverlay.classList.add('correct-overlay');
            correctOverlay.src = 'assets/images/correct.png';
            backElement.appendChild(correctOverlay);

            innerElement.appendChild(frontElement);
            innerElement.appendChild(backElement);
            cardElement.appendChild(innerElement);

            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    // Flip the card
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        clickSound.play();
        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    // Check for a match
    function checkForMatch() {
        let isMatch = firstCard.dataset.card === secondCard.dataset.card;
        if (isMatch) {
            matchedPairs++;
            if (matchedPairs === cards.length / 2) {
                winSound.play();
                endGame();
            } else {
                correctSound.play();
            }
            showCorrectOverlay();
            disableCards();
        } else {
            incorrectSound.play();
            unflipCards();
        }
    }

    // Show the correct overlay
    function showCorrectOverlay() {
        firstCard.querySelector('.correct-overlay').style.visibility = 'visible';
        secondCard.querySelector('.correct-overlay').style.visibility = 'visible';
        setTimeout(() => {
            firstCard.querySelector('.correct-overlay').style.visibility = 'hidden';
            secondCard.querySelector('.correct-overlay').style.visibility = 'hidden';
        }, 2000);
    }

    // Disable matched cards
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    // Unflip cards if no match
    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    // Reset the board
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    // End the game and show the end video
    function endGame() {
        gameBoard.style.display = 'none';
        gameTitle.style.display = 'none';
        bgm.pause();
        endVideoContainer.style.display = 'flex';
        endVideo.play();
    }

    // Toggle play/pause on video click
    function togglePlayPause(videoElement) {
        if (videoElement.paused) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    }

    // Start the game
    function startGame() {
        loadSounds();
        createBoard();
        bgm.play();
        gameTitle.style.display = 'block';
        gameBoard.style.display = 'grid';
        introVideo.style.display = 'none';
    }

    introVideo.addEventListener('ended', startGame);
    introVideo.addEventListener('click', () => togglePlayPause(introVideo));
    endVideo.addEventListener('click', () => togglePlayPause(endVideo));
});
