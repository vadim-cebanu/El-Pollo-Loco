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
 * @returns {void}
 */
function init() {
  canvas = document.getElementById("canvas");
  audioManager = new AudioManager();
  setupMuteButton();
  setupMobileControls();
  setupKeyboardListeners();
  handleResponsive();
}

/**
 * Sets up mute button state from localStorage
 * @returns {void}
 */
function setupMuteButton() {
  let isMuted = localStorage.getItem("isMuted") === "true";
  audioManager.isMuted = isMuted;
  updateMuteIcon(isMuted);
}

/**
 * Updates mute icon based on state
 * @param {boolean} isMuted - Whether audio is muted
 * @returns {void}
 */
function updateMuteIcon(isMuted) {
  let muteIcon = document.getElementById("muteIcon");
  if (muteIcon) {
    muteIcon.textContent = isMuted ? "🔇" : "🔊";
  }
}

/**
 * Toggles mute state and updates all sounds
 * @returns {void}
 */
function toggleMute() {
  audioManager.isMuted = !audioManager.isMuted;
  localStorage.setItem("isMuted", audioManager.isMuted);
  updateMuteIcon(audioManager.isMuted);
  handleMuteStateChange();
}

/**
 * Handles audio state change after mute toggle
 * @returns {void}
 */
function handleMuteStateChange() {
  if (audioManager.isMuted) {
    audioManager.stopAllSounds();
  } else if (gameRunning) {
    audioManager.playBackgroundMusic();
  }
}

/**
 * Starts a new game
 * @returns {void}
 */
function startGame() {
  showGameUI();
  initLevel();
  world = new World(canvas, keyboard, audioManager);
  gameRunning = true;
  if (!audioManager.isMuted) {
    audioManager.playBackgroundMusic();
  }
}

/**
 * Shows game UI elements
 * @returns {void}
 */
function showGameUI() {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("canvas").classList.remove("hidden");
  document.getElementById("game-buttons").classList.remove("hidden");
  showMobileControls();
}

/**
 * Shows mobile controls on touch devices OR small screens
 * @returns {void}
 */
function showMobileControls() {
  if (shouldShowMobileControls()) {
    let controls = document.getElementById("mobile-controls");
    if (controls) {
      controls.style.display = "flex";
      controls.classList.remove("hidden");
    }
  }
}

/**
 * Hides mobile controls
 * @returns {void}
 */
