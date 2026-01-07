/** @type {HTMLCanvasElement} */
let canvas;
/** @type {World} */
let world;
/** @type {Keyboard} */
let keyboard = new Keyboard();
/** @type {AudioManager} */
let audioManager;
/** @type {boolean} */
let gameRunning = false;

/**
 * Initializes the game on page load
 */
function init() {
    canvas = document.getElementById('canvas');
    audioManager = new AudioManager();
    setupMuteButton();
    setupMobileControls();
    setupKeyboardListeners();
    handleResponsive();
}

/**
 * Sets up mute button state from localStorage
 */
function setupMuteButton() {
    let isMuted = localStorage.getItem('isMuted') === 'true';
    audioManager.isMuted = isMuted;
    updateMuteIcon(isMuted);
}

/**
 * Updates mute icon based on state
 * @param {boolean} isMuted - Whether audio is muted
 */
function updateMuteIcon(isMuted) {
    let muteIcon = document.getElementById('muteIcon');
    if (muteIcon) {
        muteIcon.textContent = isMuted ? '🔇' : '🔊';
    }
}

/**
 * Toggles mute state and updates all sounds
 */
function toggleMute() {
    audioManager.isMuted = !audioManager.isMuted;
    localStorage.setItem('isMuted', audioManager.isMuted);
    updateMuteIcon(audioManager.isMuted);

    if (audioManager.isMuted) {
        audioManager.stopAllSounds();
    } else if (gameRunning) {
        audioManager.playBackgroundMusic();
    }
}

/**
 * Starts a new game
 */
function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('canvas').classList.remove('hidden');
    document.getElementById('game-buttons').classList.remove('hidden');
    showMobileControls();
    initLevel();
    world = new World(canvas, keyboard, audioManager);
    gameRunning = true;
    if (!audioManager.isMuted) {
        audioManager.playBackgroundMusic();
    }
}

/**
 * Shows mobile controls on touch devices OR small screens
 */
function showMobileControls() {
    if (shouldShowMobileControls()) {
        let controls = document.getElementById('mobile-controls');
        if (controls) {
            controls.style.display = 'flex';
            controls.classList.remove('hidden');
        }
    }
}

/**
 * Hides mobile controls
 */
function hideMobileControls() {
    let controls = document.getElementById('mobile-controls');
    if (controls) {
        controls.style.display = 'none';
        controls.classList.add('hidden');
    }
}

/**
 * Checks if mobile controls should be shown
 * @returns {boolean} True if device is touch or screen is small
 */
function shouldShowMobileControls() {
    return isTouchDevice() || window.innerWidth <= 768;
}

/**
 * Checks if device supports touch
 * @returns {boolean} True if device supports touch
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Handles responsive behavior on resize
 */
function handleResponsive() {
    if (gameRunning) {
        if (shouldShowMobileControls()) {
            showMobileControls();
        } else {
            hideMobileControls();
        }
    }
}

/**
 * Sets up mobile control buttons
 */
function setupMobileControls() {
    setupMobileButton('leftBtn', 'LEFT');
    setupMobileButton('rightBtn', 'RIGHT');
    setupMobileButton('jumpBtn', 'SPACE');
    setupMobileButton('throwBtn', 'D');
}

/**
 * Sets up a single mobile button with touch events
 * @param {string} buttonId - ID of the button element
 * @param {string} keyProperty - Property name in keyboard object
 */
function setupMobileButton(buttonId, keyProperty) {
    let button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard[keyProperty] = true;
        }, { passive: false });

        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            keyboard[keyProperty] = false;
        }, { passive: false });

        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            keyboard[keyProperty] = true;
        });

        button.addEventListener('mouseup', (e) => {
            e.preventDefault();
            keyboard[keyProperty] = false;
        });

        button.addEventListener('mouseleave', (e) => {
            keyboard[keyProperty] = false;
        });
    }
}

/**
 * Sets up keyboard event listeners
 */
function setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => handleKeyDown(e));
    window.addEventListener('keyup', (e) => handleKeyUp(e));
}

/**
 * Handles keydown events
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyDown(e) {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
}

/**
 * Handles keyup events
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyUp(e) {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
}

/**
 * Shows controls dialog
 */
function showControls() {
    document.getElementById('controls-dialog').classList.remove('hidden');
}

/**
 * Hides controls dialog
 */
function hideControls() {
    document.getElementById('controls-dialog').classList.add('hidden');
}

/**
 * Toggles fullscreen mode
 */
function toggleFullscreen() {
    let container = document.getElementById('game-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => { });
    } else {
        document.exitFullscreen();
    }
}

/**
 * Shows end screen with win/lose image
 * @param {boolean} won - Whether player won the game
 */
function showEndScreen(won) {
    gameRunning = false;
    audioManager.stopAllSounds();
    let endScreen = document.getElementById('end-screen');
    let endImage = document.getElementById('end-image');
    endImage.src = won
        ? 'img/You won, you lost/You Win A.png'
        : 'img/You won, you lost/Game Over.png';
    endScreen.classList.remove('hidden');
    document.getElementById('game-buttons').classList.add('hidden');
    hideMobileControls();
}

/**
 * Restarts the game
 */
function restartGame() {
    clearAllIntervals();
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('canvas').classList.remove('hidden');
    document.getElementById('game-buttons').classList.remove('hidden');
    showMobileControls();
    initLevel();
    world = new World(canvas, keyboard, audioManager);
    gameRunning = true;
    if (!audioManager.isMuted) {
        audioManager.playBackgroundMusic();
    }
}

/**
 * Clears all intervals to prevent memory leaks
 */
function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) {
        window.clearInterval(i);
    }
}

/**
 * Returns to main menu
 */
function backToMenu() {
    clearAllIntervals();
    gameRunning = false;
    audioManager.stopAllSounds();
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('canvas').classList.add('hidden');
    document.getElementById('game-buttons').classList.add('hidden');
    hideMobileControls();
    document.getElementById('start-screen').classList.remove('hidden');
}

// Event listeners
document.addEventListener('DOMContentLoaded', init);

// Responsive handler
window.addEventListener('resize', handleResponsive);
window.addEventListener('orientationchange', handleResponsive);

document.addEventListener('click', (e) => {
    let dialog = document.getElementById('controls-dialog');
    let content = document.getElementById('controls-content');
    if (!dialog.classList.contains('hidden')) {
        if (!content.contains(e.target)) {
            let btn = document.getElementById('controlsBtn');
            if (!btn.contains(e.target)) {
                hideControls();
            }
        }
    }
});