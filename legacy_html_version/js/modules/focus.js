import { state } from "../core/state.js";
import { saveToLocal } from "../core/storage.js";
import { addXP } from "../stats/stats.js";
import { celebrate, showToast } from "../core/utils.js";
import { refreshUI } from "../main.js";

let focusInterval = null;
let totalSeconds = 25 * 60;
let secondsLeft = 25 * 60;
let isRunning = false;
const RING_CIRCUMFERENCE = 565.48; // 2 * PI * r (r=90)

export function initFocusTimer() {
  const startBtn = document.getElementById("focusStartBtn");
  const pauseBtn = document.getElementById("focusPauseBtn");
  const resetBtn = document.getElementById("focusResetBtn");
  const durationBtns = document.querySelectorAll(".focus-duration-btn");

  startBtn?.addEventListener("click", startTimer);
  pauseBtn?.addEventListener("click", pauseTimer);
  resetBtn?.addEventListener("click", resetTimer);

  durationBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const mins = parseInt(btn.dataset.minutes, 10);
      setDuration(mins);
      
      // Update visual active state for duration buttons
      durationBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  updateUI();
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  document.getElementById("focusStartBtn").style.display = "none";
  document.getElementById("focusPauseBtn").style.display = "block";

  focusInterval = setInterval(() => {
    secondsLeft--;
    updateUI();

    if (secondsLeft <= 0) {
      completeSession();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(focusInterval);

  document.getElementById("focusStartBtn").style.display = "block";
  document.getElementById("focusPauseBtn").style.display = "none";
}

function resetTimer() {
  pauseTimer();
  secondsLeft = totalSeconds;
  updateUI();
}

function setDuration(minutes) {
  pauseTimer();
  totalSeconds = minutes * 60;
  secondsLeft = totalSeconds;
  updateUI();
}

function updateUI() {
  const display = document.getElementById("focusTimeDisplay");
  const ring = document.getElementById("focusProgressRing");

  if (!display) return;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  if (ring) {
    const ratio = secondsLeft / totalSeconds;
    const offset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * ratio);
    ring.style.strokeDashoffset = offset;
  }
}

function completeSession() {
  pauseTimer();
  
  // Award gamified rewards
  addXP(5);
  celebrate();
  showToast("Focus session complete! +5 XP earned.", "success");

  // Reset timer
  secondsLeft = totalSeconds;
  updateUI();

  // Save changes & update UI
  saveToLocal();
  refreshUI();
}
