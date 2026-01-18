# First Thought

This is a lightweight Product Requirements Document for a mobile-first PWA called "First Thought".

It should be a Vite React app with ShadCN UI.

It must be deployed on Github Pages.

```text
Home / Start
+-------------------------------------------+
| First Thought                        [History]|
|                                           |
|  Clear your mind. Track first thoughts.|
|                                           |
|               [  START  ]                 |
|                                           |
+-------------------------------------------+
Notes:
- Single large START button centered.
- History icon/button at top-right.
- No session stats on Home (stats live in History and Session recorded).

Running (timer active; user locks screen)
+-------------------------------------------+
|                                  [History]|
|                                           |
|              00:01:23                     |
|                                           |
|   (Lock phone / turn off screen to begin) |
|                                           |
+-------------------------------------------+
Notes:
- Rely on Page Visibility API to detect screen lock/unlock.
- No on-screen stop button; provide Cancel on post-capture page.
- Use timestamp-based duration calculation (Date.now()).

Unlock / Post-session capture (immediately after unlock/visibility)
+-------------------------------------------+
|            Session complete               |
|  Duration: 00:00:34                       |
|                                           |
|  In a single word, describe the first thought that entered your mind: |
|  [ _____________ ]                        |
|                                           |
|                [Cancel]                   |
|                                           |
|  (Save button and recent matches appear   |
|   once you focus the input and type ≥1 char)|
+-------------------------------------------+
Notes:
- Save button and Recent matches hidden until user focuses the input and types ≥1 character.
- Cancel discards the recorded session (useful for accidental starts).
- Validation: single-token, trimmed, lowercased; no spaces.

Recent matches (shown after user types ≥1 char)
+-------------------------------------------+
|  Recent matches:                          |
|  1) worry         (12)                    |
|  2) todo          (9)                     |
|  3) idea          (4)                     |
|                                           |
+-------------------------------------------+
Notes:
- Show up to 5 matches filtered by prefix, case-insensitive.
- Order by frequency then recency.
- Tapping a match fills the input immediately; Save then records without extra typing.

Achievement (if new milestone crossed; shown before New Record and Session recorded)
+-------------------------------------------+
|               Achievement!                |
|  You've reached: Total time meditated — 15 min |
|                                           |
|  Level: 15 minutes unlocked ✔              |
|                                           |
|  Progress: 15 / 30 min (next)              |
|                                           |
|  [Share]  [Nice — continue]               |
+-------------------------------------------+
Notes:
- Achievements: cumulative totals for Day/Week/Month/All-time.
- Levels: 5m, 15m, 30m, 1h, 3h, 6h, 12h, 1 day.
- Show when crossing a milestone; batch multiple and show highest if desired.
- Share button shares the app with a privacy-safe message (no personal data).

New Record (if applicable; shown before Session recorded)
+-------------------------------------------+
|                New Record!                |
|  You set a new personal record: 03:12      |
|                                           |
|  Session Duration: 00:03:12  Tag: calm    |
|                                           |
|  [Share]  [Cool — continue]               |
+-------------------------------------------+
Notes:
- Trigger for personal bests (day/week/month/all-time).
- Shown after Achievement screens (if any), before final confirmation.
- Share button shares the app with a privacy-safe message (no personal data like tags).

Session recorded (after Save and after Achievement/New Record screens)
+-------------------------------------------+
|             Session recorded              |
|  Duration: 00:00:34   Tag: worry           |
|                                           |
|  Sessions today: 5                         |
|  Median duration (today): 00:48s          |
|  Best session: 03:12 (today)              |
|                                           |
|  [Done]                                   |
+-------------------------------------------+
Notes:
- Confirmation screen with concise stats for the day.
- Returns to Home on Done.

PWA Install Prompt (shown on Session recorded screen if installable)
+-------------------------------------------+
|  +-------------------------------------+  |
|  | Install First Thought?              |  |
|  |                                     |  |
|  | Quick access from your home screen  |  |
|  | — start sessions with one tap —     |  |
|  | keep your history.                  |  |
|  |                                     |  |
|  | [Maybe later]  [Install]            |  |
|  +-------------------------------------+  |
+-------------------------------------------+
Notes:
- Only show if app is installable (check beforeinstallprompt event or standalone display mode).
- Dismissible banner or modal, non-blocking.
- "Install" triggers native install flow (Android) or shows iOS instructions.
- "Maybe later" dismisses; can show again on next session (with reasonable frequency cap).
- On iOS: show brief instructions ("Tap Share → Add to Home Screen").
- Track dismissal in localStorage to avoid spamming.

History / Session List
+-------------------------------------------+
|                History                    |
|                                           |
|  2026-01-18 19:02  00:03  worry            |
|  2026-01-18 18:55  00:45  todo             |
|  2026-01-17 12:10  02:12  multiple         |
|                                           |
|  Median duration (today): 00:48s           |
|  Achievements: 15m total today             |
|                                           |
|  [Clear all]   [Back]                     |
+-------------------------------------------+
Notes:
- Scrollable list of sessions (timestamp, duration, tag).
- Shows daily median and simple achievement summary.
- Tap a row to edit/delete a session.

Sharing (privacy-safe app promotion)
+-------------------------------------------+
|  Share messages examples:                  |
|                                           |
|  Achievement: "I just unlocked the 15-min |
|  milestone on First Thought! 🧘"          |
|                                           |
|  New Record: "New personal best: 3 min    |
|  meditation with First Thought! 🧘"       |
+-------------------------------------------+
Notes:
- Use Web Share API for native mobile sharing, fallback to copy link.
- NEVER share: tags, session counts, specific dates, or any personal data.
- ONLY share: milestone levels, duration records, and app link.
- Share text should promote the app without revealing private thoughts.

Misc / Edge behavior
+-------------------------------------------+
|  If visibility events aren't detected on  |
|  this device, user can open the app and   |
|  press Cancel on the post-capture page to |
|  discard accidental sessions.             |
+-------------------------------------------+
Notes:
- Keep UX minimal and local-only.
- Must work as a PWA.
- Provide clear, fast flows to avoid doom-scrolling.
```
