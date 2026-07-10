function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

export function downloadFallback(url: string) {
  const a = document.createElement("a");
  a.href = url; // Set the URL of the generated image
  a.download = "lifeflow-stats.jpg"; // Set the filename for download
  document.body.appendChild(a);
  a.click(); // Programmatically click the anchor to trigger download
  document.body.removeChild(a);
}

export function generateShareImage(
  bgImg: HTMLImageElement,
  stats: { level: number; streak: number; prod: number }
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get 2D context");
      }

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
      ctx.filter = "grayscale(50%) blur(4px)";
      ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);
      ctx.filter = "none";

      // Draw Dark Gradient Overlay for readability
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(0,0,0,0.3)");
      gradient.addColorStop(1, "rgba(0,0,0,0.9)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      ctx.fillText("LIFEFLOW", canvas.width / 2, 720);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 130px Poppins, sans-serif";
      ctx.fillText(`Level ${stats.level}`, canvas.width / 2, 880);

      ctx.font = "60px Poppins, sans-serif";
      ctx.fillText(`🔥 Streak: ${stats.streak} Days`, canvas.width / 2, 1030);
      ctx.fillText(`⚡ Productivity: ${stats.prod}%`, canvas.width / 2, 1140);

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "italic 40px Poppins, sans-serif";
      ctx.fillText("Can you beat my record?", canvas.width / 2, 1250);

      // Convert to file & Share/Download
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not create blob"));
            return;
          }
          const url = URL.createObjectURL(blob);
          const file = new File([blob], "lifeflow-stats.jpg", { type: "image/jpeg" });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({ title: "My LifeFlow Stats", files: [file] })
              .then(() => resolve())
              .catch((err) => {
                console.warn("Share failed, falling back to download", err);
                downloadFallback(url);
                resolve();
              });
          } else {
            downloadFallback(url);
            resolve();
          }
        },
        "image/jpeg",
        0.9
      );
    } catch (err) {
      reject(err);
    }
  });
}
