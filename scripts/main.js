/**
 * main.js - Master Orchestrator for "Saturday?"
 *
 * CONFIGURATION (Top of file as requested):
 */
const WHATSAPP_NUMBER = '919622450753';   // country code, no +
const DATE_WORD = 'Saturday';             // used throughout the copy
const FEST_NOTE = true;                   // set false to hide the P.S. scene

document.addEventListener('DOMContentLoaded', () => {
  const appStage = document.getElementById('app-stage');
  const scene0 = document.getElementById('scene-0');
  const scene1 = document.getElementById('scene-1');
  const scene2 = document.getElementById('scene-2');
  const scene3 = document.getElementById('scene-3');
  const scene4 = document.getElementById('scene-4');
  const scene5 = document.getElementById('scene-5');
  const scene6 = document.getElementById('scene-6');

  // Handle FEST_NOTE flag
  if (!FEST_NOTE && scene5) {
    scene5.style.display = 'none';
  }

  // Initialize canvas ambient particles
  if (window.ParticleSystem) {
    window.ParticleSystem.init();
  }

  // Propagate DATE_WORD across scenes
  if (window.CalendarScene) window.CalendarScene.setDateWord(DATE_WORD);
  if (window.QuestionScene) window.QuestionScene.setDateWord(DATE_WORD);
  if (window.CameraScene) window.CameraScene.setDateWord(DATE_WORD);

  // Setup Camera Scene interactions
  if (window.CameraScene) {
    window.CameraScene.setupInteractions(WHATSAPP_NUMBER);
  }

  // Transition helper between scenes
  function switchScene(fromScene, toScene, onComplete) {
    if (fromScene) {
      fromScene.style.opacity = '0';
      fromScene.style.transform = 'translateY(-14px) scale(0.98)';
      setTimeout(() => {
        fromScene.classList.remove('active');
        fromScene.style.display = 'none';

        if (toScene) {
          toScene.style.display = 'block';
          // Trigger reflow
          void toScene.offsetWidth;
          toScene.classList.add('active');
          toScene.style.opacity = '1';
          toScene.style.transform = 'translateY(0) scale(1)';

          if (typeof onComplete === 'function') {
            onComplete();
          }
        }
      }, 450);
    } else if (toScene) {
      toScene.style.display = 'block';
      toScene.classList.add('active');
      toScene.style.opacity = '1';
      toScene.style.transform = 'translateY(0) scale(1)';
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  }

  // Activate Celebration Flow (Scenes 4, 5, 6 together)
  function activateCelebrationFlow(chosenDate, chosenWish) {
    // Hide scenes 0, 1, 2, 3
    [scene0, scene1, scene2, scene3].forEach(s => {
      if (s) {
        s.classList.remove('active');
        s.style.display = 'none';
      }
    });

    if (appStage) {
      appStage.classList.add('flow-after-yes');
    }

    // Render Scene 4
    if (window.YesScene) {
      window.YesScene.render(chosenDate || DATE_WORD, chosenWish, WHATSAPP_NUMBER);
    }

    // Setup observers for Scene 5 (mirror) and Scene 6 (camera)
    if (FEST_NOTE && window.MirrorScene) {
      window.MirrorScene.setupObserver();
    }
    if (window.CameraScene) {
      window.CameraScene.setupObserver();
    }

    // Scroll to top of celebration card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Check if she previously answered (saved in localStorage)
  const savedState = window.YesScene ? window.YesScene.getSavedState() : null;

  if (savedState && savedState.answered) {
    // Return directly to the celebration & heartfelt notes
    activateCelebrationFlow(savedState.dateWord || DATE_WORD, savedState.wish || '');
    return;
  }

  // Normal Flow: Start with Scene 0
  if (window.EnvelopeScene) {
    window.EnvelopeScene.init(() => {
      // Transition from Scene 0 to Scene 1
      switchScene(scene0, scene1, () => {
        if (window.CalendarScene) {
          window.CalendarScene.play(() => {
            // "Read on" clicked in Scene 1 -> transition to Scene 2
            switchScene(scene1, scene2, () => {
              if (window.StreetScene) {
                window.StreetScene.play((userWish) => {
                  // "Ask me" clicked in Scene 2 -> transition to Scene 3
                  switchScene(scene2, scene3, () => {
                    if (window.QuestionScene) {
                      window.QuestionScene.setupInteractions((finalDay) => {
                        // Yes chosen in Scene 3 -> Cleanup and activate celebration flow!
                        window.QuestionScene.cleanup();
                        const wish = window.StreetScene ? window.StreetScene.getWish() : '';
                        activateCelebrationFlow(finalDay, wish);
                      });
                    }
                  });
                });
              }
            });
          });
        }
      });
    });
  }
});
