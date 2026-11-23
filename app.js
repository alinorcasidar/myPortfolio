/* Alinor Casidar portfolio v2 — page behaviour */

/* window.BASE is set in index.html (where photos, videos, resume and /api live) */
if (window.BASE == null) window.BASE = '';
const U = p => window.BASE + p;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-href]').forEach(el => el.href = U(el.dataset.href));

/* ---------------- career modes ---------------- */
const MODES = {
  sec: { word: 'SECURITY', role: 'Cyber Security Analyst', rgb: [163, 255, 18], tiles: [['shield','Defense'],['lock','Encryption'],['finger','Identity'],['term','Terminal']],
         blurb: 'Years of finding out why systems break — hardware, networks and software. Now I want to defend them.' },
  net: { word: 'NETWORK', role: 'Network Engineer', rgb: [34, 211, 238], tiles: [['net','Routing'],['server','Servers'],['wifi','Wireless'],['globe','Internet']],
         blurb: 'LAN setup and network troubleshooting at DILG Region X, plus IoT devices that sync to the cloud. I like making systems connect.' },
  web: { word: 'DEVELOPER', role: 'Web Developer', rgb: [244, 114, 208], tiles: [['code','Code'],['monitor','Frontend'],['db','Database'],['phone','Mobile']],
         blurb: 'Full-stack websites, a Flutter app for DILG Region X, and real-time dashboards for my IoT builds — shipped end to end.' }
};
const ORDER = ['sec', 'net', 'web'];
let mode = 'sec', autoTimer = null, autoOn = false; // modes change only when the visitor picks one

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFX';
function scramble(el, text, dur = 700, attr) {
  const from = el.textContent, len = Math.max(from.length, text.length), t0 = performance.now();
  if (reduceMotion) { el.textContent = text; if (attr) el.setAttribute(attr, text); return; }
  (function f(t) {
    const k = Math.min(1, (t - t0) / dur); let out = '';
    for (let i = 0; i < len; i++) {
      const reveal = i / len < k * 1.15 - 0.15;
      out += reveal ? (text[i] || '') : (i < text.length || k < .7 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : '');
    }
    el.textContent = out; if (attr) el.setAttribute(attr, out);
    if (k < 1) requestAnimationFrame(f); else { el.textContent = text; if (attr) el.setAttribute(attr, text); }
  })(t0);
}

function setMode(m, byUser) {
  if (!MODES[m]) return;
  const d = MODES[m]; mode = m;
  document.body.dataset.mode = m;
  $$('.mode').forEach(b => b.classList.toggle('on', b.dataset.m === m));
  $$('.path').forEach(p => p.classList.toggle('on', p.dataset.m === m));
  scramble($('#bigword'), d.word, 800, 'data-text');
  scramble($('#roleTxt'), d.role, 600);
  const bl = $('#blurb'); bl.style.opacity = 0; setTimeout(() => { bl.textContent = d.blurb; bl.style.opacity = 1; }, 250);
  $$('.tile').forEach((t, i) => {
    t.classList.add('flip');
    setTimeout(() => { t.querySelector('use').setAttribute('href', '#i-' + d.tiles[i][0]); t.querySelector('small').textContent = d.tiles[i][1]; t.classList.remove('flip'); }, 260 + i * 70);
  });
  colTarget = d.rgb; // canvas effects glide to the new theme colour
  if (byUser) { autoOn = false; $('#modes').classList.add('paused'); }
  // restart progress bar animation
  $$('.mode .bar').forEach(b => { b.style.animation = 'none'; b.offsetWidth; b.style.animation = ''; });
  clearTimeout(autoTimer);
  if (autoOn) autoTimer = setTimeout(() => setMode(ORDER[(ORDER.indexOf(m) + 1) % 3]), 7000);
}
$('#modes').addEventListener('click', e => { const b = e.target.closest('.mode'); if (b) setMode(b.dataset.m, true); });
$$('.path').forEach(p => p.addEventListener('click', () => { setMode(p.dataset.m, true); scrollTo({ top: 0, behavior: 'smooth' }); }));
$('#blurb').textContent = MODES.sec.blurb;

