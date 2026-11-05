/**
 * scene 3: question.js
 * The Question & The Shy No Button (The Star of the Site)
 *
 * Requirements:
 * - Ainain, will you go on a date with me this [DATE_WORD]?
 * - Big, soft, gently pulsing Yes button that subtly grows on each dodge.
 * - Shy No button that is IMPOSSIBLE TO PRESS on mouse, touch, and pen.
 * - Hops away with springy squash & stretch timing inside safe arena bounds.
 * - Never overlaps Yes button.
 * - Cannot be clicked; keyboard focus shifts to Yes with aria-live message.
 * - Reaction speech tag order:
 *   1. Nice try.
 *   2. Hehe. Nope.
 *   3. It's very shy, give it a minute.
 *   4. It left a note: "gone to get chai."
 *   5. It's flying away now. Bye, No!
 * - On 5th attempt: floats off screen on a balloon, replaced by "Obviously yes."
 * - After 3rd dodge: soft escape line fades in: "[DATE_WORD] doesn't work? Pick another day"
 *   Tapping it opens day chips (Sat, Sun, Mon, Tue, Wed, Thu, Fri, You tell me).
 * - Reduced motion fallback: stays put, labeled "No (too shy today)", shows lines on tap.
 */

window.QuestionScene = (function() {
  const arena = document.getElementById('buttons-arena');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const noWrapper = document.getElementById('no-button-wrapper');
  const speechTag = document.getElementById('no-speech-tag');
  const speechText = document.getElementById('no-speech-text');
  const balloon = document.getElementById('no-balloon');
  const btnObviouslyYes = document.getElementById('btn-obviously-yes');
  const btnNoText = document.getElementById('btn-no-text');

  const escapeWrap = document.getElementById('soft-escape-wrapper');
  const escapeBtn = document.getElementById('btn-soft-escape');
  const escapeLineText = document.getElementById('escape-line-text');
  const dayChipsPanel = document.getElementById('day-chips-panel');
  const dayChips = document.querySelectorAll('.day-chip');
  const srAnnounce = document.getElementById('sr-announcements');

  const questionHeading = document.getElementById('main-question-text');
  const dateWordSpan = document.getElementById('q-date-word');

  const speechLines = [
    'Nice try.',
    'Hehe. Nope.',
    'It’s very shy, give it a minute.',
    'It left a note: “gone to get chai.”',
    'It’s flying away now. Bye, No!'
  ];

  let dodgeCount = 0;
  let currentDateWord = 'Saturday';
  let isFlyingAway = false;
  let onYesChosenCallback = null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setDateWord(dateWord) {
    currentDateWord = dateWord;
    if (dateWordSpan) dateWordSpan.textContent = dateWord;
    if (escapeLineText) {
      escapeLineText.textContent = `${dateWord} doesn’t work? Pick another day`;
    }
  }

  function announceSR(message) {
    if (srAnnounce) {
      srAnnounce.textContent = message;
    }
  }

  // Calculate safe next coordinates for No button inside the arena
  function getSafeCoordinates() {
    if (!arena || !noWrapper) return { x: 0, y: 0 };

    const arenaRect = arena.getBoundingClientRect();
    const yesRect = btnYes ? btnYes.getBoundingClientRect() : null;
    const noRect = noWrapper.getBoundingClientRect();

    const padding = 16;
    const minX = -arenaRect.width / 2 + noRect.width / 2 + padding;
    const maxX = arenaRect.width / 2 - noRect.width / 2 - padding;
    const minY = -arenaRect.height / 2 + noRect.height / 2 + padding;
    const maxY = arenaRect.height / 2 - noRect.height / 2 - padding;

    // Try up to 20 candidate positions until finding one that does not overlap Yes
    let bestX = 0;
    let bestY = 0;
    let found = false;

    for (let i = 0; i < 20; i++) {
      const candX = minX + Math.random() * (maxX - minX);
      const candY = minY + Math.random() * (maxY - minY);

      // Candidate absolute bounds
      const candLeft = arenaRect.left + arenaRect.width / 2 + candX - noRect.width / 2;
      const candRight = candLeft + noRect.width;
      const candTop = arenaRect.top + arenaRect.height / 2 + candY - noRect.height / 2;
      const candBottom = candTop + noRect.height;

      // Check overlap with Yes button (plus 28px buffer zone)
      if (yesRect) {
        const buffer = 28;
        const overlapX = !(candRight + buffer < yesRect.left || candLeft - buffer > yesRect.right);
        const overlapY = !(candBottom + buffer < yesRect.top || candTop - buffer > yesRect.bottom);

        if (!overlapX || !overlapY) {
          bestX = candX;
          bestY = candY;
          found = true;
          break;
        }
      } else {
        bestX = candX;
        bestY = candY;
        found = true;
        break;
      }
    }

    if (!found) {
      // Fallback: nudge to safe corner opposite to Yes
      bestX = (dodgeCount % 2 === 0 ? maxX - 10 : minX + 10);
      bestY = (dodgeCount % 3 === 0 ? minY + 10 : maxY - 10);
    }

    return { x: bestX, y: bestY };
  }

  function dodgeNoButton() {
    if (isFlyingAway) return;

    dodgeCount++;

    // Haptic feedback
    if ('vibrate' in navigator) {
      try { navigator.vibrate(10); } catch (_) {}
    }

    // Yes button subtly grows a little with each dodge
    if (btnYes) {
      const scale = 1 + Math.min(dodgeCount * 0.045, 0.22);
      btnYes.style.transform = `scale(${scale})`;
    }

    // Show reaction speech tag
    const msgIndex = Math.min(dodgeCount - 1, speechLines.length - 1);
    const line = speechLines[msgIndex];
    if (speechText) speechText.textContent = line;
    if (speechTag) {
      speechTag.classList.add('visible');
    }

    // Reveal soft escape line after 3rd dodge
    if (dodgeCount >= 3 && escapeWrap) {
      escapeWrap.style.opacity = '1';
      escapeWrap.style.pointerEvents = 'auto';
    }

    // 5th Attempt: Float off on tiny balloon!
    if (dodgeCount >= 5) {
      isFlyingAway = true;
      if (balloon) balloon.classList.add('visible');
      if (noWrapper) {
        noWrapper.classList.add('floating-away');
      }

      // Reveal "Obviously yes." in place of No
      setTimeout(() => {
        if (btnObviouslyYes) {
          btnObviouslyYes.style.display = 'inline-block';
          btnObviouslyYes.focus();
        }
      }, 700);

      announceSR("The No button flew away on a balloon. Obviously yes is right here.");
      return;
    }

    // Squash & Stretch physics jump
    const { x, y } = getSafeCoordinates();
    if (noWrapper) {
      noWrapper.classList.remove('squash-stretch');
      void noWrapper.offsetWidth; // trigger reflow
      noWrapper.classList.add('squash-stretch');
      noWrapper.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  // Pointer distance tracking for early avoidance on cursor / stylus
  function handlePointerProximity(e) {
    if (isFlyingAway || prefersReducedMotion) return;
    if (!noWrapper) return;

    const noRect = noWrapper.getBoundingClientRect();
    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;

    const dx = e.clientX - noCenterX;
    const dy = e.clientY - noCenterY;
    const dist = Math.hypot(dx, dy);

    // If pointer gets closer than 72px, spring away immediately!
    if (dist < 72) {
      dodgeNoButton();
    }
  }

  function handleTouchProximity(e) {
    if (e.touches && e.touches.length > 0) {
      handlePointerProximity(e.touches[0]);
    }
  }

  function setupInteractions(onYes) {
    onYesChosenCallback = onYes;

    if (prefersReducedMotion) {
      // Reduced motion: No button sits out-of-order, tapping shows lines
      if (btnNo) {
        btnNo.setAttribute('aria-disabled', 'true');
        btnNo.title = 'No is too shy today';
        if (btnNoText) btnNoText.textContent = 'No (too shy today)';
        btnNo.addEventListener('click', (e) => {
          e.preventDefault();
          dodgeCount++;
          const line = speechLines[Math.min(dodgeCount - 1, speechLines.length - 1)];
          if (speechText) speechText.textContent = line;
          if (speechTag) speechTag.classList.add('visible');
          if (dodgeCount >= 3 && escapeWrap) {
            escapeWrap.style.opacity = '1';
            escapeWrap.style.pointerEvents = 'auto';
          }
        });
      }
    } else {
      // Normal motion: Dodging physics on proximity and touch
      window.addEventListener('pointermove', handlePointerProximity, { passive: true });
      window.addEventListener('touchmove', handleTouchProximity, { passive: true });

      // Immediate dodge on touchstart or pointerdown (prevent any click!)
      if (btnNo) {
        const interceptDodge = (e) => {
          e.preventDefault();
          e.stopPropagation();
          dodgeNoButton();
          return false;
        };

        btnNo.addEventListener('pointerdown', interceptDodge, { passive: false });
        btnNo.addEventListener('touchstart', interceptDodge, { passive: false });
        btnNo.addEventListener('mousedown', interceptDodge, { passive: false });
        btnNo.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dodgeNoButton();
        });

        // Keyboard navigation: if No gains focus, bounce away to Yes
        btnNo.addEventListener('focus', () => {
          announceSR("This button is shy. Yes is right here.");
          dodgeNoButton();
          if (btnYes) btnYes.focus();
        });
      }
    }

    // Yes Button Handlers
    function triggerYes(dayChosen) {
      const finalDay = dayChosen || currentDateWord;
      if (typeof onYesChosenCallback === 'function') {
        onYesChosenCallback(finalDay);
      }
    }

    if (btnYes) {
      btnYes.addEventListener('click', () => triggerYes(currentDateWord));
    }

    if (btnObviouslyYes) {
      btnObviouslyYes.addEventListener('click', () => triggerYes(currentDateWord));
    }

    // Soft Escape: "Saturday doesn't work? Pick another day"
    if (escapeBtn) {
      escapeBtn.addEventListener('click', () => {
        if (dayChipsPanel) {
          dayChipsPanel.style.display = dayChipsPanel.style.display === 'none' ? 'block' : 'none';
        }
      });
    }

    // Day Chips (Sat, Sun, Mon, Tue, Wed, Thu, Fri, "You tell me")
    dayChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const chosenDay = chip.dataset.day;
        triggerYes(chosenDay);
      });
    });
  }

  function cleanup() {
    window.removeEventListener('pointermove', handlePointerProximity);
    window.removeEventListener('touchmove', handleTouchProximity);
  }

  return {
    setDateWord,
    setupInteractions,
    cleanup
  };
})();
