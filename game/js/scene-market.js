// scene-market.js — Scene 3: The Lantern Night Market.
// The hardest set: ten differences under the lanterns. One painter draws
// both panels; the `changed` set names what the right-hand panel carries.

(() => {
  function drawStall(ctx, x, w, awningA, awningB) {
    Art.rect(ctx, x + 6, 262, 9, 208, '#4a3220');
    Art.rect(ctx, x + w - 15, 262, 9, 208, '#4a3220');
    // Striped awning: a sloped band, stripes clipped inside it.
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x - 8, 268);
    ctx.lineTo(x + w + 8, 268);
    ctx.lineTo(x + w - 4, 230);
    ctx.lineTo(x + 4, 230);
    ctx.closePath();
    ctx.clip();
    const stripes = 6;
    for (let i = 0; i < stripes; i++) {
      const sx = x - 8 + (i * (w + 16)) / stripes;
      Art.rect(ctx, sx, 226, (w + 16) / stripes, 46, i % 2 ? awningA : awningB);
    }
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(x - 8, 268);
    ctx.lineTo(x + w + 8, 268);
    ctx.lineTo(x + w - 4, 230);
    ctx.lineTo(x + 4, 230);
    ctx.closePath();
    ctx.strokeStyle = '#33241a';
    ctx.lineWidth = 3;
    ctx.stroke();
    Art.rect(ctx, x - 8, 264, w + 16, 7, '#33241a');
    // Counter.
    Art.rect(ctx, x, 418, w, 14, '#6b4a2c');
    Art.rect(ctx, x + 4, 432, w - 8, 38, '#54381f');
  }

  function lantern(ctx, x, y, color) {
    Art.line(ctx, x, y - 16, x, y - 8, '#0e1526', 2);
    Art.ellipse(ctx, x, y + 6, 13, 16, color);
    Art.ellipse(ctx, x, y + 6, 20, 22, 'rgba(255, 200, 90, 0.18)');
    Art.rect(ctx, x - 6, y - 12, 12, 5, '#0e1526');
    Art.rect(ctx, x - 6, y + 22, 12, 5, '#0e1526');
  }

  function drawMarket(ctx, changed) {
    const has = (id) => changed.has(id);

    // Night sky, stars and the moon — a crescent in the original panel.
    ctx.fillStyle = Art.gradient(ctx, 0, 0, 0, 560, [[0, '#1d2650'], [0.6, '#37477e'], [1, '#4a5a94']]);
    ctx.fillRect(0, 0, 560, 560);
    const stars = [[150, 52], [228, 96], [318, 44], [392, 118], [505, 150], [262, 150], [36, 170], [120, 128], [480, 30]];
    for (const [sx, sy] of stars) Art.circle(ctx, sx, sy, 2.2, '#ffeeb8');
    if (!has('star')) Art.star(ctx, 452, 58, 14, '#ffd94d');
    Art.circle(ctx, 82, 78, 30, '#f7ead0');
    if (!has('moon')) {
      Art.circle(ctx, 97, 68, 26, '#232f5c');
    }

    // Rooftop silhouettes behind the stalls.
    ctx.fillStyle = '#141c38';
    ctx.fillRect(0, 196, 560, 46);
    Art.poly(ctx, [[10, 196], [70, 164], [130, 196]], '#141c38');
    Art.poly(ctx, [[210, 196], [285, 158], [360, 196]], '#141c38');
    Art.poly(ctx, [[420, 196], [485, 168], [550, 196]], '#141c38');
    Art.rect(ctx, 316, 168, 12, 24, '#141c38');

    // The lantern wire and its lanterns — one changes colour.
    ctx.beginPath();
    ctx.moveTo(8, 104);
    ctx.quadraticCurveTo(280, 148, 552, 96);
    ctx.strokeStyle = '#0e1526';
    ctx.lineWidth = 3;
    ctx.stroke();
    const lanternSpots = [[58, 116], [138, 126], [220, 131], [302, 130], [384, 122], [462, 110], [524, 100]];
    const lanternColors = ['#e4572e', '#f2a541', '#e86a92', '#f2a541', '#e4572e', '#e86a92', '#f2a541'];
    lanternSpots.forEach(([lx, ly], i) => {
      const color = i === 3 && has('lantern') ? '#3ec6b8' : lanternColors[i];
      lantern(ctx, lx, ly + 14, color);
    });

    // Ground.
    ctx.fillStyle = '#2c3350';
    ctx.fillRect(0, 470, 560, 90);
    Art.ellipse(ctx, 90, 512, 42, 8, '#3a4266');
    Art.ellipse(ctx, 300, 532, 52, 9, '#3a4266');
    Art.ellipse(ctx, 480, 506, 38, 8, '#3a4266');

    // Three stalls.
    drawStall(ctx, 24, 160, '#c6502e', '#f4e3c2');
    drawStall(ctx, 200, 160, '#38618c', '#f4e3c2');
    drawStall(ctx, 376, 160, '#7a9e43', '#f4e3c2');

    // Stall A goods: a melon pile — one melon is missing in the changed panel.
    const melons = [[70, 402], [106, 398], [142, 404], [88, 382]];
    if (!has('melon')) melons.push([124, 384]);
    for (const [mx, my] of melons) {
      Art.ellipse(ctx, mx, my, 17, 13, '#7a9e43');
      Art.line(ctx, mx - 6, my - 11, mx - 4, my + 11, '#5c7a30', 2);
      Art.line(ctx, mx + 5, my - 11, mx + 4, my + 11, '#5c7a30', 2);
    }
    Art.circle(ctx, 52, 388, 10, '#f2a541');
    Art.circle(ctx, 160, 384, 9, '#f2a541');

    // Stall B goods: teapot with steam, cups, and a jar that changes colour.
    Art.ellipse(ctx, 262, 404, 26, 15, '#b388e6');
    Art.circle(ctx, 262, 390, 7, '#8e6bc8');
    Art.poly(ctx, [[238, 400], [224, 392], [238, 410]], '#8e6bc8');
    Art.line(ctx, 284, 396, 296, 388, '#8e6bc8', 5);
    if (!has('steam')) {
      ctx.strokeStyle = 'rgba(240, 244, 255, 0.85)';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      for (const dx of [-8, 4, 15]) {
        ctx.beginPath();
        ctx.moveTo(258 + dx, 372);
        ctx.bezierCurveTo(250 + dx, 356, 268 + dx, 348, 258 + dx, 332);
        ctx.stroke();
      }
    }
    Art.rect(ctx, 300, 402, 14, 12, '#f4e3c2');
    Art.rect(ctx, 318, 402, 14, 12, '#e86a92');
    Art.roundRect(ctx, 330, 384, 22, 32, 7, has('jar') ? '#3a9e8a' : '#d98a3a');
    Art.rect(ctx, 334, 378, 14, 7, '#8a5a33');

    // The stall cat, a ginger cat asleep on stall B's roof in the original.
    if (!has('cat')) {
      ctx.beginPath();
      ctx.moveTo(258, 218);
      ctx.quadraticCurveTo(236, 212, 240, 192);
      ctx.strokeStyle = '#c9713a';
      ctx.lineWidth = 6;
      ctx.stroke();
      Art.ellipse(ctx, 282, 218, 27, 12, '#e8933a');
      Art.line(ctx, 268, 210, 264, 224, '#c9713a', 3);
      Art.line(ctx, 282, 208, 280, 222, '#c9713a', 3);
      Art.circle(ctx, 305, 209, 12, '#e8933a');
      Art.poly(ctx, [[296, 201], [297, 188], [305, 198]], '#e8933a');
      Art.poly(ctx, [[309, 198], [315, 187], [316, 201]], '#e8933a');
      Art.poly(ctx, [[298, 199], [299, 193], [303, 198]], '#e86a92');
      Art.poly(ctx, [[311, 197], [314, 192], [314, 199]], '#e86a92');
      ctx.beginPath();
      ctx.arc(301, 210, 3.4, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = '#7a4a26';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(311, 210, 3.4, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }

    // Stall C goods: a pinwheel on the counter and hanging kites.
    if (!has('pinwheel')) {
      Art.line(ctx, 455, 418, 455, 344, '#8a5a33', 4);
      const petals = ['#e4572e', '#ffd94d', '#57b6c9', '#e86a92'];
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(455, 330);
        ctx.rotate((i * Math.PI) / 2 + 0.4);
        Art.poly(ctx, [[0, 0], [21, -8], [25, 5]], petals[i]);
        ctx.restore();
      }
      Art.circle(ctx, 455, 330, 4.5, '#22304a');
    }
    // Pots rest on stall C's counter in both panels.
    Art.roundRect(ctx, 486, 392, 20, 26, 6, '#c6502e');
    Art.roundRect(ctx, 512, 398, 16, 20, 5, '#38618c');
    Art.poly(ctx, [[404, 300], [424, 322], [404, 344], [384, 322]], '#e4572e');
    Art.line(ctx, 404, 344, 398, 366, '#e4572e', 2);
    Art.poly(ctx, [[512, 306], [528, 324], [512, 342], [496, 324]], '#57b6c9');

    // Flag garland under stall C's awning — one flag changes colour.
    Art.line(ctx, 384, 276, 528, 276, '#0e1526', 2);
    const flagColors = ['#e4572e', '#ffd94d', '#e86a92', '#57b6c9', '#f2a541', '#e4572e', '#ffd94d'];
    flagColors.forEach((c, i) => {
      const fx = 394 + i * 20;
      const color = i === 2 && has('flag') ? '#3a6ad8' : c;
      Art.poly(ctx, [[fx, 276], [fx + 14, 276], [fx + 7, 292]], color);
    });

    // Fireflies over the ground, only in the original panel.
    if (!has('firefly')) {
      const flies = [[52, 492], [84, 508], [66, 528], [104, 494], [40, 516]];
      for (const [fx, fy] of flies) {
        Art.circle(ctx, fx, fy, 5, 'rgba(255, 233, 168, 0.35)');
        Art.circle(ctx, fx, fy, 2.2, '#ffe9a8');
      }
    }
  }

  window.SPOT_SCENES.push({
    id: 'market',
    title: 'The Lantern Night Market',
    subtitle: 'Scene 3 of 3 · ten changes under the lanterns',
    timeLimit: 150,
    draw: drawMarket,
    diffs: [
      { id: 'moon', x: 82, y: 78, r: 34, label: 'the full moon' },
      { id: 'star', x: 452, y: 58, r: 24, label: 'the missing star' },
      { id: 'lantern', x: 302, y: 144, r: 27, label: 'the teal lantern' },
      { id: 'cat', x: 288, y: 208, r: 32, label: 'the sleeping cat' },
      { id: 'steam', x: 262, y: 350, r: 28, label: 'the teapot’s steam' },
      { id: 'flag', x: 441, y: 284, r: 21, label: 'the blue flag' },
      { id: 'pinwheel', x: 455, y: 330, r: 30, label: 'the pinwheel' },
      { id: 'melon', x: 124, y: 386, r: 26, label: 'the missing melon' },
      { id: 'jar', x: 341, y: 400, r: 25, label: 'the green jar' },
      { id: 'firefly', x: 72, y: 506, r: 32, label: 'the fireflies' },
    ],
  });
})();