/* ---------------- hero: scan lens ---------------- */
// Face position measured from the photo (856×907) with a face-landmark model.
const FACE = { W: 856, H: 907, cx: (366.2 + 136.95 / 2) / 856, cy: (156.75 + 147.47 / 2) / 907, fw: 136.95 / 856 };
const fig = $('#figure'), faceid = $('#faceid'), hint = $('#hint');
let userScanned = false, lensActive = false, demoRaf = null, faceShown = false;

function lensAt(x, y, on) { // x,y in figure px
  const w = fig.clientWidth;
  const r = on ? Math.max(62, w * 0.15) : 0;
  fig.style.setProperty('--mx', x + 'px'); fig.style.setProperty('--my', y + 'px'); fig.style.setProperty('--r', r + 'px');
  fig.classList.toggle('scanning', on);
  const fx = FACE.cx * w, fy = FACE.cy * fig.clientHeight;
  const near = on && Math.hypot(x - fx, y - fy) < r * 0.9 + FACE.fw * w * 0.4;
  if (near !== faceShown) {
    faceShown = near; faceid.classList.toggle('on', near);
    if (near) scramble($('#faceTxt'), innerWidth < 680 ? 'ACCESS GRANTED ✓' : 'MATCH: ALINOR CASIDAR · ACCESS GRANTED', 600);
  }
}
function pointer(e) {
  const p = e.touches ? e.touches[0] : e, b = fig.getBoundingClientRect();
  return [p.clientX - b.left, p.clientY - b.top];
}
// the lens only appears while the pointer is on the body (not on the empty space around it)
function onBody(x, y) {
  if (!alphaMap) return true;
  if (y > dH * .8 || x < 0 || y < 0 || x >= alphaW || y >= dH) return false;
  for (const [dx, dy] of [[0, 0], [12, 0], [-12, 0], [0, 12], [0, -12]]) {
    const xi = Math.min(alphaW - 1, Math.max(0, (x + dx) | 0)), yi = Math.min(alphaH - 1, Math.max(0, (y + dy) | 0));
    if (alphaMap[(yi * alphaW + xi) * 4 + 3] > 60) return true;
  }
  return false;
}
function track(e) {
  const [x, y] = pointer(e), on = onBody(x, y);
  if (on) { stopDemo(); userScanned = true; hint.classList.add('gone'); }
  if (on || lensActive) lensAt(x, y, on);
  lensActive = on;
}
fig.addEventListener('pointermove', track);
fig.addEventListener('pointerdown', track);
fig.addEventListener('pointerleave', () => { lensActive = false; const s = getComputedStyle(fig); lensAt(parseFloat(s.getPropertyValue('--mx')) || 0, parseFloat(s.getPropertyValue('--my')) || 0, false); });

// idle demo: the lens sweeps across the face by itself until the visitor tries it
function stopDemo() { if (demoRaf) { cancelAnimationFrame(demoRaf); demoRaf = null; } }
function demo() {
  if (lensActive || reduceMotion) return;
  const t0 = performance.now(), D = 3200;
  stopDemo();
  (function f(t) {
    const k = (t - t0) / D, w = fig.clientWidth, h = fig.clientHeight;
    if (k >= 1 || lensActive) { if (!lensActive) lensAt(FACE.cx * w, FACE.cy * h, false); demoRaf = null; return; }
    const a = k * Math.PI * 2; // small drift that always keeps the whole face inside the lens
    lensAt(FACE.cx * w + Math.sin(a) * w * 0.02, FACE.cy * h + Math.cos(a) * h * 0.012, true);
    demoRaf = requestAnimationFrame(f);
  })(t0);
}
// Scan mode appears only while the visitor hovers / touches the photo (no automatic demo).
// To bring back the intro demo, uncomment the next line:
// setTimeout(demo, 1600);

