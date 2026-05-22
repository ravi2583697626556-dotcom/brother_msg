/* ── STARFIELD CANVAS ──────────────────────────── */
const canvas = document.getElementById('starCanvas');
const ctx    = canvas.getContext('2d');
let W, H, stars = [], fireflies = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initStars(); });

function rand(a, b) { return a + Math.random() * (b - a); }

function initStars() {
  stars = Array.from({ length: 220 }, () => ({
    x: rand(0, W), y: rand(0, H),
    r: rand(0.3, 1.8),
    a: rand(0.2, 1),
    speed: rand(0.0002, 0.001),
    phase: rand(0, Math.PI * 2)
  }));
  fireflies = Array.from({ length: 28 }, () => ({
    x: rand(0, W), y: rand(0, H),
    r: rand(1.5, 3.5),
    vx: rand(-0.4, 0.4), vy: rand(-0.3, 0.3),
    phase: rand(0, Math.PI * 2),
    hue: rand(10, 30)
  }));
}
initStars();

function drawStars(t) {
  ctx.clearRect(0, 0, W, H);

  /* twinkling stars */
  stars.forEach(s => {
    const a = s.a * (0.5 + 0.5 * Math.sin(t * s.speed * 1000 + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,230,200,${a})`;
    ctx.fill();
  });

  /* drifting fireflies */
  fireflies.forEach(f => {
    f.x += f.vx; f.y += f.vy;
    if (f.x < 0) f.x = W; if (f.x > W) f.x = 0;
    if (f.y < 0) f.y = H; if (f.y > H) f.y = 0;
    const glow = 0.3 + 0.7 * Math.sin(t * 0.001 + f.phase);
    const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 8);
    g.addColorStop(0, `hsla(${f.hue}, 90%, 80%, ${glow})`);
    g.addColorStop(1, `hsla(${f.hue}, 90%, 80%, 0)`);
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r * 8, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${f.hue + 20}, 100%, 90%, ${glow})`;
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}
requestAnimationFrame(drawStars);

/* ── CUSTOM CURSOR ──────────────────────────────── */
const cursor      = document.getElementById('cursor');
const sparkColors = ['#c94d6e','#c9973a','#f2a1b5','#fff0f3','#e8637a'];

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';

  if (Math.random() > 0.65) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left       = e.clientX + 'px';
    s.style.top        = e.clientY + 'px';
    s.style.background = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    s.style.setProperty('--tx', rand(-30, 30) + 'px');
    s.style.setProperty('--ty', rand(-30, 30) + 'px');
    s.style.width = s.style.height = rand(3, 7) + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }
});

/* ── ENVELOPE OPEN ──────────────────────────────── */
function openLetter() {
  const env    = document.getElementById('envelope');
  const letter = document.getElementById('letter');
  const hint   = document.getElementById('hint');

  if (letter.classList.contains('revealed')) return;

  env.classList.add('open');
  hint.style.opacity = '0';

  setTimeout(() => {
    letter.classList.add('revealed');
    env.style.animation    = 'none';
    env.style.opacity      = '0.4';
    env.style.transform    = 'scale(0.85) translateY(-10px)';
    env.style.transition   = 'all 0.8s ease';
    env.style.pointerEvents = 'none';
    hint.style.display     = 'none';
  }, 700);
}
