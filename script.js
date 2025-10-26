// Global variables
let currentPage = 1;
let currentPhoto = 0;
let isPlaying = false;
let currentSong = 0;

// Photo data for the memories section
const photos = [
    {
        image: "images/128fd157-e76c-4b48-9320-34061828d6b4.jpg",
        caption: "Our precious childhood memories 👶❤️"
    },
    {
        image: "images/3497f413-ebed-4652-a7ef-fdf5c6c8ea1d.jpg",
        caption: "Surrounded by love and hearts 💕"
    },
    {
        image: "images/4a76fe11-8d53-4c98-950e-27b63e58303d.jpg",
        caption: "Sisters forever and always 😎"
    },
    {
        image: "images/7aba7fb7-e36a-4d82-9e7f-5907ef042c96.jpg",
        caption: "Our beautiful memories together 💙"
    }
];

// Song data with audio files and cover images
const songs = [
    { 
        title: "Our Special Song 1 🎵", 
        audio: "SONGS/song1.mpeg",
        cover: "SONGS/cover1.jpg"
    },
    { 
        title: "Our Special Song 2 🎶", 
        audio: "SONGS/song2.mpeg",
        cover: "SONGS/cover2.jpg"
    },
    { 
        title: "Our Special Song 3 🎼", 
        audio: "SONGS/song3.mpeg",
        cover: "SONGS/cover3.jpg"
    },
    { 
        title: "Our Special Song 4 🎤", 
        audio: "SONGS/song4.mpeg",
        cover: "SONGS/cover4.jpg"
    }
];

// Audio player element
let audioPlayer = null;

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
        // Initialize audio player when music page is opened
        if (!audioPlayer) {
            initializeAudioPlayer();
            loadSong(currentSong);
        }
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
    const popup = document.getElementById('success-popup');
    const nextBtn = document.getElementById('next-btn-2');
    
    // Show popup
    popup.classList.remove('hidden');
    
    // Create confetti
    createConfettiExplosion();
    
    // Show next button after delay
    setTimeout(() => {
        nextBtn.classList.remove('hidden');
    }, 2000);
}

function closeSuccessPopup() {
    const popup = document.getElementById('success-popup');
    popup.classList.add('hidden');
}

function createConfettiExplosion() {
    const confettiWrapper = document.querySelector('.confetti-wrapper');
    confettiWrapper.innerHTML = ''; // Clear previous confetti
    
    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');
        
        // Random position
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        // Random size
        const size = Math.random() * 10 + 5;
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        confettiWrapper.appendChild(confetti);
    }
    
    // Clear confetti after animation
    setTimeout(() => {
        confettiWrapper.innerHTML = '';
    }, 4000);
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
        <img src="${currentPhotoData.image}" alt="Memory ${currentPhoto + 1}" class="memory-photo">
        <p class="photo-caption">${currentPhotoData.caption}</p>
    `;
    
    // Update navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtnNav = document.querySelectorAll('.nav-btn')[1];
    
    if (prevBtn) prevBtn.disabled = currentPhoto === 0;
    if (nextBtnNav) nextBtnNav.disabled = currentPhoto === photos.length - 1;
}

// Music player functions
function initializeAudioPlayer() {
    if (!audioPlayer) {
        audioPlayer = new Audio();
        
        // Event listeners for audio player
        audioPlayer.addEventListener('loadedmetadata', () => {
            updateMusicDisplay();
        });
        
        audioPlayer.addEventListener('timeupdate', () => {
            if (audioPlayer.duration) {
                const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                const progressFill = document.querySelector('.progress-fill');
                const progressHandle = document.querySelector('.progress-handle');
                const timeDisplay = document.querySelector('.time:first-child');
                
                if (progressFill) progressFill.style.width = percentage + '%';
                if (progressHandle) progressHandle.style.left = percentage + '%';
                
                // Update time display
                if (timeDisplay) {
                    const minutes = Math.floor(audioPlayer.currentTime / 60);
                    const seconds = Math.floor(audioPlayer.currentTime % 60);
                    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }
        });
        
        audioPlayer.addEventListener('ended', () => {
            // Auto play next song
            if (currentSong < songs.length - 1) {
                currentSong++;
                loadSong(currentSong);
                audioPlayer.play();
            } else {
                // Last song ended
                isPlaying = false;
                document.querySelector('.play-pause').textContent = '▶️';
            }
        });
        
        audioPlayer.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            console.error('Failed to load:', audioPlayer.src);
            alert('Error loading audio file. Please check the file exists and is accessible.');
        });
        
        audioPlayer.addEventListener('canplay', () => {
            console.log('Audio can play:', audioPlayer.src);
        });
    }
}

function loadSong(index) {
    const song = songs[index];
    console.log('Loading song:', song.title, song.audio);
    audioPlayer.src = song.audio;
    audioPlayer.load(); // Force reload
    updateMusicDisplay();
}

function updateMusicDisplay() {
    const songTitle = document.querySelector('.now-playing h3');
    const albumCover = document.querySelector('.album-art');
    const duration = document.querySelector('.time:last-child');
    
    // Update song title
    if (songTitle) {
        songTitle.textContent = songs[currentSong].title;
    }
    
    // Update album cover with photo
    if (albumCover) {
        albumCover.innerHTML = `
            <img src="${songs[currentSong].cover}" alt="Song Cover" class="song-cover-image">
        `;
    }
    
    // Update duration when loaded
    if (audioPlayer && audioPlayer.duration) {
        const minutes = Math.floor(audioPlayer.duration / 60);
        const seconds = Math.floor(audioPlayer.duration % 60);
        if (duration) {
            duration.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    } else {
        if (duration) duration.textContent = '--:--';
    }
}

function togglePlay() {
    if (!audioPlayer) {
        initializeAudioPlayer();
        loadSong(currentSong);
    }
    
    const playPauseBtn = document.querySelector('.play-pause');
    
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶️';
        isPlaying = false;
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = '⏸️';
        isPlaying = true;
    }
}

function previousSong() {
    if (!audioPlayer) {
        initializeAudioPlayer();
    }
    
    // Go to previous song
    if (currentSong > 0) {
        currentSong--;
        loadSong(currentSong);
        if (isPlaying) {
            audioPlayer.play();
        }
    } else {
        // If at first song, restart it
        audioPlayer.currentTime = 0;
    }
}

function nextSong() {
    if (!audioPlayer) {
        initializeAudioPlayer();
    }
    
    // Skip to next song
    if (currentSong < songs.length - 1) {
        currentSong++;
        loadSong(currentSong);
        if (isPlaying) {
            audioPlayer.play();
        }
    } else {
        // If at last song, go to first song
        currentSong = 0;
        loadSong(currentSong);
        if (isPlaying) {
            audioPlayer.play();
        }
    }
}

// Keep old function names for compatibility
function rewind() {
    previousSong();
}

function fastForward() {
    nextSong();
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

