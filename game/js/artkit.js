// artkit.js — small canvas drawing helpers shared by every scene painter.
// All scenes are drawn with these primitives so the two panels of a scene
// come from the same code path and differ only where a difference says so.

const Art = (() => {
  function circle(ctx, x, y, r, fill) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function ellipse(ctx, x, y, rx, ry, fill) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function rect(ctx, x, y, w, h, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
  }

  function roundRect(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function line(ctx, x1, y1, x2, y2, color, width) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function poly(ctx, points, fill) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  // A soft cartoon cloud made of overlapping puffs.
  function cloud(ctx, x, y, scale, fill) {
    ctx.fillStyle = fill;
    const puffs = [[0, 0, 26], [24, -8, 32], [52, 0, 24], [26, 8, 30]];
    for (const [dx, dy, r] of puffs) {
      ctx.beginPath();
      ctx.arc(x + dx * scale, y + dy * scale, r * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // A five-pointed star centred at x, y.
  function star(ctx, x, y, r, fill) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? r : r * 0.45;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const px = x + Math.cos(a) * rad;
      const py = y + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  // A simple seagull / bird silhouette: two arcs meeting in the middle.
  function gull(ctx, x, y, size, color) {
    ctx.beginPath();
    ctx.arc(x - size * 0.55, y, size * 0.55, Math.PI * 1.15, Math.PI * 1.95);
    ctx.arc(x + size * 0.55, y, size * 0.55, Math.PI * 1.05, Math.PI * 1.85);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, size * 0.16);
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // A scalloped wave row along y from x1 to x2.
  function waves(ctx, x1, x2, y, amp, color, width) {
    ctx.beginPath();
    ctx.moveTo(x1, y);
    for (let x = x1; x < x2; x += amp * 2) {
      ctx.arc(x + amp, y, amp, Math.PI, 0, false);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function gradient(ctx, x0, y0, x1, y1, stops) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    for (const [at, color] of stops) g.addColorStop(at, color);
    return g;
  }

  return { circle, ellipse, rect, roundRect, line, poly, cloud, star, gull, waves, gradient };
})();

// Scene painters register themselves here; game.js plays them in order.
window.SPOT_SCENES = window.SPOT_SCENES || [];
