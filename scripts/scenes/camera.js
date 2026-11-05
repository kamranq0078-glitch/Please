/**
 * scene 6: camera.js
 * The P.P.S. (Instant Camera & Photo Request) & Closing Signature
 *
 * Sequence:
 * 1. P.P.S. handwritten note lines appear.
 * 2. Instant camera sits on ledge.
 * 3. Tapping "Send me a photo":
 *    - Camera flashes (soft warm-white pulse, gentle, skipped if reduced motion).
 *    - Blank polaroid slides out of camera slot.
 *    - Polaroid develops slowly into a warm abstract watercolor sunrise glow.
 *    - Opens WhatsApp: "Here's me before I head out 📸".
 * 4. Closing handwritten signature:
 *    — Kamran
 *    [DATE_WORD] can't come soon enough.
 */

window.CameraScene = (function() {
  const flashOverlay = document.getElementById('camera-flash');
  const polaroidCard = document.getElementById('polaroid-card');
  const sendPhotoBtn = document.getElementById('send-photo-btn');
  const signatureDateLine = document.getElementById('signature-date-line');

  const lines = [
    document.getElementById('pps-line-1'),
    document.getElementById('pps-line-2'),
    document.getElementById('pps-line-3')
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let played = false;

  function setDateWord(dateWord) {
    if (signatureDateLine) {
      signatureDateLine.textContent = `${dateWord} can’t come soon enough.`;
    }
  }

  function play() {
    if (played) return;
    played = true;

    // Fade in P.P.S. lines
    setTimeout(() => {
      if (lines[0]) lines[0].classList.add('visible');
    }, 400);

    setTimeout(() => {
      if (lines[1]) lines[1].classList.add('visible');
    }, 1600);

    setTimeout(() => {
      if (lines[2]) lines[2].classList.add('visible');
    }, 2800);
  }

  function setupInteractions(whatsappNumber) {
    if (!sendPhotoBtn) return;

    // Prefill WhatsApp link for photo
    const message = "Here's me before I head out 📸";
    const waUrl = whatsappNumber && whatsappNumber.trim()
      ? `https://wa.me/${whatsappNumber.trim()}?text=${encodeURIComponent(message)}`
      : '#';

    sendPhotoBtn.href = waUrl;

    sendPhotoBtn.addEventListener('click', (e) => {
      // Trigger camera flash
      if (!prefersReducedMotion && flashOverlay) {
        flashOverlay.classList.add('active');
        setTimeout(() => {
          flashOverlay.classList.remove('active');
        }, 180);
      }

      // Haptic snap
      if ('vibrate' in navigator) {
        try { navigator.vibrate([20, 30, 20]); } catch (_) {}
      }

      // Eject Polaroid
      if (polaroidCard) {
        polaroidCard.classList.add('ejected');

        // Slowly develop into warm sunrise watercolor
        setTimeout(() => {
          polaroidCard.classList.add('developed');
        }, 800);
      }

      // If no WhatsApp number is set, prevent default navigation
      if (!whatsappNumber || !whatsappNumber.trim()) {
        e.preventDefault();
      }
    });
  }

  function setupObserver() {
    const section = document.getElementById('scene-6');
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
      setTimeout(play, 1200);
    }
  }

  return {
    setDateWord,
    play,
    setupInteractions,
    setupObserver
  };
})();