/* pixel dissolve: the bottom of the photo breaks into real pixels that fall into the projector */
const dz = $('#dissolve'), dctx = dz.getContext('2d'), meImg = $('#meBase');
let pts = [], samples = [], cells = [], cellSize = 7, cutY = 0, cutH = 1, dW = 0, dH = 0, rsz2, alphaMap = null, alphaW = 0, alphaH = 0;
function buildDissolve() {
  const dpr = Math.min(2, devicePixelRatio || 1);
  dW = fig.clientWidth; dH = fig.clientHeight; if (!dW || !dH) return;
  dz.width = dW * dpr; dz.height = dH * dpr; dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const off = document.createElement('canvas'); off.width = Math.round(dW); off.height = Math.round(dH);
  const o = off.getContext('2d', { willReadFrequently: true }); o.drawImage(sampleImg, 0, 0, off.width, off.height);
  // the photo is cut sharply at 80%; the body below the cut exists only as pixels
  const y0 = Math.round(dH * .80), y1 = Math.round(dH * .985);
  let data;
  try {
    alphaMap = o.getImageData(0, 0, off.width, off.height).data; alphaW = off.width; alphaH = off.height;
    data = o.getImageData(0, y0, off.width, y1 - y0).data;
  } catch (e) { alphaMap = null; pts = []; cells = []; return; } // browser refused pixel access: skip the effect, keep the page working
  samples = []; cells = []; cutY = y0; cutH = y1 - y0; cellSize = innerWidth < 680 ? 5 : 7;
  for (let y = 0; y < y1 - y0; y += 3) for (let x = 0; x < off.width; x += 3) {
    const i = (y * off.width + x) * 4;
    if (data[i + 3] > 160) samples.push([x, y + y0, data[i], data[i + 1], data[i + 2]]);
  }
  // a coarse pixel grid that keeps the shape of the body below the cut
  for (let y = 0; y < y1 - y0; y += cellSize) for (let x = 0; x < off.width; x += cellSize) {
    const i = ((y + (cellSize >> 1)) * off.width + x + (cellSize >> 1)) * 4;
    if (data[i + 3] > 180) cells.push({ x, y: y + y0, c: [data[i], data[i + 1], data[i + 2]], f: (y / (y1 - y0)) });
  }
  pts = samples.length ? Array.from({ length: Math.min(innerWidth < 680 ? 230 : 460, samples.length) }, () => spawn({}, true)) : [];
}
function spawn(p, initial) {
  const a = samples[(Math.random() * samples.length) | 0], b = samples[(Math.random() * samples.length) | 0];
  const s = Math.random() < .5 ? a : (a[1] > b[1] ? a : b); // mostly even, slightly more toward the bottom
  Object.assign(p, { x: s[0], y: s[1], c: s.slice(2), vx: 0, vy: 0, size: 2.5 + Math.random() * 3, t: 0, life: 90 + Math.random() * 120 });
  p.delay = initial ? Math.random() * p.life : Math.random() * 30;
  return p;
}
function drawDissolve() {
  if (heroVisible && !document.hidden && pts.length) {
    dctx.clearRect(0, 0, dW, dH);
    const [ar, ag, ab] = col, mid = dW / 2, floor = dH * 1.02, cs = cellSize - 1.5, now = performance.now() / 1000;
    // pixel grid: solid just under the cut line, thinning out and turning theme-coloured toward the chip
    for (const c of cells) {
      if (Math.random() < .05 + c.f * .45) continue;                                  // flicker / sparser lower down
      const m = .3 + c.f * .65, glitch = Math.sin(now * 3 + c.y * .7) > .985 ? (Math.random() - .5) * 14 : 0;
      dctx.globalAlpha = .95 - c.f * .7;
      dctx.fillStyle = `rgb(${c.c[0] * (1 - m) + ar * m | 0},${c.c[1] * (1 - m) + ag * m | 0},${c.c[2] * (1 - m) + ab * m | 0})`;
      dctx.fillRect(c.x + glitch, c.y, cs, cs);
    }
    for (const p of pts) {
      if (p.delay > 0) { p.delay--; continue; }
      const k = ++p.t / p.life;
      if (k < .4) p.x += (Math.random() - .5) * .6;                 // hold the body's shape, then break off
      else { p.vy += .045; p.vx += (mid - p.x) * .0008; p.x += p.vx; p.y += p.vy; }
      if (k >= 1 || p.y > floor) { spawn(p); continue; }
      const m = Math.min(1, .2 + k * .95);                          // photo colour -> theme colour
      dctx.globalAlpha = k < .1 ? k * 10 : 1 - Math.max(0, (k - .6) / .4);
      dctx.fillStyle = `rgb(${p.c[0] * (1 - m) + ar * m | 0},${p.c[1] * (1 - m) + ag * m | 0},${p.c[2] * (1 - m) + ab * m | 0})`;
      const sz = p.size * (1 - k * .4); dctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
    }
    dctx.globalAlpha = 1;
  }
  if (!reduceMotion) requestAnimationFrame(drawDissolve);
}
// Sample pixels from an embedded copy of the photo (images/cutout-data.js) so this also works when
// index.html is opened directly from disk, where browsers block reading pixels of image files.
const sampleImg = new Image(); sampleImg.src = window.CUTOUT_DATA || meImg.src;
// Same reason for the CSS masks that shape the tint layers and scan-line to the body.
if (window.CUTOUT_DATA) {
  const u = `url("${window.CUTOUT_DATA}")`, both = `${u}, linear-gradient(to bottom,#000 80%,transparent 80.3%)`;
  $$('.tint').forEach(el => { el.style.webkitMaskImage = both; el.style.maskImage = both; });
  const cl = $('.cutline'); if (cl) { cl.style.webkitMaskImage = u; cl.style.maskImage = u; }
}
sampleImg.decode().then(() => { buildDissolve(); drawDissolve(); }).catch(() => {});
addEventListener('resize', () => { clearTimeout(rsz2); rsz2 = setTimeout(buildDissolve, 250); });

