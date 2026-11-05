/**
 * particles.js
 * Canvas-based particle manager:
 * - Floating warm golden lanterns (rising gently with warm glow)
 * - Drifting soft flower petals (falling gently with wind sway)
 * - Tasteful celebratory confetti burst (for the Yes moment)
 *
 * Includes automatic framerate monitoring to throttle/scale down on lower-end devices.
 */

window.ParticleSystem = (function() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return { init: () => {}, startCelebration: () => {}, setMode: () => {} };

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let width = 0;
  let height = 0;

  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Particle pools
  let lanterns = [];
  let petals = [];
  let confetti = [];

  // Performance throttling
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;
  let particleScale = 1.0;

  // Palette
  const petalColors = [
    'rgba(235, 148, 168, 0.65)',
    'rgba(247, 186, 196, 0.60)',
    'rgba(250, 218, 224, 0.55)',
    'rgba(224, 168, 130, 0.50)',
    'rgba(245, 230, 222, 0.60)'
  ];

  const confettiColors = [
    '#E2A645', '#FCE198', '#A44E68', '#7A3951', '#E898A8', '#FAF3EB', '#DCA23E'
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // --- Lantern Factory ---
  function createLantern() {
    return {
      x: Math.random() * width,
      y: height + Math.random() * 50 + 20,
      radius: 6 + Math.random() * 7,
      vy: 0.35 + Math.random() * 0.45,
      vx: (Math.random() - 0.5) * 0.2,
      flickerSpeed: 0.03 + Math.random() * 0.04,
      flickerPhase: Math.random() * Math.PI * 2,
      opacity: 0.15 + Math.random() * 0.6
    };
  }

  // --- Petal Factory ---
  function createPetal() {
    return {
      x: Math.random() * width,
      y: -20 - Math.random() * 80,
      size: 5 + Math.random() * 6,
      vy: 0.7 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.5,
      swaySpeed: 0.02 + Math.random() * 0.03,
      swayOffset: Math.random() * Math.PI * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      color: petalColors[Math.floor(Math.random() * petalColors.length)]
    };
  }

  // --- Confetti Factory ---
  function createConfettiPiece(originX, originY) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 3 + Math.random() * 7;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 2.5, // gentle upward burst
      width: 4 + Math.random() * 6,
      height: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      opacity: 1,
      gravity: 0.14,
      drag: 0.96
    };
  }

  function init() {
    if (prefersReducedMotion) return;

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Initial ambient lanterns (fewer on small screens)
    const lanternCount = Math.floor((width < 450 ? 8 : 15) * particleScale);
    for (let i = 0; i < lanternCount; i++) {
      const l = createLantern();
      l.y = Math.random() * height; // distribute initially
      lanterns.push(l);
    }

    startLoop();
  }

  function startCelebration() {
    if (prefersReducedMotion) return;

    // Launch a burst of 50-70 tasteful confetti pieces centered around Yes card
    const originX = width / 2;
    const originY = height * 0.45;
    const count = width < 450 ? 55 : 85;

    for (let i = 0; i < count; i++) {
      confetti.push(createConfettiPiece(originX, originY));
    }

    // Add extra lanterns and soft drifting petals
    const extraPetals = width < 450 ? 20 : 35;
    for (let i = 0; i < extraPetals; i++) {
      petals.push(createPetal());
    }

    const extraLanterns = width < 450 ? 8 : 14;
    for (let i = 0; i < extraLanterns; i++) {
      lanterns.push(createLantern());
    }
  }

  function updatePerformance(now) {
    frameCount++;
    const delta = now - lastTime;
    if (delta >= 1000) {
      fps = (frameCount * 1000) / delta;
      frameCount = 0;
      lastTime = now;

      // Scale down particle counts if device struggles (< 40 FPS)
      if (fps < 40 && particleScale > 0.5) {
        particleScale = 0.5;
        if (lanterns.length > 8) lanterns.length = 8;
        if (petals.length > 12) petals.length = 12;
      }
    }
  }

  function render(now) {
    updatePerformance(now);
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Lanterns
    for (let i = lanterns.length - 1; i >= 0; i--) {
      const l = lanterns[i];
      l.y -= l.vy;
      l.x += l.vx + Math.sin(now * 0.001 + l.flickerPhase) * 0.25;
      l.flickerPhase += l.flickerSpeed;

      // Flicker opacity
      const flicker = l.opacity + Math.sin(l.flickerPhase) * 0.15;

      // Radial glow
      const glowGrad = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.radius * 2.8);
      glowGrad.addColorStop(0, `rgba(255, 235, 160, ${flicker * 0.8})`);
      glowGrad.addColorStop(0.5, `rgba(235, 175, 75, ${flicker * 0.4})`);
      glowGrad.addColorStop(1, 'rgba(235, 175, 75, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.radius * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Core lantern
      ctx.fillStyle = `rgba(255, 248, 220, ${flicker})`;
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Reset when floating off top
      if (l.y < -30) {
        lanterns[i] = createLantern();
      }
    }

    // 2. Draw Petals
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.y += p.vy;
      p.x += p.vx + Math.sin(now * 0.002 + p.swayOffset) * 0.8;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.3, p.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Reset if off bottom or sides
      if (p.y > height + 20) {
        // Continuous gentle rain during celebration
        p.y = -20;
        p.x = Math.random() * width;
      }
    }

    // 3. Draw Confetti (fade out and remove)
    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.vx *= c.drag;
      c.vy = (c.vy + c.gravity) * c.drag;
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotationSpeed;
      c.opacity -= 0.007;

      if (c.opacity <= 0 || c.y > height + 20) {
        confetti.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, c.opacity);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  function startLoop() {
    if (!animationFrameId && !prefersReducedMotion) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(render);
    }
  }

  function stop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  return {
    init,
    startCelebration,
    stop
  };
})();
