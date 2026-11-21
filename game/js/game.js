// game.js — the engine of Twins of Mosslight: it renders each scene's two
// panels from the scene painters, runs the clock, judges clicks on either
// panel, and draws the found markers, hint pulses and miss marks.

(() => {
  const PANEL = 560;
  const scenes = window.SPOT_SCENES;

  const leftCanvas = document.getElementById('panel-left');
  const rightCanvas = document.getElementById('panel-right');
  const leftCtx = leftCanvas.getContext('2d');
  const rightCtx = rightCanvas.getContext('2d');

  const els = {
    sceneName: document.getElementById('scene-name'),
    remaining: document.getElementById('remaining-count'),
    found: document.getElementById('found-count'),
    mistakes: document.getElementById('mistake-count'),
    score: document.getElementById('score-count'),
    timeBar: document.getElementById('time-bar'),
    timeLeft: document.getElementById('time-left'),
    hintsLeft: document.getElementById('hints-left'),
    message: document.getElementById('message'),
    overlay: document.getElementById('overlay'),
    overlayTitle: document.getElementById('overlay-title'),
    overlayText: document.getElementById('overlay-text'),
    overlayButton: document.getElementById('overlay-button'),
    hintButton: document.getElementById('hint-button'),
    pauseButton: document.getElementById('pause-button'),
    restartButton: document.getElementById('restart-button'),
  };

  // Each scene is painted twice, once per panel, into offscreen canvases:
  // the original with no differences applied, the twin with all of them.
  const paintedScenes = scenes.map((scene) => {
    const original = document.createElement('canvas');
    original.width = PANEL;
    original.height = PANEL;
    scene.draw(original.getContext('2d'), new Set());
    const twin = document.createElement('canvas');
    twin.width = PANEL;
    twin.height = PANEL;
    scene.draw(twin.getContext('2d'), new Set(scene.diffs.map((d) => d.id)));
    return { original, twin };
  });

  const state = {
    sceneIndex: 0,
    found: new Set(),
    mistakes: 0,
    score: 0,
    hintsLeft: 3,
    timeLeft: 0,
    status: 'title', // title | playing | paused | sceneClear | won | lost
    hintDiff: null,
    hintUntil: 0,
    missMarks: [],
    sparkles: [],
    lastTickSecond: -1,
  };

  let overlayAction = null;

  function scene() {
    return scenes[state.sceneIndex];
  }

  function setMessage(text, kind) {
    els.message.textContent = text;
    els.message.className = kind || '';
  }

  function updateHud() {
    const s = scene();
    els.sceneName.textContent = `Scene ${state.sceneIndex + 1} · ${s.title}`;
    els.remaining.textContent = String(s.diffs.length - state.found.size);
    els.found.textContent = String(state.found.size);
    els.mistakes.textContent = String(state.mistakes);
    els.score.textContent = String(state.score);
    els.hintsLeft.textContent = String(state.hintsLeft);
    els.hintButton.disabled = state.hintsLeft <= 0 || state.status !== 'playing';
    const total = s.timeLimit;
    const frac = Math.max(0, state.timeLeft / total);
    els.timeBar.style.width = `${frac * 100}%`;
    els.timeBar.classList.toggle('low', state.timeLeft <= 15);
    const secs = Math.max(0, Math.ceil(state.timeLeft));
    els.timeLeft.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    els.timeLeft.classList.toggle('low', state.timeLeft <= 15);
  }

  function showOverlay(title, text, buttonText, action) {
    els.overlayTitle.textContent = title;
    els.overlayText.textContent = text;
    els.overlayButton.textContent = buttonText;
    overlayAction = action;
    els.overlay.classList.remove('hidden');
  }

  function hideOverlay() {
    els.overlay.classList.add('hidden');
  }

  function startScene(index) {
    state.sceneIndex = index;
    state.found = new Set();
    state.mistakes = 0;
    state.hintsLeft = 3;
    state.timeLeft = scene().timeLimit;
    state.hintDiff = null;
    state.missMarks = [];
    state.sparkles = [];
    state.lastTickSecond = -1;
    state.status = 'playing';
    hideOverlay();
    setMessage(`Find all ${scene().diffs.length} differences in ${scene().title}. Click a difference on either picture.`);
    updateHud();
    drawPanels(performance.now());
  }

  function finishScene() {
    const bonus = Math.round(state.timeLeft) * 2;
    state.score += bonus;
    SoundKit.playSceneClear();
    if (state.sceneIndex + 1 >= scenes.length) {
      state.status = 'won';
      showOverlay(
        'You found them all!',
        `Every difference in all three scenes, with ${state.mistakes} mistake${state.mistakes === 1 ? '' : 's'} along the way. Final score: ${state.score} (including a ${bonus} point time bonus).`,
        'Play again',
        () => { state.score = 0; startScene(0); },
      );
    } else {
      state.status = 'sceneClear';
      showOverlay(
        `${scene().title} — clear!`,
        `All ${scene().diffs.length} differences found. Time bonus: ${bonus} points. Score so far: ${state.score}. The next scene hides even more.`,
        'Next scene',
        () => startScene(state.sceneIndex + 1),
      );
    }
    updateHud();
  }

  function loseScene() {
    state.status = 'lost';
    SoundKit.playTimeUp();
    showOverlay(
      'Time is up!',
      `The ${scene().title} still hides ${scene().diffs.length - state.found.size} difference${scene().diffs.length - state.found.size === 1 ? '' : 's'}. Try the scene again — the differences stay where they were.`,
      'Try again',
      () => startScene(state.sceneIndex),
    );
    updateHud();
  }

  function markFound(diff, x, y) {
    state.found.add(diff.id);
    state.score += 100;
    SoundKit.playFound();
    setMessage(`Found: ${diff.label}! ${scene().diffs.length - state.found.size} to go.`, 'good');
    for (const panel of ['left', 'right']) {
      for (let i = 0; i < 14; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 1.6;
        state.sparkles.push({
          panel, x: diff.x, y: diff.y,
          vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 0.4,
          life: 1,
        });
      }
    }
    if (state.found.size >= scene().diffs.length) finishScene();
    updateHud();
  }

  function markMiss(x, y, panel, wrap) {
    state.mistakes += 1;
    state.timeLeft = Math.max(0, state.timeLeft - 3);
    SoundKit.playMiss();
    state.missMarks.push({ x, y, panel, until: performance.now() + 650 });
    wrap.classList.remove('shake');
    void wrap.offsetWidth;
    wrap.classList.add('shake');
    setMessage('Not there — minus 3 seconds. Keep looking.', 'bad');
    updateHud();
  }

  function panelPoint(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * PANEL,
      y: ((event.clientY - rect.top) / rect.height) * PANEL,
    };
  }

  function onPanelClick(event, panel, canvas, wrap) {
    SoundKit.unlock();
    if (state.status !== 'playing') return;
    const { x, y } = panelPoint(event, canvas);
    let best = null;
    let bestDist = Infinity;
    for (const diff of scene().diffs) {
      if (state.found.has(diff.id)) continue;
      const d = Math.hypot(diff.x - x, diff.y - y);
      if (d <= diff.r + 8 && d < bestDist) {
        best = diff;
        bestDist = d;
      }
    }
    if (best) markFound(best, x, y);
    else markMiss(x, y, panel, wrap);
    drawPanels(performance.now());
  }

  function useHint() {
    if (state.status !== 'playing' || state.hintsLeft <= 0) return;
    const open = scene().diffs.filter((d) => !state.found.has(d.id));
    if (!open.length) return;
    state.hintDiff = open[Math.floor(Math.random() * open.length)];
    state.hintUntil = performance.now() + 1500;
    state.hintsLeft -= 1;
    state.timeLeft = Math.max(0, state.timeLeft - 5);
    SoundKit.playHint();
    setMessage('A hint shimmers around a difference — minus 5 seconds.');
    updateHud();
  }

  function togglePause() {
    if (state.status === 'playing') {
      state.status = 'paused';
      showOverlay('Paused', 'The clock is stopped. The pictures will wait.', 'Resume', togglePause);
    } else if (state.status === 'paused') {
      state.status = 'playing';
      hideOverlay();
    }
    updateHud();
  }

  // ---- drawing ------------------------------------------------------------

  function drawMarker(ctx, diff, now) {
    const pulse = 2.2 * Math.sin(now / 260);
    const r = diff.r * 0.78 + pulse;
    ctx.save();
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, r + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#e4572e';
    ctx.lineWidth = 4;
    ctx.stroke();
    // A small green badge with a check, top-right of the ring.
    const bx = diff.x + r * 0.72;
    const by = diff.y - r * 0.72;
    ctx.beginPath();
    ctx.arc(bx, by, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#2e7d32';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx - 5, by);
    ctx.lineTo(bx - 1.5, by + 4);
    ctx.lineTo(bx + 5.5, by - 4.5);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  function drawPanel(ctx, image, panel, now) {
    ctx.clearRect(0, 0, PANEL, PANEL);
    ctx.drawImage(image, 0, 0);
    for (const diff of scene().diffs) {
      if (state.found.has(diff.id)) drawMarker(ctx, diff, now);
    }
    if (state.hintDiff && now < state.hintUntil && !state.found.has(state.hintDiff.id)) {
      const t = 1 - (state.hintUntil - now) / 1500;
      for (let i = 0; i < 3; i++) {
        const rr = 12 + ((t * 46 + i * 15) % 46);
        ctx.beginPath();
        ctx.arc(state.hintDiff.x, state.hintDiff.y, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 190, 40, ${0.75 * (1 - rr / 60)})`;
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }
    }
    for (const mark of state.missMarks) {
      if (mark.panel !== panel) continue;
      const left = (mark.until - now) / 650;
      if (left <= 0) continue;
      ctx.save();
      ctx.globalAlpha = Math.min(1, left * 1.6);
      ctx.strokeStyle = '#d43a2a';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      const s = 11;
      ctx.beginPath();
      ctx.moveTo(mark.x - s, mark.y - s);
      ctx.lineTo(mark.x + s, mark.y + s);
      ctx.moveTo(mark.x + s, mark.y - s);
      ctx.lineTo(mark.x - s, mark.y + s);
      ctx.stroke();
      ctx.restore();
    }
    for (const p of state.sparkles) {
      if (p.panel !== panel || p.life <= 0) continue;
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = '#ffb400';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawPanels(now) {
    const painted = paintedScenes[state.sceneIndex];
    drawPanel(leftCtx, painted.original, 'left', now);
    drawPanel(rightCtx, painted.twin, 'right', now);
  }

  // ---- main loop ----------------------------------------------------------

  let lastFrame = performance.now();
  function frame(now) {
    const dt = Math.min(0.1, (now - lastFrame) / 1000);
    lastFrame = now;
    if (state.status === 'playing') {
      state.timeLeft -= dt;
      const whole = Math.ceil(state.timeLeft);
      if (state.timeLeft <= 10 && whole !== state.lastTickSecond && state.timeLeft > 0) {
        state.lastTickSecond = whole;
        SoundKit.playTick();
      }
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        loseScene();
      }
      updateHud();
    }
    for (const p of state.sparkles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.life -= dt * 1.4;
    }
    state.sparkles = state.sparkles.filter((p) => p.life > 0);
    state.missMarks = state.missMarks.filter((m) => m.until > now);
    drawPanels(now);
    requestAnimationFrame(frame);
  }

  // ---- wiring -------------------------------------------------------------

  const leftWrap = leftCanvas.closest('.panel-wrap');
  const rightWrap = rightCanvas.closest('.panel-wrap');
  leftCanvas.addEventListener('click', (e) => onPanelClick(e, 'left', leftCanvas, leftWrap));
  rightCanvas.addEventListener('click', (e) => onPanelClick(e, 'right', rightCanvas, rightWrap));
  els.hintButton.addEventListener('click', useHint);
  els.pauseButton.addEventListener('click', togglePause);
  els.restartButton.addEventListener('click', () => { if (state.status !== 'title') startScene(state.sceneIndex); });
  els.overlayButton.addEventListener('click', () => { SoundKit.unlock(); if (overlayAction) overlayAction(); });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') useHint();
    if (e.key === 'p' || e.key === 'P') togglePause();
    if (e.key === 'r' || e.key === 'R') { if (state.status !== 'title') startScene(state.sceneIndex); }
  });

  // A seeded state in the URL (?scene=2&found=flag,lamp&time=95) starts the
  // game mid-scene; the maker uses it to photograph genuine mid-game frames
  // for screenshots/, and it harms nothing in normal play.
  function applySeedFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('scene')) return false;
    const index = Math.min(scenes.length - 1, Math.max(0, Number(params.get('scene')) - 1 || 0));
    startScene(index);
    const foundIds = (params.get('found') || '').split(',').filter(Boolean);
    for (const id of foundIds) {
      if (scene().diffs.some((d) => d.id === id)) state.found.add(id);
    }
    if (params.has('time')) state.timeLeft = Math.max(1, Number(params.get('time')) || scene().timeLimit);
    if (params.has('hints')) state.hintsLeft = Math.max(0, Math.min(3, Number(params.get('hints'))));
    if (params.has('score')) state.score = Math.max(0, Number(params.get('score')) || 0);
    if (params.has('mistakes')) state.mistakes = Math.max(0, Number(params.get('mistakes')) || 0);
    if (params.get('hint') === '1') {
      const open = scene().diffs.filter((d) => !state.found.has(d.id));
      if (open.length) {
        state.hintDiff = open[0];
        state.hintUntil = performance.now() + 60000;
      }
    }
    setMessage(`Find every difference between the two pictures. ${scene().diffs.length - state.found.size} still hiding.`);
    updateHud();
    drawPanels(performance.now());
    return true;
  }

  if (!applySeedFromUrl()) {
    state.timeLeft = scene().timeLimit;
    showOverlay(
      'Twins of Mosslight',
      'Three scenes — a harbour at dawn, a clockwork garden and a lantern market at night — and every one of them has a twin with small changes hiding in it. Click a difference on either picture to mark it on both. Wrong clicks cost 3 seconds, hints cost 5. Find them all before the clock runs out!',
      'Start playing',
      () => startScene(0),
    );
    updateHud();
    drawPanels(performance.now());
  }
  requestAnimationFrame(frame);
})();
