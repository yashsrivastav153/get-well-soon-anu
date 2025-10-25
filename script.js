// Global variables
let currentPage = 1;
let currentPhoto = 0;
let isPlaying = false;
let currentSong = 0;

// Photo data for the memories section
const photos = [
    {
        characters: { shinchan: "👦", himawari: "👶" },
        message: {
            hindi1: "Tu abhi choti hai",
            hindi2: "kam bola kar samjhi",
            hehe: "Hehe"
        }
    },
    {
        characters: { shinchan: "👦", himawari: "👧" },
        message: {
            hindi1: "Pehle bhi cute thi",
            hindi2: "ab aur bhi cute ho gayi",
            hehe: "😊"
        }
    },
    {
        characters: { shinchan: "👦", himawari: "👶" },
        message: {
            hindi1: "Chocolate kha le",
            hindi2: "bhai ne gift diya hai",
            hehe: "🍫"
        }
    }
];

// Song data
const songs = [
    { title: "Phoolo Ka Taaron Ka", duration: "0:25" },
    { title: "Bhai Dooj Special", duration: "0:30" },
    { title: "Sister Love Song", duration: "0:20" }
];

// Page navigation
function showPage(pageNumber) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(`page${pageNumber}`).classList.add('active');
    currentPage = pageNumber;
    
    // Special handling for specific pages
    if (pageNumber === 3) {
        updatePhotoDisplay();
    } else if (pageNumber === 4) {
        updateMusicDisplay();
    }
}

// Tic-tac-toe game functions
function fillCell(cell) {
    if (cell.textContent === '') {
        cell.textContent = '🍫';
        cell.style.background = '#ffeef8';
        
        // Check if game is complete
        setTimeout(() => {
            showSuccessMessage();
        }, 500);
    }
}

function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    const nextBtn = document.getElementById('next-btn-2');
    
    successMessage.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    
    // Add celebration animation
    successMessage.style.animation = 'bounce 0.6s ease-in-out';
}

// Photo navigation functions
function nextPhoto() {
    if (currentPhoto < photos.length - 1) {
        currentPhoto++;
        updatePhotoDisplay();
    }
}

function prevPhoto() {
    if (currentPhoto > 0) {
        currentPhoto--;
        updatePhotoDisplay();
    }
}

function updatePhotoDisplay() {
    const photoDisplay = document.getElementById('photo-display');
    const currentPhotoData = photos[currentPhoto];
    
    photoDisplay.innerHTML = `
        <div class="cartoon-image">
            <div class="shinchan">${currentPhotoData.characters.shinchan}</div>
            <div class="himawari">${currentPhotoData.characters.himawari}</div>
        </div>
        <div class="photo-message">
            <p class="hindi-text">${currentPhotoData.message.hindi1}</p>
            <p class="hindi-text">${currentPhotoData.message.hindi2}</p>
            <p class="hehe">${currentPhotoData.message.hehe}</p>
        </div>
    `;
    
    // Update navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.disabled = currentPhoto === 0;
    nextBtn.disabled = currentPhoto === photos.length - 1;
}

// Music player functions
function updateMusicDisplay() {
    const songTitle = document.querySelector('.now-playing h3');
    const duration = document.querySelector('.time:last-child');
    
    songTitle.textContent = songs[currentSong].title;
    duration.textContent = songs[currentSong].duration;
}

function togglePlay() {
    const playPauseBtn = document.querySelector('.play-pause');
    
    if (isPlaying) {
        playPauseBtn.textContent = '▶️';
        isPlaying = false;
        // Stop any playing animation
    } else {
        playPauseBtn.textContent = '⏸️';
        isPlaying = true;
        // Start playing animation
        animateProgress();
    }
}

function rewind() {
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    
    progressFill.style.width = '0%';
    progressHandle.style.left = '0%';
    
    // Reset time display
    document.querySelector('.time:first-child').textContent = '0:00';
}

function fastForward() {
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    
    progressFill.style.width = '100%';
    progressHandle.style.left = '100%';
    
    // Update time display
    const duration = songs[currentSong].duration;
    document.querySelector('.time:first-child').textContent = duration;
    
    // Auto advance to next song after a delay
    setTimeout(() => {
        if (currentSong < songs.length - 1) {
            currentSong++;
            updateMusicDisplay();
            rewind();
        }
    }, 1000);
}

function animateProgress() {
    if (!isPlaying) return;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    const timeDisplay = document.querySelector('.time:first-child');
    
    let progress = 0;
    const duration = 25; // 25 seconds for demo
    
    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }
        
        progress += 1;
        const percentage = (progress / duration) * 100;
        
        progressFill.style.width = percentage + '%';
        progressHandle.style.left = percentage + '%';
        
        // Update time display
        const minutes = Math.floor(progress / 60);
        const seconds = progress % 60;
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (progress >= duration) {
            clearInterval(interval);
            isPlaying = false;
            document.querySelector('.play-pause').textContent = '▶️';
            
            // Auto advance to next song
            if (currentSong < songs.length - 1) {
                currentSong++;
                updateMusicDisplay();
                rewind();
            }
        }
    }, 1000);
}

// Add bounce animation for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state
    showPage(1);
    
    // Add some interactive effects
    addInteractiveEffects();
});

function addInteractiveEffects() {
    // Add hover effects to cells
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('mouseenter', function() {
            if (this.textContent === '') {
                this.style.background = '#fce4ec';
            }
        });
        
        cell.addEventListener('mouseleave', function() {
            if (this.textContent === '') {
                this.style.background = '#fff';
            }
        });
    });
    
    // Add click effects to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Add touch support for mobile
document.addEventListener('touchstart', function(e) {
    if (e.target.classList.contains('cell') && e.target.textContent === '') {
        e.target.style.background = '#fce4ec';
    }
});

document.addEventListener('touchend', function(e) {
    if (e.target.classList.contains('cell')) {
        setTimeout(() => {
            if (e.target.textContent === '') {
                e.target.style.background = '#fff';
            }
        }, 100);
    }
});
