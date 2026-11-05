/**
 * scene 2: street.js
 * "Wherever you wish. Here's the plan: there isn't one. You choose..."
 *
 * Sequence:
 * 1. Street illustration with animated steam wisp and glowing lanterns.
 * 2. Lines fade in.
 * 3. As lines appear, cute shopping bags drop onto the bench one by one and pile up.
 * 4. Bags counter ticks 1, 2, 3... speeds up, and settles on "∞" with a pop!
 * 5. Wish box with tappable chips (Shop for the sisters, Wander the streets, Chai and snacks, Surprise me, Anything).
 * 6. Free-text input field where whatever she types is remembered.
 * 7. "Ask me" button leads to Scene 3.
 */

window.StreetScene = (function() {
  const bagsLayer = document.getElementById('bench-bags-layer');
  const counterVal = document.getElementById('bags-counter-val');
  const wishInput = document.getElementById('user-wish-input');
  const wishChips = document.querySelectorAll('.wish-chip');
  const toQuestionBtn = document.getElementById('btn-to-question');

  const lines = [
    document.getElementById('s2-line-1'),
    document.getElementById('s2-line-2'),
    document.getElementById('s2-line-3'),
    document.getElementById('s2-line-4'),
    document.getElementById('s2-line-5')
  ];

  let currentBagCount = 0;
  let played = false;
  let selectedWish = '';

  // Bag designs: pastel tones, different silhouettes and handles
  const bagDesigns = [
    { fill: '#C87479', handle: '#7A3951', w: 22, h: 26, x: 105, y: 128 },
    { fill: '#DCA23E', handle: '#9E6B1D', w: 24, h: 24, x: 130, y: 130 },
    { fill: '#A36881', handle: '#5B3347', w: 20, h: 28, x: 154, y: 126 },
    { fill: '#E0A899', handle: '#B57463', w: 26, h: 22, x: 175, y: 132 },
    { fill: '#94A388', handle: '#5F6E54', w: 21, h: 25, x: 202, y: 129 },
    { fill: '#B8829E', handle: '#6E455D', w: 23, h: 26, x: 224, y: 128 },
    { fill: '#E6AF5C', handle: '#9A6B25', w: 25, h: 25, x: 248, y: 129 },
    // Wobbling top layer bags
    { fill: '#E58B9C', handle: '#7A3951', w: 20, h: 22, x: 140, y: 107 },
    { fill: '#F2C29B', handle: '#A66A3D', w: 22, h: 21, x: 190, y: 108 }
  ];

  function dropBag(index) {
    if (!bagsLayer) return;
    const design = bagDesigns[index % bagDesigns.length];
    
    // Slight random offset to look natural
    const jitterX = (Math.random() - 0.5) * 6;
    const bagGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    bagGroup.setAttribute('class', 'bench-bag-svg');
    bagGroup.style.transformOrigin = `${design.x + design.w / 2}px ${design.y + design.h}px`;

    // Handle arc
    const handle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const hx = design.x + jitterX;
    handle.setAttribute('d', `M${hx + 5} ${design.y + 4} Q${hx + design.w / 2} ${design.y - 8} ${hx + design.w - 5} ${design.y + 4}`);
    handle.setAttribute('fill', 'none');
    handle.setAttribute('stroke', design.handle);
    handle.setAttribute('stroke-width', '2');
    handle.setAttribute('stroke-linecap', 'round');

    // Bag body
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    body.setAttribute('x', hx);
    body.setAttribute('y', design.y);
    body.setAttribute('width', design.w);
    body.setAttribute('height', design.h);
    body.setAttribute('rx', '3');
    body.setAttribute('fill', design.fill);

    // Accent line/crease
    const crease = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    crease.setAttribute('x1', hx + design.w / 2);
    crease.setAttribute('y1', design.y);
    crease.setAttribute('x2', hx + design.w / 2);
    crease.setAttribute('y2', design.y + design.h);
    crease.setAttribute('stroke', 'rgba(255,255,255,0.3)');
    crease.setAttribute('stroke-width', '1');

    bagGroup.appendChild(handle);
    bagGroup.appendChild(body);
    bagGroup.appendChild(crease);

    bagsLayer.appendChild(bagGroup);
  }

  function tickCounter(toValue, isInfinity = false) {
    if (!counterVal) return;
    counterVal.textContent = toValue;
    counterVal.classList.remove('pop');
    void counterVal.offsetWidth; // re-trigger animation
    counterVal.classList.add('pop');

    if ('vibrate' in navigator) {
      try { navigator.vibrate(12); } catch (_) {}
    }
  }

  function play(onComplete) {
    if (played) return;
    played = true;

    // Line 1 & Bag 1
    setTimeout(() => {
      if (lines[0]) lines[0].classList.add('visible');
      dropBag(0);
      tickCounter('1');
    }, 400);

    // Line 2 & Bags 2, 3
    setTimeout(() => {
      if (lines[1]) lines[1].classList.add('visible');
      dropBag(1);
      tickCounter('2');
      setTimeout(() => {
        dropBag(2);
        tickCounter('3');
      }, 450);
    }, 1600);

    // Line 3 & Bags 4, 5
    setTimeout(() => {
      if (lines[2]) lines[2].classList.add('visible');
      dropBag(3);
      setTimeout(() => {
        dropBag(4);
        tickCounter('5');
      }, 400);
    }, 3200);

    // Line 4 & Bags 6, 7
    setTimeout(() => {
      if (lines[3]) lines[3].classList.add('visible');
      dropBag(5);
      setTimeout(() => {
        dropBag(6);
        tickCounter('12');
      }, 350);
    }, 4700);

    // Line 5 & Bags wobble and counter speeds up to Infinity!
    setTimeout(() => {
      if (lines[4]) lines[4].classList.add('visible');
      dropBag(7);
      dropBag(8);
      tickCounter('28');
      setTimeout(() => tickCounter('54'), 150);
      setTimeout(() => tickCounter('99+'), 300);
      setTimeout(() => {
        tickCounter('∞', true);
      }, 500);
    }, 6100);

    // Chip click interactions
    wishChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const wish = chip.dataset.wish;
        if (wishInput) {
          wishInput.value = wish;
          selectedWish = wish;
        }
        wishChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        // Drop a sweet extra bag on the pile!
        dropBag(Math.floor(Math.random() * bagDesigns.length));
      });
    });

    if (wishInput) {
      wishInput.addEventListener('input', (e) => {
        selectedWish = e.target.value.trim();
        wishChips.forEach(c => c.classList.remove('active'));
      });
    }

    if (toQuestionBtn) {
      toQuestionBtn.addEventListener('click', () => {
        if (wishInput && wishInput.value.trim()) {
          selectedWish = wishInput.value.trim();
        }
        if (typeof onComplete === 'function') {
          onComplete(selectedWish);
        }
      });
    }
  }

  function getWish() {
    if (wishInput && wishInput.value.trim()) {
      return wishInput.value.trim();
    }
    return selectedWish || '';
  }

  return {
    play,
    getWish
  };
})();
