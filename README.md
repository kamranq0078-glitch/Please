# Saturday? — A Date Invitation for Ainain

A private, warm, animated invitation from **Kamran** to **Ainain**, featuring an impossible-to-press "No" button, custom SVG illustrations, responsive animations, and WhatsApp integration.

---

## 🌹 Overview of the Experience

1. **Scene 0: Knock knock** — An evening envelope drops onto a shelf, gives two knocks, and unseals upon tapping the gold wax seal.
2. **Scene 1: You're right** — Sincere and quiet. A wall calendar flips in the breeze, settling on Saturday with a hand-drawn golden ring drawing itself around the day.
3. **Scene 2: Wherever you wish** — A pastel shopping street illustration where shopping bags drop onto a bench one by one as the text unfolds. The bag counter ticks up from 1 to $\infty$. Features tappable wish chips and custom text input.
4. **Scene 3: The question (The Star)** — *"Ainain, will you go on a date with me this Saturday?"*
   - **Yes** is warm, gently pulsing, and grows subtly with each dodge.
   - **No** is the shy one: it hops away with springy cartoon squash-and-stretch timing on mouse proximity, touch, or pointerdown. It never leaves the safe card boundaries and never overlaps Yes.
   - Reaction speech tags appear in order (*Nice try.* $\rightarrow$ *Hehe. Nope.* $\rightarrow$ *It's very shy, give it a minute.* $\rightarrow$ *It left a note: "gone to get chai."* $\rightarrow$ *It's flying away now. Bye, No!*).
   - On the 5th attempt, No floats up and away on a tiny balloon, replaced by **Obviously yes.**
   - After the 3rd dodge, a gentle escape option appears: *"Saturday doesn't work? Pick another day"*, allowing her to choose any day of the week (which still counts as a Yes!).
5. **Scene 4: The Yes** — Golden lanterns float upward, soft rose petals drift down, and celebration confetti bursts. Tapping **Tell Kamran** opens WhatsApp with a prefilled message.
6. **Scene 5: The P.S.** — A handwritten paper note pinned beside an illustrated vanity mirror. Bulbs switch on one by one with a warm filament flicker, the dress sways, and a lipstick rolls out and draws a star on the glass.
7. **Scene 6: The P.P.S. & Closing** — An instant camera on the ledge. Tapping **Send me a photo** flashes the camera, ejects a polaroid that develops into a warm watercolor sunrise glow, and opens WhatsApp. Concludes with Kamran's handwritten signature.

---

## 🚀 How to Preview Locally

No build tools or node modules are required—it is pure vanilla HTML, CSS, and JavaScript.

### Option 1: Python 3 (Recommended)
Open a terminal in the project directory and run:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` on your computer or phone.

### Option 2: Node.js `serve` / `http-server`
```bash
npx serve .
```

### Option 3: Direct File Opening
You can double-click `index.html` to open it in any modern browser.

---

## ⚙️ Configuration (Setting WhatsApp Number & Date Word)

At the very top of `scripts/main.js`, you'll find the configuration settings:

```javascript
const WHATSAPP_NUMBER = '919622450753';   // Country code, no '+' (e.g., 91 for India)
const DATE_WORD = 'Saturday';             // Used throughout the copy
const FEST_NOTE = true;                   // Set to false if you ever wish to hide Scene 5
```

- **Changing the Date:** Updating `DATE_WORD` automatically updates the calendar, the question heading, the Yes celebration, and the closing signature.
- **WhatsApp Fallback:** If `WHATSAPP_NUMBER` is cleared (`''`), the button automatically switches to a quiet fallback: *"Screenshot this and send it to Kamran."*

---

## 🎨 How to Tune the "No" Button

All mechanics for the shy No button are located in `scripts/scenes/question.js`:

1. **Changing Speech Tag Lines:**
   Edit the array `speechLines` in `scripts/scenes/question.js`:
   ```javascript
   const speechLines = [
     'Nice try.',
     'Hehe. Nope.',
     'It’s very shy, give it a minute.',
     'It left a note: “gone to get chai.”',
     'It’s flying away now. Bye, No!'
   ];
   ```
2. **Proximity Trigger Distance:**
   In `handlePointerProximity()`, the threshold is set to `72` pixels:
   ```javascript
   if (dist < 72) {
     dodgeNoButton();
   }
   ```
   Increase to `90` for earlier evasions, or reduce to `55` if you want her to get slightly closer.
3. **Number of Dodges Before Balloon:**
   In `dodgeNoButton()`, change `if (dodgeCount >= 5)` to adjust how many times she can try before the balloon takes it away.

---

## 🔒 Sharing Privately with Ainain

The site has `<meta name="robots" content="noindex, nofollow">` to prevent search engine indexing.

To share it as a private, unguessable link:

### Option A: Vercel (Fast & Free)
1. Install the Vercel CLI or drag and drop this folder onto [vercel.com](https://vercel.com).
2. Assign a custom, random unguessable URL slug (e.g., `for-ainain-7x9q.vercel.app`).
3. Send the link directly to her with your personal opening message.

### Option B: Netlify Drop (Zero Setup)
1. Visit [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this folder into the browser.
3. It will generate a live URL like `fluffy-serendipity-a1b2c3.netlify.app`.
4. (Optional) Rename the site name in Netlify settings to a private passphrase.

---

## ♿ Accessibility & Reduced Motion

- **Touch and Mouse Parity:** Pointer events and `touchstart` prevent default touch delays and immediately trigger dodges on mobile.
- **Keyboard Navigation:** If the No button receives focus via `Tab`, it blurs, springs away, focuses the Yes button, and reads an `aria-live` announcement: *"This button is shy. Yes is right here."*
- **Reduced Motion:** If `prefers-reduced-motion` is enabled in the user's OS:
  - The No button stays in place, styled muted with `aria-disabled="true"` and labeled *No (too shy today)*.
  - Tapping it shows the reaction speech lines without moving.
  - Camera flash is disabled and replaced by a soft fade.
  - Canvas particles are simplified.
- **Persistence:** Her answer, chosen day, and wish are safely saved in `localStorage` inside `try/catch`. If she refreshes or returns, the site loads straight to the celebration and handwritten notes.
