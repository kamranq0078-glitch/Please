/**
 * scene 4: yes.js
 * "It's a date. [DATE_WORD]. You, me, and every bag in the city..."
 *
 * Sequence:
 * 1. Warm celebration burst (tasteful confetti, soft petals, lanterns).
 * 2. Gentle double pulse haptic.
 * 3. Shows chosen day and her wish (if typed).
 * 4. "Tell Kamran" button opens WhatsApp prefilled with message:
 *    "Yes 💛 [DATE_WORD] it is. I'd love to: [wish or 'anywhere']"
 *    If WHATSAPP_NUMBER is missing, shows fallback: "Screenshot this and send it to Kamran."
 * 5. Saves state in localStorage.
 */

window.YesScene = (function() {
  const dateWordEl = document.getElementById('celebration-date-word');
  const planRecap = document.getElementById('user-plan-recap');
  const planContent = document.getElementById('plan-content-text');
  const tellKamranBtn = document.getElementById('tell-kamran-btn');
  const waFallback = document.getElementById('wa-fallback-text');

  function render(dateWord, wish, whatsappNumber) {
    if (dateWordEl) {
      dateWordEl.textContent = dateWord || 'Saturday';
    }

    if (wish && wish.trim() && planRecap && planContent) {
      planContent.textContent = wish.trim();
      planRecap.style.display = 'block';
    } else if (planRecap) {
      planRecap.style.display = 'none';
    }

    // Configure WhatsApp Link
    if (whatsappNumber && whatsappNumber.trim() && tellKamranBtn) {
      const wishText = (wish && wish.trim()) ? wish.trim() : 'anywhere';
      const message = `Yes 💛 ${dateWord} it is. I'd love to: ${wishText}`;
      const waUrl = `https://wa.me/${whatsappNumber.trim()}?text=${encodeURIComponent(message)}`;
      tellKamranBtn.href = waUrl;
      tellKamranBtn.style.display = 'inline-flex';
      if (waFallback) waFallback.style.display = 'none';
    } else {
      if (tellKamranBtn) tellKamranBtn.style.display = 'none';
      if (waFallback) waFallback.style.display = 'block';
    }

    // Save to localStorage
    try {
      localStorage.setItem('saturday_invitation_response', JSON.stringify({
        answered: true,
        dateWord: dateWord || 'Saturday',
        wish: wish || '',
        savedAt: Date.now()
      }));
    } catch (_) {
      // Graceful fallback if storage disabled
    }

    // Double pulse haptic feedback
    if ('vibrate' in navigator) {
      try { navigator.vibrate([30, 50, 40]); } catch (_) {}
    }

    // Trigger canvas celebration particles
    if (window.ParticleSystem) {
      window.ParticleSystem.startCelebration();
    }
  }

  function getSavedState() {
    try {
      const data = localStorage.getItem('saturday_invitation_response');
      if (data) {
        return JSON.parse(data);
      }
    } catch (_) {}
    return null;
  }

  return {
    render,
    getSavedState
  };
})();
