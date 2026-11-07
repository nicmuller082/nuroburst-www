/* WEB-NURO-01 (2026-11-06) - the live Nuro on nuroburst.com.
   Nic: "a live version following the mouse or movement on the website where
   Nuro is featured". The same orb as in the app (neurons firing in the logo's
   colours, round white eyes): the eyes follow the mouse; on phones they follow
   the page as it scrolls and glance around; hover (or tap) makes Nuro smile and
   perk up; now and then a small "can I help?" hop. Calm (no firing or hop)
   when the visitor's device asks for reduced motion.
   Usage: <canvas class="nuro-orb" data-size="320" aria-hidden="true"></canvas> */
(function () {
  "use strict";
  var CYAN = [47, 211, 255], VIOLET = [123, 92, 255], MAGENTA = [255, 79, 216];
  function mix(a, b, t) { return a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(","); }
  function hue(x) { return x < 0 ? mix(CYAN, VIOLET, Math.max(0, x + 1)) : mix(VIOLET, MAGENTA, Math.min(1, x)); }

  // one fixed network - Nuro always looks like Nuro
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  var nodes = [];
  for (var i = 0; i < 64; i++) {
    var u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, r = 0.35 + 0.55 * Math.cbrt(rnd()), s = Math.sqrt(1 - u * u);
    nodes.push({ x: r * s * Math.cos(th), y: r * u, z: r * s * Math.sin(th) });
  }
  var edges = [];
  nodes.forEach(function (a, i) {
    nodes.map(function (b, j) { return [j, Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)]; })
      .filter(function (d) { return d[0] !== i; })
      .sort(function (p, q) { return p[1] - q[1]; })
      .slice(0, 3)
      .forEach(function (d) {
        var j = d[0];
        if (!edges.some(function (e) { return (e[0] === i && e[1] === j) || (e[0] === j && e[1] === i); })) edges.push([i, j]);
      });
  });
  var neighbours = nodes.map(function (_, i) {
    var out = [];
    edges.forEach(function (e) { if (e[0] === i) out.push(e[1]); else if (e[1] === i) out.push(e[0]); });
    return out;
  });

  var pointer = null;
  var touch = window.matchMedia("(hover: none)").matches;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") pointer = { x: e.clientX, y: e.clientY }; }, { passive: true });
  document.addEventListener("pointerleave", function () { pointer = null; });

  function project(n, rot, tilt) {
    var x = n.x * Math.cos(rot) - n.z * Math.sin(rot);
    var z = n.x * Math.sin(rot) + n.z * Math.cos(rot);
    var y = n.y * Math.cos(tilt) - z * Math.sin(tilt);
    z = n.y * Math.sin(tilt) + z * Math.cos(tilt);
    var p = 1 / (1.6 - z * 0.45);
    return { x: x * p * 1.25, y: y * p * 1.25, z: z };
  }

  function start(canvas) {
    var size = parseInt(canvas.getAttribute("data-size") || "240", 10);
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = size + "px"; canvas.style.height = size + "px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var flash = nodes.map(function () { return 0; });
    var pulses = [];
    var eye = { gx: 0, gy: 0, tx: 0, ty: 0, nextLook: 0 };
    var blink = { closing: 0, next: 1.5 + Math.random() * 2, dbl: false };
    var happy = 0, perk = 0, hovered = false, hop = 0, nextHop = 4 + Math.random() * 3, clock = 0, last = performance.now();
    var visible = true;
    canvas.addEventListener("pointerenter", function () { hovered = true; });
    canvas.addEventListener("pointerleave", function () { hovered = false; });
    canvas.addEventListener("pointerdown", function () { hovered = true; hop = 0.001; setTimeout(function () { hovered = false; }, 1200); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(canvas);
    }
    function fire(from) {
      var o = neighbours[from];
      if (o.length) pulses.push({ a: from, b: o[Math.floor(Math.random() * o.length)], t: 0, d: 0.45 + Math.random() * 0.35 });
    }

    function draw(now) {
      requestAnimationFrame(draw);
      if (!visible) { last = now; return; }
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now; clock += dt;
      var R = size * 0.4, cx = size / 2;

      if (!reduce) {
        if (Math.random() < 6 * dt) fire(Math.floor(Math.random() * nodes.length));
        pulses.forEach(function (p) { p.t += dt / p.d; });
        pulses = pulses.filter(function (p) {
          if (p.t < 1) return true;
          flash[p.b] = 1;
          if (Math.random() < 0.55 && pulses.length < 120) fire(p.b);
          return false;
        });
      }
      for (var k = 0; k < flash.length; k++) flash[k] = Math.max(0, flash[k] - dt * 1.6);

      // gaze: the mouse; on phones, the scroll position plus glances
      var rect = canvas.getBoundingClientRect();
      if (pointer && !touch) {
        var dx = pointer.x - (rect.left + size / 2), dy = pointer.y - (rect.top + size / 2);
        var m = Math.hypot(dx, dy) || 1, kk = Math.min(1, m / (size * 1.2));
        eye.tx = (dx / m) * kk; eye.ty = (dy / m) * kk * 0.8;
      } else {
        eye.nextLook -= dt;
        var centreY = rect.top + size / 2, vh = window.innerHeight || 800;
        var scrollGaze = Math.max(-0.6, Math.min(0.6, (vh / 2 - centreY) / vh));
        if (eye.nextLook < 0) {
          var centre = Math.random() < 0.4;
          eye.tx = centre ? 0 : (Math.random() * 2 - 1) * 0.8;
          eye.nextLook = 0.7 + Math.random() * 1.8;
        }
        eye.ty = scrollGaze;
      }
      var follow = Math.min(1, dt * 14);
      eye.gx += (eye.tx - eye.gx) * follow; eye.gy += (eye.ty - eye.gy) * follow;

      // blink: open by default, a short close every 2-6 s
      if (blink.closing > 0) blink.closing -= dt;
      else {
        blink.next -= dt;
        if (blink.next <= 0) {
          blink.closing = 0.13;
          if (blink.dbl) { blink.dbl = false; blink.next = 2 + Math.random() * 4; }
          else if (Math.random() < 0.25) { blink.dbl = true; blink.next = 0.25; }
          else blink.next = 2 + Math.random() * 4;
        }
      }
      var open = blink.closing > 0 ? 0.12 : 1;
      if (!reduce) {
        nextHop -= dt;
        if (nextHop < 0) { hop = 0.001; nextHop = 7 + Math.random() * 6; }
      }
      if (hop > 0) { hop += dt; if (hop > 1.2) hop = 0; }
      happy += (((hovered || (hop > 0 && hop < 1)) ? 1 : 0) - happy) * Math.min(1, dt * 8);
      perk += ((hovered ? 1 : 0) - perk) * Math.min(1, dt * 8);
      var hopY = hop > 0 ? -Math.sin(Math.min(1, hop / 0.45) * Math.PI) * R * 0.08 : 0;
      var rot = reduce ? 0.6 : clock * 0.18, tilt = 0.35 + (reduce ? 0 : Math.sin(clock * 0.2) * 0.08);
      var pts = nodes.map(function (n) { return project(n, rot, tilt); });
      var cy = size / 2 + hopY, sc = 1 + perk * 0.04;

      ctx.clearRect(0, 0, size, size);
      ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.translate(-cx, -cy);
      var halo = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.2);
      halo.addColorStop(0, "rgba(123,92,255," + (0.35 + perk * 0.2) + ")"); halo.addColorStop(1, "rgba(123,92,255,0)");
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.2, 0, 7); ctx.fill();
      var body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      body.addColorStop(0, "#26338f"); body.addColorStop(0.55, "#0d1656"); body.addColorStop(1, "#050a2c");
      ctx.fillStyle = body; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();

      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R * 0.985, 0, 7); ctx.clip();
      ctx.globalCompositeOperation = "lighter";
      var lw = Math.max(0.5, size / 260);
      edges.forEach(function (e) {
        var a = pts[e[0]], b = pts[e[1]];
        ctx.strokeStyle = "rgba(" + hue((a.x + b.x) / 1.8) + "," + (0.12 + 0.22 * ((a.z + b.z) / 2 + 1) / 2) + ")";
        ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(cx + a.x * R, cy + a.y * R); ctx.lineTo(cx + b.x * R, cy + b.y * R); ctx.stroke();
      });
      pulses.forEach(function (p) {
        var a = pts[p.a], b = pts[p.b], t = p.t;
        var px = cx + (a.x + (b.x - a.x) * t) * R, py = cy + (a.y + (b.y - a.y) * t) * R, col = hue((a.x + (b.x - a.x) * t) / 0.9);
        var t0 = Math.max(0, t - 0.25);
        ctx.strokeStyle = "rgba(" + col + ",0.9)"; ctx.lineWidth = lw * 1.8;
        ctx.beginPath(); ctx.moveTo(cx + (a.x + (b.x - a.x) * t0) * R, cy + (a.y + (b.y - a.y) * t0) * R); ctx.lineTo(px, py); ctx.stroke();
        var g = ctx.createRadialGradient(px, py, 0, px, py, R * 0.09);
        g.addColorStop(0, "rgba(255,255,255,0.95)"); g.addColorStop(0.3, "rgba(" + col + ",0.6)"); g.addColorStop(1, "rgba(" + col + ",0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, R * 0.09, 0, 7); ctx.fill();
      });
      pts.forEach(function (p, i) {
        var x = cx + p.x * R, y = cy + p.y * R, col = hue(p.x / 0.9), dep = (p.z + 1) / 2;
        ctx.fillStyle = "rgba(" + col + "," + (0.45 + 0.4 * dep) + ")";
        ctx.beginPath(); ctx.arc(x, y, R * (0.012 + 0.014 * dep), 0, 7); ctx.fill();
        if (flash[i] > 0) {
          var rr = R * (0.05 + 0.12 * flash[i]), g = ctx.createRadialGradient(x, y, 0, x, y, rr);
          g.addColorStop(0, "rgba(255,255,255," + flash[i] + ")"); g.addColorStop(0.35, "rgba(" + col + "," + 0.7 * flash[i] + ")"); g.addColorStop(1, "rgba(" + col + ",0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill();
        }
      });
      ctx.globalCompositeOperation = "source-over";

      var ex = cx + eye.gx * R * 0.22, ey = cy + R * 0.03 + eye.gy * R * 0.17;
      var shade = ctx.createRadialGradient(ex, ey, 0, ex, ey, R * 0.58);
      shade.addColorStop(0, "rgba(4,8,36,0.8)"); shade.addColorStop(1, "rgba(4,8,36,0)");
      ctx.fillStyle = shade; ctx.beginPath(); ctx.ellipse(ex, ey, R * 0.58, R * 0.4, 0, 0, 7); ctx.fill();
      var w = R * 0.105 * (1 + perk * 0.08), h = Math.max(R * 0.135 * (1 + perk * 0.1) * open, R * 0.016);
      ctx.save(); ctx.translate(ex, ey); ctx.rotate(eye.gx * 0.1);
      [-1, 1].forEach(function (side) {
        var x = side * R * 0.22 + side * eye.gx * R * 0.02, fx = 1 - Math.max(0, side * eye.gx) * 0.15;
        ctx.save();
        if (happy > 0.02 && open === 1) {
          ctx.beginPath(); ctx.rect(x - w * 2, -h * 2, w * 4, h * 4);
          ctx.ellipse(x, h * (2.1 - 0.6 * happy), w * 1.8, h, 0, 0, 7); ctx.clip("evenodd");
        }
        ctx.shadowColor = "rgba(150,225,255,0.9)"; ctx.shadowBlur = R * 0.14; ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.ellipse(x, 0, w * fx, h, 0, 0, 7); ctx.fill();
        ctx.restore();
      });
      ctx.restore(); ctx.restore();

      var rim = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      rim.addColorStop(0, "rgba(47,211,255,0.95)"); rim.addColorStop(0.5, "rgba(123,92,255,0.7)"); rim.addColorStop(1, "rgba(255,79,216,0.95)");
      ctx.strokeStyle = rim; ctx.lineWidth = Math.max(1, R * 0.035); ctx.beginPath(); ctx.arc(cx, cy, R * 0.985, 0, 7); ctx.stroke();
      var shine = ctx.createRadialGradient(cx - R * 0.38, cy - R * 0.5, 0, cx - R * 0.38, cy - R * 0.5, R * 0.45);
      shine.addColorStop(0, "rgba(255,255,255,0.32)"); shine.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = shine; ctx.beginPath(); ctx.ellipse(cx - R * 0.38, cy - R * 0.5, R * 0.42, R * 0.26, -0.5, 0, 7); ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }

  function init() { Array.prototype.forEach.call(document.querySelectorAll("canvas.nuro-orb"), start); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
