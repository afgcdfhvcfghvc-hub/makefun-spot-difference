// scene-garden.js — Scene 2: The Clockwork Garden.
// A garden kept by gears: one painter draws both panels, and the `changed`
// set names the differences the right-hand panel carries.

(() => {
  function gear(ctx, x, y, r, teeth, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    for (let i = 0; i < teeth; i++) {
      ctx.save();
      ctx.rotate((i / teeth) * Math.PI * 2);
      ctx.fillRect(-r * 0.16, -r * 1.22, r * 0.32, r * 0.42);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
    ctx.fillStyle = '#f3eede';
    ctx.fill();
    ctx.restore();
  }

  function flower(ctx, x, y, petal, center) {
    Art.line(ctx, x, y + 34, x, y + 6, '#3e7d3a', 4);
    Art.ellipse(ctx, x - 8, y + 24, 8, 4, '#57a05c');
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      Art.circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6.5, petal);
    }
    Art.circle(ctx, x, y, 5.5, center);
  }

  function tulip(ctx, x, y, color) {
    Art.line(ctx, x, y + 32, x, y + 8, '#3e7d3a', 4);
    Art.ellipse(ctx, x + 9, y + 24, 9, 4, '#57a05c');
    Art.poly(ctx, [[x - 9, y - 8], [x - 9, y + 8], [x, y + 14], [x + 9, y + 8], [x + 9, y - 8], [x + 4, y - 1], [x, y - 9], [x - 4, y - 1]], color);
  }

  function drawGarden(ctx, changed) {
    const has = (id) => changed.has(id);

    // Sky and the gear sun.
    ctx.fillStyle = Art.gradient(ctx, 0, 0, 0, 360, [[0, '#e6f6e3'], [1, '#c2ecd9']]);
    ctx.fillRect(0, 0, 560, 360);
    gear(ctx, 478, 74, 34, 10, '#f2b544');
    Art.circle(ctx, 478, 74, 20, '#ffd94d');
    Art.cloud(ctx, 150, 58, 0.7, '#ffffff');
    Art.cloud(ctx, 320, 96, 0.55, '#ffffff');

    // The great tree, left.
    Art.poly(ctx, [[86, 330], [104, 210], [118, 330]], '#7a4a26');
    Art.line(ctx, 104, 250, 66, 208, '#7a4a26', 12);
    Art.line(ctx, 106, 238, 150, 196, '#7a4a26', 10);
    Art.circle(ctx, 70, 168, 52, '#3e7d3a');
    Art.circle(ctx, 128, 138, 60, '#57a05c');
    Art.circle(ctx, 168, 182, 46, '#3e7d3a');
    Art.circle(ctx, 104, 196, 48, '#6cb56a');
    // Apples — one is missing in the changed panel.
    Art.circle(ctx, 66, 150, 9, '#d64541');
    Art.circle(ctx, 150, 120, 9, '#d64541');
    if (!has('apple')) Art.circle(ctx, 128, 178, 9, '#d64541');
    Art.circle(ctx, 178, 196, 9, '#d64541');

    // The clockwork arch with three hanging gears.
    Art.rect(ctx, 238, 128, 14, 208, '#5d4023');
    Art.rect(ctx, 402, 128, 14, 208, '#5d4023');
    Art.rect(ctx, 226, 112, 202, 16, '#5d4023');
    gear(ctx, 268, 158, 20, 8, '#b08d3c');
    gear(ctx, 327, 166, 26, 9, has('gear') ? '#9aa5ad' : '#c9713a');
    gear(ctx, 382, 156, 18, 8, '#b08d3c');
    Art.line(ctx, 268, 128, 268, 138, '#22304a', 3);
    Art.line(ctx, 327, 128, 327, 140, '#22304a', 3);
    Art.line(ctx, 382, 128, 382, 138, '#22304a', 3);

    // Birdhouse on a pole, with a tenant in the original panel only.
    Art.rect(ctx, 470, 236, 8, 100, '#5d4023');
    Art.rect(ctx, 446, 182, 56, 58, '#c6502e');
    Art.poly(ctx, [[440, 182], [508, 182], [474, 152]], '#7a3b20');
    Art.circle(ctx, 474, 208, 13, '#22304a');
    if (!has('bird')) {
      Art.circle(ctx, 474, 210, 9, '#57b6c9');
      Art.poly(ctx, [[481, 208], [490, 211], [481, 214]], '#f2a541');
      Art.circle(ctx, 471, 207, 2, '#ffffff');
    }

    // Fence across the middle.
    Art.rect(ctx, 0, 330, 560, 10, '#a9805a');
    Art.rect(ctx, 0, 356, 560, 10, '#a9805a');
    for (let x = 14; x < 560; x += 42) {
      Art.poly(ctx, [[x, 322], [x + 18, 322], [x + 18, 372], [x, 372], [x + 9, 312]], '#c49a6c');
    }

    // Grass and a stepping-stone path.
    ctx.fillStyle = Art.gradient(ctx, 0, 366, 0, 560, [[0, '#8fce7e'], [1, '#57a05c']]);
    ctx.fillRect(0, 366, 560, 194);
    Art.ellipse(ctx, 300, 520, 34, 10, '#cfc4a5');
    Art.ellipse(ctx, 318, 478, 28, 9, '#cfc4a5');
    Art.ellipse(ctx, 292, 440, 23, 8, '#cfc4a5');
    Art.ellipse(ctx, 322, 404, 18, 7, '#cfc4a5');

    // Flower beds along the bottom.
    flower(ctx, 44, 452, '#e86a92', '#ffd94d');
    flower(ctx, 96, 486, '#f2f0eb', '#f2a541');
    flower(ctx, 160, 458, '#e86a92', '#ffd94d');
    flower(ctx, 420, 470, '#b388e6', '#ffd94d');
    flower(ctx, 486, 448, '#e86a92', '#ffd94d');
    tulip(ctx, 226, 492, '#d64541');
    tulip(ctx, 356, 500, has('flower') ? '#ffd94d' : '#d64541');
    tulip(ctx, 520, 500, '#f2a541');

    // Butterfly: only in the original panel.
    if (!has('butterfly')) {
      Art.ellipse(ctx, 331, 254, 14, 9, '#b388e6');
      Art.ellipse(ctx, 359, 254, 14, 9, '#b388e6');
      Art.ellipse(ctx, 335, 268, 10, 7, '#c3a6ee');
      Art.ellipse(ctx, 355, 268, 10, 7, '#c3a6ee');
      Art.ellipse(ctx, 345, 262, 5, 13, '#5d4023');
      Art.circle(ctx, 345, 248, 4.5, '#5d4023');
      Art.line(ctx, 342, 244, 334, 234, '#5d4023', 2);
      Art.line(ctx, 348, 244, 356, 234, '#5d4023', 2);
      Art.circle(ctx, 331, 252, 3, '#e86a92');
      Art.circle(ctx, 359, 252, 3, '#e86a92');
    }

    // The snail, whose shell changes colour.
    Art.ellipse(ctx, 92, 522, 30, 10, '#7a9e43');
    Art.circle(ctx, 84, 502, 21, has('snail') ? '#f2a541' : '#8e6bc8');
    Art.circle(ctx, 84, 502, 13, has('snail') ? '#ffd9a0' : '#c3a6ee');
    Art.circle(ctx, 84, 502, 6, has('snail') ? '#f2a541' : '#8e6bc8');
    Art.ellipse(ctx, 112, 510, 14, 8, '#b9d97a');
    Art.line(ctx, 120, 502, 126, 488, '#b9d97a', 3);
    Art.line(ctx, 114, 500, 114, 486, '#b9d97a', 3);
    Art.circle(ctx, 126, 487, 3, '#22304a');
    Art.circle(ctx, 114, 485, 3, '#22304a');

    // Watering can: only in the original panel.
    if (!has('can')) {
      Art.poly(ctx, [[440, 428], [492, 428], [486, 468], [446, 468]], '#7fb3c8');
      Art.line(ctx, 492, 436, 512, 424, '#7fb3c8', 7);
      Art.circle(ctx, 514, 423, 6, '#5d8aa0');
      ctx.beginPath();
      ctx.arc(466, 424, 16, Math.PI, 0);
      ctx.strokeStyle = '#5d8aa0';
      ctx.lineWidth = 5;
      ctx.stroke();
    }

    // Mushrooms by the fence — the changed panel grows one extra.
    Art.rect(ctx, 186, 372, 7, 14, '#f4e3c2');
    Art.poly(ctx, [[176, 374], [204, 374], [190, 358]], '#d64541');
    if (has('mushroom')) {
      Art.rect(ctx, 505, 380, 6, 12, '#f4e3c2');
      Art.poly(ctx, [[496, 382], [522, 382], [509, 368]], '#d64541');
      Art.circle(ctx, 505, 374, 2.4, '#ffffff');
      Art.circle(ctx, 514, 377, 2, '#ffffff');
    }
  }

  window.SPOT_SCENES.push({
    id: 'garden',
    title: 'The Clockwork Garden',
    subtitle: 'Scene 2 of 3 · the garden the gears keep',
    timeLimit: 130,
    draw: drawGarden,
    diffs: [
      { id: 'apple', x: 128, y: 178, r: 24, label: 'the missing apple' },
      { id: 'gear', x: 327, y: 166, r: 34, label: 'the silver gear' },
      { id: 'bird', x: 474, y: 209, r: 26, label: 'the birdhouse tenant' },
      { id: 'butterfly', x: 345, y: 256, r: 30, label: 'the butterfly' },
      { id: 'can', x: 470, y: 444, r: 34, label: 'the watering can' },
      { id: 'snail', x: 84, y: 502, r: 30, label: 'the snail’s shell' },
      { id: 'flower', x: 356, y: 496, r: 26, label: 'the yellow tulip' },
      { id: 'mushroom', x: 509, y: 378, r: 24, label: 'the extra mushroom' },
    ],
  });
})();