/* circuit-board floor: traces leave a chip under the hologram; packets run outward like network traffic */
(function buildBoard() {
  const W = 1600, H = 460, cx = 800, cy = 300, s = 62, rnd = (a, b) => a + Math.random() * (b - a);
  const paths = [], vias = [], pins = [];
  for (let i = 0; i < 7; i++) {
    const o = -54 + i * 18, spread = Math.abs(i - 3);
    let x = cx + s, x2 = x + 24 + spread * 16, d = (i - 3) * rnd(16, 30);           // right side
    paths.push(`M${x} ${cy + o}H${x2}L${x2 + Math.abs(d)} ${cy + o + d}H${W + 60}`); vias.push([x2 + Math.abs(d), cy + o + d]); pins.push([x, cy + o, 1]);
    x = cx - s; x2 = x - 24 - spread * 16; d = (i - 3) * rnd(16, 30);                 // left side
    paths.push(`M${x} ${cy + o}H${x2}L${x2 - Math.abs(d)} ${cy + o + d}H-60`); vias.push([x2 - Math.abs(d), cy + o + d]); pins.push([x, cy + o, 1]);
    let y = cy - s, y2 = y - 20 - spread * 12, dx = (i - 3) * rnd(24, 56);           // back
    paths.push(`M${cx + o} ${y}V${y2}L${cx + o + dx} ${y2 - Math.abs(dx)}V-60`); vias.push([cx + o + dx, y2 - Math.abs(dx)]); pins.push([cx + o, y, 0]);
    y = cy + s; y2 = y + 16 + spread * 8; dx = (i - 3) * rnd(30, 70);                // front
    paths.push(`M${cx + o} ${y}V${y2}L${cx + o + dx} ${y2 + Math.abs(dx)}V${H + 60}`); vias.push([cx + o + dx, y2 + Math.abs(dx)]); pins.push([cx + o, y, 0]);
  }
  const svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
    ${paths.map(d => `<path class="tr" d="${d}"/>`).join('')}
    ${paths.map((d, i) => i % 3 === 2 ? '' : `<path class="pk" pathLength="1000" d="${d}" style="animation-duration:${rnd(2.8, 6).toFixed(2)}s;animation-delay:-${rnd(0, 6).toFixed(2)}s${i % 5 === 0 ? ';animation-direction:reverse' : ''}"/>`).join('')}
    ${vias.map(([x, y]) => `<circle class="via" cx="${x}" cy="${y}" r="6"/>`).join('')}
    <circle class="ping" cx="${cx}" cy="${cy}" r="${s * 1.1}"/><circle class="ping p2" cx="${cx}" cy="${cy}" r="${s * 1.1}"/>
    ${pins.map(([x, y, h]) => h ? `<rect class="pin" x="${x - 6}" y="${y - 3}" width="12" height="6" rx="1"/>` : `<rect class="pin" x="${x - 3}" y="${y - 6}" width="6" height="12" rx="1"/>`).join('')}
    <rect class="chip" x="${cx - s}" y="${cy - s}" width="${s * 2}" height="${s * 2}" rx="12"/>
    <rect class="core" x="${cx - s * .52}" y="${cy - s * .52}" width="${s * 1.04}" height="${s * 1.04}" rx="7"/>
  </svg>`;
  $('#board').innerHTML = svg;
})();


/* ---------------- network background ---------------- */
const cv = $('#net'), cx = cv.getContext('2d');
let W = 0, H = 0, nodes = [], mouse = { x: -999, y: -999 }, heroVisible = true;
let col = [...MODES[mode].rgb], colTarget = MODES[mode].rgb;
function sizeNet() {
  const dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const n = Math.round(Math.min(45, W * H / 30000));
  nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .6 }));
}
let lastT = performance.now();
function drawNet() {
  const now = performance.now(), k = 1 - Math.exp(-(now - lastT) / 220); lastT = now; // time-based, works at any frame rate
  for (let i = 0; i < 3; i++) col[i] += (colTarget[i] - col[i]) * k;
  if (heroVisible && !document.hidden) {
    cx.clearRect(0, 0, W, H);
    const [r, g, b] = col.map(Math.round);
    for (const p of nodes) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 160) { p.x += (mouse.x - p.x) * .004; p.y += (mouse.y - p.y) * .004; }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const c = nodes[j], d = Math.hypot(a.x - c.x, a.y - c.y);
        if (d < 125) { cx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / 125) * .14})`; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(c.x, c.y); cx.stroke(); }
      }
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < 180) { cx.strokeStyle = `rgba(${r},${g},${b},${(1 - dm / 180) * .3})`; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(mouse.x, mouse.y); cx.stroke(); }
      cx.fillStyle = `rgba(${r},${g},${b},.45)`; cx.beginPath(); cx.arc(a.x, a.y, a.r, 0, 7); cx.fill();
    }
  }
  if (!reduceMotion) requestAnimationFrame(drawNet);
}
sizeNet(); drawNet();
let rsz; addEventListener('resize', () => { clearTimeout(rsz); rsz = setTimeout(sizeNet, 200); });
$('#top').addEventListener('pointermove', e => { const b = cv.getBoundingClientRect(); mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; });
$('#top').addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; }).observe($('#top'));

