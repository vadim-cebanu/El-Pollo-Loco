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
/** @type {boolean} */
let assetsLoaded = false;

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
  preloadAssets();
}

/**
 * Gets all image paths used in the game
 * @returns {string[]} Array of image paths
 */
function getAllImagePaths() {
  return [
    // Character
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
    "img/2_character_pepe/scarry/1.png",
    "img/2_character_pepe/scarry/2.png",
    "img/2_character_pepe/scarry/3.png",
    "img/2_character_pepe/scarry/4.png",
    "img/2_character_pepe/scarry/5.png",
    "img/2_character_pepe/scarry/6.png",
    "img/2_character_pepe/scarry/7.png",
    // Chicken
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    "img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
    // Small Chicken
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    "img/3_enemies_chicken/chicken_small/2_dead/dead.png",
    // Endboss
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
    // Backgrounds
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/1.png",
    "img/5_background/layers/3_third_layer/2.png",
    "img/5_background/layers/2_second_layer/1.png",
    "img/5_background/layers/2_second_layer/2.png",
    "img/5_background/layers/1_first_layer/1.png",
    "img/5_background/layers/1_first_layer/2.png",
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
    // Bottles
    "img/6_salsa_bottle/salsa_bottle.png",
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    // Status bars
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
    // Coins
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png",
    // Intro/Outro screens
    "img/9_intro_outro_screens/start/startscreen_1.png",
    "img/9_intro_outro_screens/start/startscreen_2.png",
    "img/You won, you lost/You Win A.png",
    "img/You won, you lost/Game Over.png",
  ];
}

/**
 * Preloads all game assets
 * @returns {Promise<void>}
 */
async function preloadAssets() {
  const imagePaths = getAllImagePaths();
  const loadingText = document.getElementById("loading-text");
  let loadedCount = 0;
  const totalAssets = imagePaths.length;

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(img); // Continue even if image fails
      img.src = src;
    });
  };

  for (const path of imagePaths) {
    await loadImage(path);
    loadedCount++;
    const progress = Math.round((loadedCount / totalAssets) * 100);
    loadingText.textContent = `Loading assets... ${progress}%`;
  }

  assetsLoaded = true;
  showStartButtons();
}

/**
 * Shows start buttons after assets are loaded
 * @returns {void}
 */
function showStartButtons() {
  document.getElementById("loading-indicator").classList.add("hidden");
  document.getElementById("start-buttons").classList.remove("hidden");
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
