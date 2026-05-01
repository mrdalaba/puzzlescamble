// =========================
// WINDOW RESIZE
// =========================
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// =========================
// FIREWORKS
// =========================
class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * (canvas.height * 0.5);
    this.speed = 5 + Math.random() * 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.exploded = false;
  }

  update() {
    this.y -= this.speed;

    if (this.y <= this.targetY && !this.exploded) {
      this.exploded = true;
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(this.x, this.y, this.color));
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speedX = (Math.random() - 0.5) * 8;
    this.speedY = (Math.random() - 0.5) * 8;
    this.life = 100;
    this.gravity = 0.04;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.life--;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(this.life / 100, 0);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function launchFireworks() {
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      fireworks.push(new Firework());
    }, i * 250);
  }
}

function animateFireworks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();

    if (fireworks[i].exploded) {
      fireworks.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animateFireworks);
}

animateFireworks();