/* ---------------- tickers ---------------- */
const tk1 = ['Cyber Security', 'Network Engineering', 'Web Development', 'IoT Systems', 'AI Vision', 'Hardware'];
$('#tk1').innerHTML = (tk1.map(t => `<span>${t}</span>`).join('')).repeat(4);
const interests = ['Instructional Design','E-Learning Development','Learning Management Systems (LMS)','UI/UX Design','Digital Content Creation','Data Analytics','Web Development','Full Stack Development','Software Engineering','Information System Analysis','Embedded Systems / IoT'];
$('#interests').innerHTML = (interests.map((t, i) => `<span class="chip${i % 4 === 0 ? ' hl' : ''}">${t}</span>`).join('')).repeat(2);

/* ---------------- projects ---------------- */
const range = (p, a, b, ext) => Array.from({ length: b - a + 1 }, (_, i) => `images/${p}${a + i}.${ext}`);
const dilgNums = [...Array(48)].map((_, i) => i + 1).filter(n => ![16, 18, 37].includes(n));
const PROJECTS = [
  { cat:'web', tag:'Web Dev', cover:'images/market1.png', images:range('market',1,2,'png'), title:'Web-Based E-Commerce System for Refurbished iPhones and iPads with Real-Time Ordering',
    desc:'A responsive web-based e-commerce platform designed for selling refurbished iPhones and iPads, featuring real-time product management and seamless order processing. The system integrates a cloud database to dynamically load products, manage inventory, and store customer orders. Users can browse categorized devices, add items to a shopping cart, and place orders with flexible payment options such as full payment or downpayment. The platform also includes delivery handling based on location and provides an intuitive interface for both customers and sellers, making it a practical solution for small-scale online businesses.' },
  { cat:'web', tag:'Web App · Upcoming', cover:'images/dentist1.png', images:range('dentist',1,3,'png'), title:'Dental Clinic Web App',
    desc:'An upcoming full-stack web application designed for managing dental clinic appointments and patient records. It features a secure login, an easy-to-use appointment dashboard, and automated email reminders.' },
  { cat:'web', tag:'Flutter Mobile', cover:'images/flutter3.jpg', images:range('flutter',1,7,'jpg'), videos:['videos/flutterapp.mp4'], title:'DILG X Interactive Information System',
    desc:'Developed during my internship at DILG Region X. This user-friendly interactive information system, built with Flutter, presents the agency’s Citizen’s Charter – including Transparency, Bids Opportunities, and Job Offers – in a clean accordion layout with search and filter functionality. It streamlines access to public service information and supports internal workflow improvements.' },
  { cat:'web', tag:'Full Stack · Confidential', lock:true, images:[], title:'Financing Application (Private)',
    desc:'A comprehensive digital solution for managing financing operations. This project is private due to confidentiality agreements. The system handles secure back-end operations, financing terms calculation, and user management. If you are interested in learning more, please contact me directly.' },
  { cat:'iot', tag:'Embedded IoT', cover:'images/gas1.jpg', images:['images/gas1.jpg'], title:'IoT-Based Smart LPG Gas Leakage Detection and Automatic Shutoff System',
    desc:'An IoT-based safety system designed to detect LPG gas leaks and automatically respond to prevent hazards. The system uses a gas sensor to monitor leakage and triggers multiple safety actions when gas is detected. It automatically manipulates the LPG cylinder valve using a motor mechanism to stop the gas flow, sends real-time SMS alerts to the user, and activates an audible alarm through a piezo buzzer. This multi-layered response ensures immediate awareness and rapid prevention, making it an effective solution for household and commercial gas safety.' },
  { cat:'iot', tag:'IoT Hardware', cover:'images/water2.jpg', images:range('water',1,8,'jpg'), title:'Smart Water Irrigation',
    desc:'A system designed to help local farmers. Using soil moisture sensors, the system automatically triggers water pumps only when the soil is dry, saving water and optimizing crop growth.' },
  { cat:'iot', tag:'IoT + Web', cover:'images/flood1.png', images:['images/flood1.png'], title:'Web-Integrated Flood Monitor',
    desc:'A hardware-software integration project. Water level sensors detect rising waters in local areas and send the real-time data to a web dashboard. When levels hit critical, the website sends an alert message.' },
  { cat:'ai', tag:'AI / Machine Learning', cover:'images/durian2.png', images:range('durian',1,6,'png'), title:'Machine Learning-Based Durian Ripeness Classification Using Computer Vision',
    desc:'An AI-powered computer vision system designed to accurately classify durian ripeness into unripe, ripe, and overripe categories. The model is trained on a large dataset of durian images and utilizes advanced image processing techniques such as color, texture, and structural feature extraction. By applying a Convolutional Neural Network (CNN) combined with multiple transformation methods, the system achieves high accuracy in detecting ripeness levels, providing a reliable and automated solution for agriculture, food quality control, and post-harvest management.' },
  { cat:'ai', tag:'AI Vision', cover:'images/braille1.jpg', images:[...range('braille',1,4,'jpg'), ...range('braille',5,7,'png')], title:'AI-Based Braille Recognition and Voice-Enabled Translator System',
    desc:'An assistive technology designed to support completely blind individuals and educators by converting physical Braille into readable and audible output. The system uses a camera to capture Braille dot patterns and applies a machine learning model to recognize and translate them into text. Detected letters are intelligently combined into words, which are then displayed on-screen and played through a speaker, enabling faster, more natural communication and learning.' },
  { cat:'iot', tag:'IoT Embedded · Raspberry Pi', cover:'images/toll1.png', images:range('toll',1,11,'png'), title:'Automatic Tollgate System – Dual Lane (RFID + Cash) with Cloud Sync',
    desc:'A fully functional automated tollgate prototype integrating RFID-based express lane and manual cash lane. Built with Raspberry Pi 4B, MFRC522 RFID reader, servo motor barrier, I2C LCD screens, and status LEDs. The system verifies RFID tags against Firebase Realtime Database, deducts toll fees from user accounts, logs transactions, and provides real-time feedback. The cash lane allows toll attendants to confirm payments via web dashboard. All transactions sync with cloud, and an administrative web panel enables account management and monitoring. This project demonstrates end-to-end hardware-software integration for intelligent transportation systems.' },
  { cat:'hw', tag:'Internship · Full-Stack & Flutter', cover:'images/dilg1.jpg', images:dilgNums.map(n => `images/dilg${n}.jpg`), title:'IT Intern Experience – DILG Regional Office X',
    desc:'During my internship at DILG Region X, I gained comprehensive hands-on experience across various IT functions. I was actively involved in network troubleshooting, PC and laptop diagnostics, repair, and maintenance, as well as LAN setup and maintenance, and printer repair and troubleshooting.\n\nWhile performing these responsibilities, I also contributed to the development of a mobile application called the DILG Region X Citizen Charter — giving users easy access to citizen services, job opportunities, bidding opportunities, transparency reports, and other resources in one place.\n\nI further enhanced my skills in web development by working on website-based solutions, improving both my front-end and back-end capabilities.' },
  { cat:'hw', tag:'Hardware Tech · Electronics', cover:'images/repair1.jpg', images:range('repair',1,31,'jpg'), title:'Hardware Technician',
    desc:'I have over six years of experience as a hardware technician, specializing in diagnosing and troubleshooting a wide range of mobile devices and electronic systems. My interest in technology was influenced by my father, who was also a technician.\n\nI have extensive experience in repairing computers and laptops, performing system reformatting, hardware diagnostics, motherboard-level troubleshooting, and handling complex mobile device repairs.\n\nI also enjoy building systems that let hardware be controlled through applications, websites, or software platforms — and I am currently expanding my knowledge in artificial intelligence.' }
];
const grid = $('#pgrid');
PROJECTS.forEach(p => {
  const el = document.createElement('article');
  el.className = 'pc rv' + (p.lock ? ' lock' : ''); el.dataset.cat = p.cat;
  const n = p.images.length + (p.videos ? p.videos.length : 0);
  el.innerHTML = `<div class="glare"></div><div class="th">${p.lock ? '<svg class="i"><use href="#i-lock"/></svg>' : `<img src="${U(p.cover)}" alt="${p.title}" loading="lazy">`}${n > 1 ? `<span class="cnt">${n} media</span>` : ''}</div>
    <div class="bd"><span class="tg">${p.tag}</span><h3>${p.title}</h3><p>${p.desc}</p><span class="mo">${p.lock ? 'Ask me about it' : 'Open project'} <svg class="i"><use href="#i-arrow"/></svg></span></div>`;
  el.addEventListener('click', () => openModal(p));
  grid.appendChild(el);
});
$('#filters').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
  $$('.pc').forEach(c => c.classList.toggle('hide', b.dataset.f !== 'all' && c.dataset.cat !== b.dataset.f));
});
/* 3D tilt + glare on cards */
function tilt(sel, max) {
  $$(sel).forEach(c => {
    c.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      c.style.transform = `rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateY(-4px)`;
      c.style.setProperty('--gx', x * 100 + '%'); c.style.setProperty('--gy', y * 100 + '%');
    });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });
}
tilt('.pc', 10); tilt('.path', 8);

