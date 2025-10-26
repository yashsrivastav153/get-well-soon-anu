// Background Music - Auto play with low volume
document.addEventListener('DOMContentLoaded', function() {
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.2; // Set to 20% volume (lite volume)
    
    // Try to autoplay (some browsers block autoplay without user interaction)
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Auto-play was prevented, play on first user interaction
            document.body.addEventListener('click', () => {
                bgMusic.play().catch(e => console.log('Audio play failed:', e));
            }, { once: true });
        });
    }
    
    // Initialize games
    initMemoryGame();
    initScrambleGame();
});

// Page Navigation
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    targetPage.classList.add('active');
    
    // Ensure music continues playing
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
    }
}

// ==================== MEMORY GAME ====================
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

const emojis = ['🌸', '🌹', '🌷', '💖', '🦋', '🌺', '💐', '🌼'];

function initMemoryGame() {
    const gameContainer = document.getElementById('memoryGame');
    const cardValues = [...emojis, ...emojis]; // Duplicate for pairs
    
    // Shuffle cards
    cardValues.sort(() => Math.random() - 0.5);
    
    gameContainer.innerHTML = '';
    cardValues.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-back">❤️</div>
            <div class="card-front">${emoji}</div>
        `;
        
        card.addEventListener('click', flipMemoryCard);
        gameContainer.appendChild(card);
        memoryCards.push(card);
    });
}

function flipMemoryCard() {
    if (flippedCards.length >= 2) return;
    if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
    
    this.classList.add('flipped');
    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        
        setTimeout(checkMemoryMatch, 800);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = flippedCards;
    const emoji1 = card1.dataset.emoji;
    const emoji2 = card2.dataset.emoji;
    
    if (emoji1 === emoji2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        document.getElementById('matches').textContent = matchedPairs;
        
        if (matchedPairs === 8) {
            setTimeout(showMemorySuccess, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 500);
    }
    
    flippedCards = [];
}

function showMemorySuccess() {
    const popup = document.getElementById('success-popup-memory');
    popup.classList.add('show');
    createConfettiExplosion('confetti-memory');
    document.getElementById('nextBtn2').style.display = 'inline-block';
}

function closeMemoryPopup() {
    const popup = document.getElementById('success-popup-memory');
    popup.classList.remove('show');
}

// ==================== WORD SCRAMBLE GAME ====================
const words = [
    { word: 'SMILE', scrambled: 'ILMSE', hint: 'What makes everyone happy' },
    { word: 'STRONG', scrambled: 'TGROSN', hint: 'What you are' },
    { word: 'BRAVE', scrambled: 'VBERA', hint: 'Fearless and courageous' },
    { word: 'BEAUTIFUL', scrambled: 'FTULIBAEU', hint: 'What describes Anu' },
    { word: 'SHINE', scrambled: 'HNISE', hint: 'What stars do' }
];

let currentWordIndex = 0;
let scrambleCompleted = false;

function initScrambleGame() {
    displayScrambledWord();
    
    // Allow Enter key to check answer
    document.getElementById('answerInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
}

function displayScrambledWord() {
    if (currentWordIndex < words.length) {
        document.getElementById('scrambledWord').textContent = words[currentWordIndex].scrambled;
        document.getElementById('answerInput').value = '';
        document.getElementById('result').textContent = '';
        document.getElementById('currentWord').textContent = currentWordIndex + 1;
    }
}

function checkAnswer() {
    if (scrambleCompleted) return;
    
    const userAnswer = document.getElementById('answerInput').value.toUpperCase().trim();
    const correctAnswer = words[currentWordIndex].word;
    const resultElement = document.getElementById('result');
    
    if (userAnswer === correctAnswer) {
        resultElement.textContent = '✨ Perfect, Anu ❤️! ✨';
        resultElement.className = 'scramble-result correct';
        
        currentWordIndex++;
        
        if (currentWordIndex < words.length) {
            setTimeout(displayScrambledWord, 1500);
        } else {
            scrambleCompleted = true;
            setTimeout(showScrambleSuccess, 1500);
        }
    } else {
        resultElement.textContent = '💕 Try again, you can do it! 💕';
        resultElement.className = 'scramble-result incorrect';
    }
}

function showScrambleSuccess() {
    const popup = document.getElementById('success-popup-scramble');
    popup.classList.add('show');
    createConfettiExplosion('confetti-scramble');
    document.getElementById('nextBtn3').style.display = 'inline-block';
}

function closeScramblePopup() {
    const popup = document.getElementById('success-popup-scramble');
    popup.classList.remove('show');
}

// ==================== CONFETTI EFFECT ====================
function createConfettiExplosion(containerId) {
    const container = document.getElementById(containerId);
    const colors = ['#FF69B4', '#FFB6C1', '#FF1493', '#FFC0CB', '#FF85C1', '#FFD700', '#FF6347'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

