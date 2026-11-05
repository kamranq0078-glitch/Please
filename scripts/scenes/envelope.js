/**
 * scene 0: envelope.js
 * "Knock knock. Open this when you've got a minute. It's from me."
 *
 * Sequence:
 * 1. Envelope drops in, lands on shelf.
 * 2. Envelope gives two small knocks (shakes twice).
 * 3. Tapping the wax seal or envelope: flap lifts, letter peeks, envelope smoothly departs.
 * 4. Triggers transition to Scene 1.
 */

window.EnvelopeScene = (function() {
  const container = document.getElementById('envelope-container');
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');

  let isOpened = false;

  function init(onOpenComplete) {
    if (!container || !envelope) return;

    // Trigger two distinct knocks after landing
    setTimeout(() => {
      envelope.classList.add('knocking');
      // Subtle haptic knock
      if ('vibrate' in navigator) {
        try { navigator.vibrate([15, 80, 15]); } catch (_) {}
      }
    }, 900);

    // Click / touch handler to open envelope
    function handleOpen(e) {
      if (isOpened) return;
      isOpened = true;

      // Haptic confirmation
      if ('vibrate' in navigator) {
        try { navigator.vibrate(25); } catch (_) {}
      }

      container.classList.add('opening');

      // Allow opening animation to unfold, then transition
      setTimeout(() => {
        if (typeof onOpenComplete === 'function') {
          onOpenComplete();
        }
      }, 950);
    }

    container.addEventListener('click', handleOpen);
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen(e);
      }
    });

    if (waxSeal) {
      waxSeal.addEventListener('click', (e) => {
        e.stopPropagation();
        handleOpen(e);
      });
    }
  }

  return { init };
})();