function hideMobileControls() {
  let controls = document.getElementById("mobile-controls");
  if (controls) {
    controls.style.display = "none";
    controls.classList.add("hidden");
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
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Handles responsive behavior on resize
 * @returns {void}
 */
function handleResponsive() {
  if (gameRunning) {
    shouldShowMobileControls() ? showMobileControls() : hideMobileControls();
  }
}

/**
 * Sets up mobile control buttons
 * @returns {void}
 */
function setupMobileControls() {
  setupMobileButton("leftBtn", "LEFT");
  setupMobileButton("rightBtn", "RIGHT");
  setupMobileButton("jumpBtn", "SPACE");
  setupMobileButton("throwBtn", "D");
}

/**
 * Sets up a single mobile control button with touch and mouse support
 * @param {string} buttonId - The DOM id of the control button
 * @param {string} keyProperty - The keyboard property to simulate
 * @returns {void}
 */
function setupMobileButton(buttonId, keyProperty) {
  let button = document.getElementById(buttonId);
  if (!button) return;

  const press = (e) => {
    e.preventDefault();
    keyboard[keyProperty] = true;
  };
  const release = (e) => {
    e.preventDefault();
    keyboard[keyProperty] = false;
  };

  button.addEventListener("touchstart", press, { passive: false });
  button.addEventListener("touchend", release, { passive: false });
  button.addEventListener("touchcancel", release, { passive: false });
  button.addEventListener("mousedown", press);
  button.addEventListener("mouseup", release);
  button.addEventListener("mouseleave", () => (keyboard[keyProperty] = false));
}

/**
 * Sets up keyboard event listeners
 * @returns {void}
 */
function setupKeyboardListeners() {
  window.addEventListener("keydown", (e) => handleKeyDown(e));
  window.addEventListener("keyup", (e) => handleKeyUp(e));
}

/**
 * Handles keydown events
 * @param {KeyboardEvent} e - Keyboard event
 * @returns {void}
 */
function handleKeyDown(e) {
  const keyMap = {
    39: "RIGHT",
    37: "LEFT",
    38: "UP",
    40: "DOWN",
    32: "SPACE",
    68: "D",
  };
  if (keyMap[e.keyCode]) keyboard[keyMap[e.keyCode]] = true;
}

/**
 * Handles keyup events
 * @param {KeyboardEvent} e - Keyboard event
 * @returns {void}
 */
function handleKeyUp(e) {
  const keyMap = {
    39: "RIGHT",
    37: "LEFT",
    38: "UP",
    40: "DOWN",
    32: "SPACE",
    68: "D",
  };
  if (keyMap[e.keyCode]) keyboard[keyMap[e.keyCode]] = false;
}

/**
 * Shows controls dialog
 * @returns {void}
 */
function showControls() {
  document.getElementById("controls-dialog").classList.remove("hidden");
}

/**
 * Hides controls dialog
 * @returns {void}
 */
function hideControls() {
  document.getElementById("controls-dialog").classList.add("hidden");
}

/**
 * Toggles fullscreen mode
 * @returns {void}
 */
function toggleFullscreen() {
  let container = document.getElementById("game-container");
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch((err) => {});
  } else {
    document.exitFullscreen();
  }
}

/**
 * Shows end screen with win/lose image
 * @param {boolean} won - Whether player won the game
 * @returns {void}
 */
function showEndScreen(won) {
  gameRunning = false;
  audioManager.stopAllSounds();
  setEndScreenImage(won);
  showEndScreenUI();
}

/**
 * Sets end screen image based on win/lose
 * @param {boolean} won - Whether player won
 * @returns {void}
 */
function setEndScreenImage(won) {
  let endImage = document.getElementById("end-image");
  endImage.src = won
    ? "img/You won, you lost/You Win A.png"
    : "img/You won, you lost/Game Over.png";
}

/**
 * Shows end screen UI elements
 * @returns {void}
 */
function showEndScreenUI() {
  document.getElementById("end-screen").classList.remove("hidden");
  document.getElementById("game-buttons").classList.add("hidden");
  hideMobileControls();
}

/**
 * Restarts the game
 * @returns {void}
 */
function restartGame() {
  clearAllIntervals();
  hideEndScreen();
  showGameUI();
  initLevel();
  world = new World(canvas, keyboard, audioManager);
  gameRunning = true;
  if (!audioManager.isMuted) {
    audioManager.playBackgroundMusic();
  }
}

/**
 * Hides end screen
 * @returns {void}
 */
function hideEndScreen() {
  document.getElementById("end-screen").classList.add("hidden");
}

/**
 * Clears all intervals to prevent memory leaks
 * @returns {void}
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) {
    window.clearInterval(i);
  }
}

/**
 * Returns to main menu
 * @returns {void}
 */
function backToMenu() {
  clearAllIntervals();
  gameRunning = false;
  audioManager.stopAllSounds();
  hideAllGameUI();
  document.getElementById("start-screen").classList.remove("hidden");
}

/**
 * Hides all game UI elements
 * @returns {void}
 */
function hideAllGameUI() {
  document.getElementById("end-screen").classList.add("hidden");
  document.getElementById("canvas").classList.add("hidden");
  document.getElementById("game-buttons").classList.add("hidden");
  hideMobileControls();
}

document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", handleResponsive);
window.addEventListener("orientationchange", handleResponsive);

document.addEventListener("click", (e) => {
  let dialog = document.getElementById("controls-dialog");
  let content = document.getElementById("controls-content");
  if (!dialog.classList.contains("hidden") && !content.contains(e.target)) {
    let btn = document.getElementById("controlsBtn");
    if (!btn.contains(e.target)) {
      hideControls();
    }
  }
});
