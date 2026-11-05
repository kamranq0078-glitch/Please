/**
 * scene 1: calendar.js
 * "You're right. I don't ask enough..."
 *
 * Sincere, quiet, no jokes.
 * Sequence:
 * 1. Wall calendar pages flip gently one after another in the breeze.
 * 2. Settles on Saturday page.
 * 3. Hand-drawn gold circle ring draws itself around the date word.
 * 4. Sincere lines fade in line by line with slow, gentle pacing.
 * 5. Gentle "Read on" action reveals Scene 2.
 */

window.CalendarScene = (function() {
  const page1 = document.getElementById('cal-page-1');
  const page2 = document.getElementById('cal-page-2');
  const goldRing = document.getElementById('gold-circle-ring');
  const dayText = document.getElementById('calendar-day-text');

  const line1 = document.getElementById('s1-line-1');
  const line2 = document.getElementById('s1-line-2');
  const line3 = document.getElementById('s1-line-3');
  const line4 = document.getElementById('s1-line-4');
  const actionWrap = document.getElementById('s1-action-wrap');
  const nextBtn = document.getElementById('s1-next-btn');

  let initialized = false;

  function setDateWord(dateWord) {
    if (dayText) {
      dayText.textContent = dateWord;
    }
  }

  function play(onComplete) {
    if (initialized) return;
    initialized = true;

    // 1. Flip Calendar Pages
    setTimeout(() => {
      if (page1) page1.classList.add('flipped');
    }, 400);

    setTimeout(() => {
      if (page2) page2.classList.add('flipped');
    }, 1100);

    // 2. Draw Hand-drawn Gold Ring
    setTimeout(() => {
      if (goldRing) goldRing.classList.add('drawn');
    }, 1800);

    // 3. Fade in text lines one by one
    setTimeout(() => {
      if (line1) line1.classList.add('visible');
    }, 700);

    setTimeout(() => {
      if (line2) line2.classList.add('visible');
    }, 1800);

    setTimeout(() => {
      if (line3) line3.classList.add('visible');
    }, 3100);

    setTimeout(() => {
      if (line4) line4.classList.add('visible');
    }, 4900);

    // 4. Reveal "Read on" action
    setTimeout(() => {
      if (actionWrap) actionWrap.classList.add('visible');
    }, 6100);

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      });
    }
  }

  return {
    setDateWord,
    play
  };
})();
