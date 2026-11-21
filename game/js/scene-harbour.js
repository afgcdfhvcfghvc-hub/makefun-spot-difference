// scene-harbour.js — Scene 1: Mosslight Harbour at dawn.
// One painter draws both panels; the `changed` set names the differences the
// right-hand panel carries. Everything else is identical by construction.

(() => {
  const W = 560;
  const H = 560;

  function drawSailboat(ctx, x, y, sailColor) {
    Art.poly(ctx, [[x - 42, y], [x + 42, y], [x + 28, y + 20], [x - 28, y + 20]], '#8a5a33');
    Art.line(ctx, x, y, x, y - 62, '#5d4023', 4);
    Art.poly(ctx, [[x + 4, y - 60], [x + 4, y - 4], [x + 40, y - 4]], sailColor);
    Art.poly(ctx, [[x - 4, y - 52], [x - 4, y - 4], [x - 30, y - 4]], '#fff6e3');
  }

  function drawHouse(ctx, x, y, w, h, wall, roof, windowLit) {
    Art.rect(ctx, x, y, w, h, wall);
    Art.poly(ctx, [[x - 8, y], [x + w + 8, y], [x + w / 2, y - 34]], roof);
    Art.rect(ctx, x + w / 2 - 10, y + h - 34, 20, 34, '#5d4023');
    Art.circle(ctx, x + w / 2 + 5, y + h - 17, 2.5, '#ffd94d');
    const win = windowLit ? '#ffd94d' : '#33506b';
    Art.rect(ctx, x + 12, y + 16, 18, 20, win);
    Art.rect(ctx, x + w - 30, y + 16, 18, 20, win);
    Art.line(ctx, x + 21, y + 16, x + 21, y + 36, '#22304a', 2);
    Art.line(ctx, x + w - 21, y + 16, x + w - 21, y + 36, '#22304a', 2);
  }

  function drawHarbour(ctx, changed) {
    const has = (id) => changed.has(id);

    // Sky and sun.
    ctx.fillStyle = Art.gradient(ctx, 0, 0, 0, 340, [[0, '#ffe9bb'], [1, '#ffc98f']]);
    ctx.fillRect(0, 0, W, 340);
    Art.circle(ctx, 92, 86, 40, '#ffdf6b');
    Art.circle(ctx, 92, 86, 52, 'rgba(255, 223, 107, 0.35)');
    Art.cloud(ctx, 190, 66, 0.9, '#fff6e3');
    Art.cloud(ctx, 385, 108, 0.75, '#fff1d6');
    Art.cloud(ctx, 300, 44, 0.55, '#fff6e3');

    // Gulls — one of them is a difference.
    Art.gull(ctx, 238, 128, 17, '#44607c');
    if (!has('gull')) Art.gull(ctx, 336, 92, 15, '#44607c');
    Art.gull(ctx, 148, 158, 13, '#44607c');

    // Shore and houses.
    ctx.fillStyle = '#e8cf9e';
    ctx.fillRect(0, 306, W, 40);
    drawHouse(ctx, 36, 238, 84, 76, '#f4e3c2', '#c6502e', true);
    drawHouse(ctx, 140, 228, 92, 86, '#dcebf5', '#38618c', has('window'));
    drawHouse(ctx, 252, 244, 76, 70, '#f7d9d4', '#7a9e43', false);
    Art.rect(ctx, 62, 196, 12, 26, '#b08968');
    Art.ellipse(ctx, 68, 190, 16, 10, 'rgba(120, 120, 120, 0.55)');

    // Lighthouse on its rocks, right side.
    Art.poly(ctx, [[392, 346], [428, 292], [470, 306], [512, 292], [540, 346]], '#7d7468');
    Art.poly(ctx, [[410, 346], [446, 306], [486, 318], [520, 346]], '#948a7c');
    Art.rect(ctx, 444, 196, 44, 108, '#fff6e3');
    Art.rect(ctx, 444, 232, 44, 20, '#c6502e');
    Art.rect(ctx, 444, 268, 44, 20, '#c6502e');
    Art.rect(ctx, 438, 178, 56, 18, '#22304a');
    Art.poly(ctx, [[432, 178], [500, 178], [466, 148]], '#22304a');
    // Lamp: glowing in the original, dark in the changed panel.
    if (has('lamp')) {
      Art.rect(ctx, 452, 152, 28, 24, '#4a4a52');
    } else {
      Art.poly(ctx, [[452, 164], [372, 138], [372, 190]], 'rgba(255, 217, 77, 0.35)');
      Art.rect(ctx, 452, 152, 28, 24, '#ffd94d');
      Art.circle(ctx, 466, 164, 7, '#fff3b0');
    }
    // Flag on the lighthouse pole: missing in the changed panel.
    Art.line(ctx, 466, 148, 466, 108, '#22304a', 3);
    if (!has('flag')) Art.poly(ctx, [[466, 108], [494, 115], [466, 123]], '#e4572e');

    // Sea.
    ctx.fillStyle = Art.gradient(ctx, 0, 336, 0, H, [[0, '#57b6c9'], [1, '#2e7d9b']]);
    ctx.fillRect(0, 336, W, H - 336);
    Art.waves(ctx, 12, 548, 372, 13, 'rgba(255,255,255,0.5)', 3);
    Art.waves(ctx, 30, 530, 428, 15, 'rgba(255,255,255,0.35)', 3);
    Art.waves(ctx, 8, 552, 492, 17, 'rgba(255,255,255,0.3)', 3);

    // Boats — the sailboat's big sail changes colour.
    drawSailboat(ctx, 152, 408, has('sail') ? '#e4572e' : '#ffffff');
    Art.poly(ctx, [[268, 452], [348, 452], [332, 474], [284, 474]], '#38618c');
    Art.rect(ctx, 296, 434, 26, 18, '#f4e3c2');
    Art.circle(ctx, 309, 443, 5, '#ffd94d');

    // Buoy: missing in the changed panel.
    if (!has('buoy')) {
      Art.poly(ctx, [[376, 428], [404, 428], [398, 402], [382, 402]], '#e4572e');
      Art.rect(ctx, 382, 414, 16, 6, '#ffffff');
      Art.line(ctx, 390, 402, 390, 390, '#22304a', 3);
      Art.circle(ctx, 390, 388, 4, '#ffd94d');
    }

    // Jumping fish: missing in the changed panel.
    if (!has('fish')) {
      ctx.save();
      ctx.translate(205, 482);
      ctx.rotate(-0.5);
      Art.ellipse(ctx, 0, 0, 26, 11, '#f2a541');
      Art.poly(ctx, [[22, 0], [38, -11], [38, 11]], '#e4572e');
      Art.circle(ctx, -14, -3, 3, '#22304a');
      ctx.restore();
      Art.waves(ctx, 172, 240, 504, 8, 'rgba(255,255,255,0.65)', 3);
    }

    // A crab keeps watch on the lighthouse rocks in both panels.
    Art.circle(ctx, 424, 330, 9, '#d64541');
    Art.circle(ctx, 420, 327, 2, '#22304a');
    Art.circle(ctx, 428, 327, 2, '#22304a');
    Art.line(ctx, 414, 334, 406, 340, '#d64541', 3);
    Art.line(ctx, 434, 334, 442, 340, '#d64541', 3);
  }

  window.SPOT_SCENES.push({
    id: 'harbour',
    title: 'Mosslight Harbour',
    subtitle: 'Scene 1 of 3 · dawn over the harbour',
    timeLimit: 120,
    draw: drawHarbour,
    diffs: [
      { id: 'flag', x: 480, y: 114, r: 26, label: 'the lighthouse flag' },
      { id: 'lamp', x: 466, y: 163, r: 30, label: 'the lighthouse lamp' },
      { id: 'gull', x: 336, y: 92, r: 26, label: 'the missing gull' },
      { id: 'sail', x: 168, y: 384, r: 34, label: 'the sailboat’s red sail' },
      { id: 'window', x: 159, y: 260, r: 24, label: 'the harbour house window' },
      { id: 'buoy', x: 390, y: 414, r: 27, label: 'the harbour buoy' },
      { id: 'fish', x: 207, y: 478, r: 30, label: 'the jumping fish' },
    ],
  });
})();
