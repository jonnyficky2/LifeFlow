import { state } from "../core/state.js";
import { getLevelData } from "../stats/stats.js";

export function initShare() {
  const input = document.getElementById("shareBgInput");
  if (!input) return;
  
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => generateShareImage(img);
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    input.value = ""; // Reset agar bisa pilih gambar yang sama lagi
  });
}

export function triggerShare() {
  document.getElementById("shareBgInput")?.click();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function generateShareImage(bgImg) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // IG Story Resolution (9:16)
  canvas.width = 1080;
  canvas.height = 1920;

  // Cover aspect ratio
  const imgRatio = bgImg.width / bgImg.height;
  const canvasRatio = canvas.width / canvas.height;
  let drawWidth = canvas.width;
  let drawHeight = canvas.height;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > canvasRatio) {
    drawWidth = canvas.height * imgRatio;
    offsetX = (canvas.width - drawWidth) / 2;
  } else {
    drawHeight = canvas.width / imgRatio;
    offsetY = (canvas.height - drawHeight) / 2;
  }

  // Draw Background Image
  ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);

  // Draw Dark Gradient Overlay for readability
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(0,0,0,0.3)");
  gradient.addColorStop(1, "rgba(0,0,0,0.9)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gather Stats
  const level = getLevelData().level;
  const streak = state.streakData.length;
  let totalTasks = 0, doneTasks = 0;
  state.appData.forEach(cat => cat.tasks.forEach(t => { totalTasks++; if (t.done) doneTasks++; }));
  const prod = totalTasks ? Math.round((doneTasks/totalTasks)*100) : 0;

  // Draw Glassmorphism Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.65)"; // Dark slate base
  roundRect(ctx, 140, 600, 800, 720, 60);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  roundRect(ctx, 140, 600, 800, 720, 60);
  ctx.stroke();

  // Typography
  ctx.textAlign = "center";
  ctx.fillStyle = "#38bdf8"; // Primary color
  ctx.font = "bold 60px Poppins, sans-serif";
  ctx.fillText("DAILY TRACKER", canvas.width/2, 720);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 130px Poppins, sans-serif";
  ctx.fillText(`Level ${level}`, canvas.width/2, 880);

  ctx.font = "60px Poppins, sans-serif";
  ctx.fillText(`🔥 Streak: ${streak} Days`, canvas.width/2, 1030);
  ctx.fillText(`⚡ Productivity: ${prod}%`, canvas.width/2, 1140);

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "italic 40px Poppins, sans-serif";
  ctx.fillText("Can you beat my record?", canvas.width/2, 1250);

  // Convert to file & Share/Download
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], "daily-tracker.jpg", { type: "image/jpeg" });
      navigator.share({ title: "My Stats", files: [file] })
        .catch(err => downloadFallback(url));
    } else {
      downloadFallback(url);
    }
  }, "image/jpeg", 0.9);
}

function downloadFallback(url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "daily-tracker-story.jpg";
  a.click();
}