/* modal */
const modal = $('#modal'), mgal = $('#mgal');
function openModal(p) {
  $('#mtag').textContent = p.tag; $('#mtitle').textContent = p.title; $('#mdesc').textContent = p.desc;
  mgal.innerHTML = (p.videos || []).map(v => `<video controls playsinline preload="metadata" src="${U(v)}"></video>`).join('') + p.images.map(i => `<img src="${U(i)}" alt="" loading="lazy">`).join('');
  modal.classList.add('open'); document.body.style.overflow = 'hidden'; modal.scrollTop = 0;
}
function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; mgal.querySelectorAll('video').forEach(v => v.pause()); }
$('#mx').onclick = closeModal;
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
mgal.addEventListener('click', e => { if (e.target.tagName === 'IMG') { $('#lbimg').src = e.target.src; $('#lb').classList.add('open'); } });
$('#lb').onclick = () => $('#lb').classList.remove('open');
addEventListener('keydown', e => { if (e.key !== 'Escape') return; if ($('#lb').classList.contains('open')) $('#lb').classList.remove('open'); else closeModal(); });

/* ---------------- reveal, counters, nav, progress, cursor ---------------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
  e.target.querySelectorAll('[data-count]').forEach(el => {
    const to = +el.dataset.count, t0 = performance.now();
    (function f(t) { const k = Math.min(1, (t - t0) / 1300); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
  });
}), { threshold: .12 });
$$('.rv').forEach(el => io.observe(el));

const nav = $('#nav'), prog = $('#progress');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 30);
  prog.style.width = (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100) + '%';
}, { passive: true });
$('#burger').onclick = () => $('#mmenu').classList.add('open');
$('#mclose').onclick = () => $('#mmenu').classList.remove('open');
$$('#mmenu a').forEach(a => a.onclick = () => $('#mmenu').classList.remove('open'));

if (matchMedia('(hover:hover)').matches) {
  const cur = $('#cur'), ring = $('#curRing'); let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; document.body.classList.add('has-cursor'); cur.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; });
  (function f() { rx += (x - rx) * .18; ry += (y - ry) * .18; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(f); })();
  document.addEventListener('pointerover', e => ring.classList.toggle('big', !!e.target.closest('a,button,.pc,.path,input,textarea')));
  fig.addEventListener('pointerenter', () => { cur.style.opacity = 0; ring.style.opacity = 0; });
  fig.addEventListener('pointerleave', () => { cur.style.opacity = 1; ring.style.opacity = 1; });
}

/* ---------------- contact form -> existing /api/send ---------------- */
const toast = $('#toast');
const showToast = m => { toast.textContent = m; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 4000); };
$('#cform').addEventListener('submit', async e => {
  e.preventDefault();
  const f = new FormData(e.target), btn = e.target.querySelector('button'), label = btn.innerHTML;
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const res = await fetch(U('api/send'), { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname: f.get('fullname'), email: f.get('email'), message: f.get('message') }) });
    const out = await res.json();
    showToast(out.success ? '✓ ' + out.message : '✕ ' + out.message);
    if (out.success) e.target.reset();
  } catch { showToast('✕ Could not send. Please email me directly.'); }
  finally { btn.disabled = false; btn.innerHTML = label; }
});

/* ---------------- kept from the old site: visit counter + hidden admin entry ---------------- */
// one visit per page load → existing /api/visit (MongoDB). Skipped when testing locally.
if (/^https?:$/.test(location.protocol) && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) fetch('/api/visit', { method: 'POST' }).catch(() => {});
// click the photo 5 times quickly → admin login (same secret as before)
{
  let clicks = 0, clickTimer;
  fig.addEventListener('click', () => {
    clicks++; clearTimeout(clickTimer); clickTimer = setTimeout(() => { clicks = 0; }, 1000);
    if (clicks >= 5) { clicks = 0; location.href = 'admin_login.html'; }
  });
}
