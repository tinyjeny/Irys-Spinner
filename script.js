const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const spinSound = document.getElementById("spinSound");
const result = document.getElementById("result");
const usernamelnput = document.getElementById("username");

const tasks = [
  "Write a thread about IRYS.",
  "Make a meme about IRYS",
  "Give shoutout to 5 IRYS community members",
  "Tag Quang 10 times in discord /X",
  "Create an art with Sprite",
  "Engage with 10 Irys community post",
  "Create a short video about IRYS.",
  "Read two docs about Irys",
  "Tag Josh and ask him WEN TGE",
  "Make Xaitoshi follow you."
];

const colors = ["#4BC0C0", "#36A2EB"];
const arc = Math.PI * 2 / tasks.length;
let startAngle = 0;

function resizeCanvas() {
  const containerWidth = canvas.parentElement.offsetWidth;
  canvas.width = containerWidth * 0.9;
  canvas.height = canvas.width;
  drawWheel();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = canvas.width / 2 - 20;

  for (let i = 0; i < tasks.length; i++) {
    const angle = startAngle + i * arc;

    // UPDATED: smaller + less bright white center
    const gradient = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, radius);
    gradient.addColorStop(0, "rgba(255,255,255,0.5)"); // smaller + less bright
    gradient.addColorStop(0.2, colors[i % colors.length]);
    gradient.addColorStop(1, "#000000");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle, angle + arc);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${Math.floor(canvas.width / 40)}px Arial`;

    const textRadius = radius * 0.55;
    const words = tasks[i].split(" ");
    let lines = [];
    let line = "";
    words.forEach(word => {
      const testLine = line + word + " ";
      if (ctx.measureText(testLine).width > textRadius) {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = testLine;
      }
    });
    lines.push(line.trim());

    const lineHeight = canvas.width / 40 + 2;
    const startY = -(lines.length - 1) * lineHeight / 2;
    lines.forEach((txt, idx) => {
      ctx.fillText(txt, textRadius, startY + idx * lineHeight);
    });

    ctx.restore();
  }

  drawArrow();
}

function drawArrow() {
  ctx.save();
  const arrowX = canvas.width / 2;
  const arrowY = 20;
  ctx.translate(arrowX, arrowY);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.lineTo(-15, 0);
  ctx.lineTo(15, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function spinWheel() {
  const spinTimeTotal = Math.random() * 3000 + 4000;
  let spinTime = 0;
  const spinAngleStart = Math.random() * 20 + 20;
  spinSound.currentTime = 0;
  spinSound.play();

  function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
      spinSound.pause();
      const normalizedAngle = startAngle % (2 * Math.PI);
      const degrees = normalizedAngle * 180 / Math.PI + 90;
      const arcDegrees = 360 / tasks.length;
      let index = Math.floor((tasks.length - (degrees % 360) / arcDegrees) % tasks.length);
      const name = usernamelnput.value.trim() || "Player";
      result.textContent = `${name}, ${tasks[index]}`;
      return;
    }

    const t = spinTime / spinTimeTotal;
    const easeOut = 1 - Math.pow(1 - t, 3);
    const spinAngle = spinAngleStart * (1 - easeOut);
    startAngle += (spinAngle * Math.PI / 180);
    drawWheel();
    requestAnimationFrame(rotateWheel);
  }

  rotateWheel();
}

spinButton.addEventListener("click", spinWheel);
