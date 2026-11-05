/**
 * scene 5: mirror.js
 * The P.S. (Vanity Mirror & Fest Note)
 *
 * Sequence:
 * 1. Warm vanity mirror ringed with 10 bulbs.
 * 2. Bulbs switch on one by one, each with a soft flicker until fully glowing.
 * 3. Shimmer sweeps across the mirror glass.
 * 4. Dress on hanger sways gently.
 * 5. Lipstick rolls out and draws a cute star on the glass.
 * 6. The handwritten paper note lines fade in.
 */

window.MirrorScene = (function() {
  const bulbs = document.querySelectorAll('.vanity-bulb');
  const lipstickStar = document.getElementById('lipstick-star');
  const lines = [
    document.getElementById('ps-line-1'),
    document.getElementById('ps-line-2'),
    document.getElementById('ps-line-3'),
    document.getElementById('ps-line-4')
  ];

  let animated = false;

  function turnOnBulbs() {
    bulbs.forEach((bulb, idx) => {
      setTimeout(() => {
        bulb.classList.add('flicker');
        setTimeout(() => {
          bulb.classList.add('lit');
        }, 200);
      }, idx * 160);
    });
  }

  function play() {
    if (animated) return;
    animated = true;

    // Turn on vanity bulbs one by one
    turnOnBulbs();

    // Reveal lipstick drawn star on mirror glass
    setTimeout(() => {
      if (lipstickStar) {
        lipstickStar.classList.add('revealed');
      }
    }, 1800);

    // Fade in P.S. handwritten note lines
    setTimeout(() => {
      if (lines[0]) lines[0].classList.add('visible');
    }, 600);

    setTimeout(() => {
      if (lines[1]) lines[1].classList.add('visible');
    }, 1800);

    setTimeout(() => {
      if (lines[2]) lines[2].classList.add('visible');
    }, 3400);

    setTimeout(() => {
      if (lines[3]) lines[3].classList.add('visible');
    }, 4800);
  }

  function setupObserver() {
    const section = document.getElementById('scene-5');
    if (!section) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            play();
            observer.disconnect();
          }
        });
      }, { threshold: 0.2 });
      observer.observe(section);
    } else {
      // Fallback
      setTimeout(play, 1000);
    }
  }

  return {
    play,
    setupObserver
  };
})();
