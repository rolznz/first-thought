# First Thought PWA - Implementation Plan

## Overview
Build a mobile-first PWA for meditation tracking using React + TypeScript + ShadCN UI. The app tracks meditation sessions via screen lock detection (Page Visibility API).

## Tech Stack
- **Package Manager**: Yarn
- **Framework**: React 18 + TypeScript + Vite
- **UI**: ShadCN UI + Tailwind CSS
- **State**: Zustand (with localStorage persistence)
- **Routing**: React Router v6 (hash routing for GitHub Pages compatibility)
- **PWA**: vite-plugin-pwa
- **Deployment**: GitHub Pages

---

## Implementation Phases

### Phase 1: Project Setup
- [x] Initialize Vite + React + TypeScript project
- [x] Configure Tailwind CSS
- [x] Initialize ShadCN UI and add components (Button, Input, Card, Dialog)
- [x] Set up React Router with hash routing for GitHub Pages
- [x] Create folder structure and TypeScript types

### Phase 2: State Management & Persistence
- [x] Create `sessionStore.ts` - session CRUD, tag frequency tracking, localStorage persistence
- [x] Create `timerStore.ts` - timer state machine (idle → running → completed)
- [x] Create `achievementStore.ts` - milestone tracking, personal records
- [x] Create utility modules: `formatters.ts`, `achievements.ts`, `statistics.ts`

### Phase 3: Timer & Visibility API
- [x] Implement `usePageVisibility.ts` hook for screen lock detection
- [x] Implement `useTimer.ts` hook with timestamp-based duration
- [x] Build `HomePage.tsx` with START button
- [x] Build `RunningPage.tsx` with timer display
- [x] Auto-navigate to capture page when screen unlocks

### Phase 4: Post-Session Capture
- [x] Build `TagInput.tsx` with validation (trim, lowercase, no spaces) *(integrated into CapturePage)*
- [x] Build `RecentMatches.tsx` - prefix-filtered suggestions (max 5, sorted by frequency then recency) *(integrated into CapturePage)*
- [x] Implement `CapturePage.tsx` with conditional Save button display
- [x] Implement Cancel flow (discard session, return home)

### Phase 5: Achievements & Records
- [x] Define achievement milestones: 5m, 15m, 30m, 1h, 3h, 6h, 12h, 1 day
- [x] Implement period calculations (day/week/month/all-time)
- [x] Build `AchievementPage.tsx` for milestone celebrations (with Share button)
- [x] Build `NewRecordPage.tsx` for personal bests (with Share button) *(named RecordPage.tsx)*
- [x] Implement `useShare.ts` hook for privacy-safe sharing (Web Share API + fallback)
- [x] Build `SessionRecordedPage.tsx` with daily stats *(named RecordedPage.tsx)*
- [ ] Implement post-save navigation flow: Capture → Achievement → Record → Recorded → Home

### Phase 6: History Management
- [x] Build `SessionList.tsx` with `SessionCard.tsx` components *(integrated into HistoryPage)*
- [x] Build `SessionEditDialog.tsx` for edit/delete *(integrated into HistoryPage)*
- [x] Build `ClearAllDialog.tsx` with confirmation *(integrated into HistoryPage)*
- [x] Implement `HistoryPage.tsx` with stats summary

### Phase 7: PWA Configuration
- [x] Configure vite-plugin-pwa in `vite.config.ts`
- [x] Create PWA manifest with app name, icons, theme colors
- [x] Create icon assets (192x192, 512x512)
- [x] Add iOS meta tags to `index.html`
- [x] Configure offline caching with Workbox
- [x] Implement `usePWAInstall.ts` hook to capture `beforeinstallprompt` event
- [x] Build `InstallPrompt.tsx` component (banner/modal with Install + Maybe later)
- [x] Add iOS detection and instruction modal ("Tap Share → Add to Home Screen")
- [x] Track prompt dismissals in localStorage (frequency cap)

### Phase 8: GitHub Pages Deployment
- [x] Configure Vite `base` path for GitHub Pages
- [x] Create GitHub Actions workflow for automatic deployment
- [x] Test deployment and PWA installation from GitHub Pages URL

### Phase 9: Polish
- [ ] Add loading states and transitions
- [ ] Mobile-responsive adjustments
- [ ] Error boundaries
- [ ] Manual testing

---

## Key Data Models

```typescript
interface Session {
  id: string;
  startedAt: number;    // Unix timestamp
  endedAt: number;      // Unix timestamp
  durationMs: number;
  tag: string;          // Single word, lowercased
  createdAt: number;
}

interface TagFrequency {
  tag: string;
  count: number;
  lastUsedAt: number;
}

type AchievementPeriod = 'day' | 'week' | 'month' | 'allTime';
```

---

## Folder Structure

```
src/
├── components/
│   ├── ui/           # ShadCN components
│   ├── layout/       # Header, PageContainer
│   ├── timer/        # TimerDisplay, StartButton
│   ├── session/      # TagInput, RecentMatches
│   └── history/      # SessionList, SessionCard
├── pages/            # HomePage, RunningPage, CapturePage, etc.
├── stores/           # Zustand stores
├── hooks/            # usePageVisibility, useTimer, useTagSuggestions, useShare, usePWAInstall
├── lib/              # utils, formatters, achievements, statistics
└── types/            # TypeScript interfaces
```

---

## Critical Implementation Details

### Timer with Visibility API

```typescript
// Flow:
// 1. START pressed → record `startedAt` timestamp
// 2. Screen locks (visibility hidden) → record `pausedAt`
// 3. Screen unlocks (visibility visible) → calculate `durationMs = pausedAt - startedAt`, navigate to capture

const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
};
```

### Tag Suggestions Logic

```typescript
// Filter and sort logic:
const getSuggestions = (prefix: string): TagFrequency[] => {
  return tagFrequencies
    .filter(t => t.tag.startsWith(prefix.toLowerCase()))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;  // Frequency first
      return b.lastUsedAt - a.lastUsedAt;                  // Then recency
    })
    .slice(0, 5);
};

// Display rules:
// - Only show when input focused AND has ≥1 character
// - Tapping a match fills the input immediately
```

### Achievement Milestones

```typescript
const MILESTONES = [
  { id: '5m', label: '5 minutes', thresholdMs: 5 * 60 * 1000 },
  { id: '15m', label: '15 minutes', thresholdMs: 15 * 60 * 1000 },
  { id: '30m', label: '30 minutes', thresholdMs: 30 * 60 * 1000 },
  { id: '1h', label: '1 hour', thresholdMs: 60 * 60 * 1000 },
  { id: '3h', label: '3 hours', thresholdMs: 3 * 60 * 60 * 1000 },
  { id: '6h', label: '6 hours', thresholdMs: 6 * 60 * 60 * 1000 },
  { id: '12h', label: '12 hours', thresholdMs: 12 * 60 * 60 * 1000 },
  { id: '1d', label: '1 day', thresholdMs: 24 * 60 * 60 * 1000 },
];
```

### Post-Save Navigation Flow

```
Save button pressed
    ↓
Check achievements (all periods: day/week/month/all-time)
    ↓
Check for personal records
    ↓
Navigation queue:
  1. AchievementPage (if any milestones crossed)
  2. NewRecordPage (if personal best)
  3. SessionRecordedPage (always)
  4. HomePage
```

### Privacy-Safe Sharing

```typescript
// src/hooks/useShare.ts
// Uses Web Share API with fallback to clipboard

interface ShareData {
  type: 'achievement' | 'record';
  milestone?: string;      // e.g., "15 minutes"
  duration?: string;       // e.g., "3:12"
}

const useShare = () => {
  const share = async (data: ShareData) => {
    const appUrl = 'https://rolznz.github.io/first-thought/';

    // Build privacy-safe message (NO tags, NO personal data)
    const text = data.type === 'achievement'
      ? `I just unlocked the ${data.milestone} milestone on First Thought! 🧘`
      : `New personal best: ${data.duration} meditation with First Thought! 🧘`;

    const shareData = {
      title: 'First Thought',
      text,
      url: appUrl,
    };

    // Use Web Share API if available (mobile)
    if (navigator.share && navigator.canShare?.(shareData)) {
      await navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${text}\n${appUrl}`);
      // Show toast: "Copied to clipboard"
    }
  };

  return { share };
};

// PRIVACY RULES:
// ✅ Share: milestone level ("15 minutes"), duration ("3:12"), app link
// ❌ NEVER share: tags, session counts, dates, or any personal data
```

### Session Store with Persistence

```typescript
// Using Zustand with persist middleware
const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      tagFrequencies: new Map(),
      // ... CRUD operations
    }),
    {
      name: 'first-thought-sessions',
      version: 1,
    }
  )
);
```

---

## PWA Install Prompt

```typescript
// src/hooks/usePWAInstall.ts
// Captures beforeinstallprompt event and manages install flow

interface PWAInstallState {
  isInstallable: boolean;      // Can show install prompt
  isInstalled: boolean;        // Already installed (standalone mode)
  isIOS: boolean;              // iOS needs manual instructions
  promptDismissedAt: number | null;  // For frequency capping
}

const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [state, setState] = useState<PWAInstallState>({
    isInstallable: false,
    isInstalled: window.matchMedia('(display-mode: standalone)').matches,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    promptDismissedAt: localStorage.getItem('pwa-dismissed')
      ? Number(localStorage.getItem('pwa-dismissed'))
      : null,
  });

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setState(s => ({ ...s, isInstallable: true }));
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const shouldShowPrompt = () => {
    if (state.isInstalled) return false;
    if (!state.isInstallable && !state.isIOS) return false;
    if (state.promptDismissedAt && Date.now() - state.promptDismissedAt < DISMISS_COOLDOWN_MS) {
      return false;
    }
    return true;
  };

  const install = async () => {
    if (state.isIOS) {
      // Return instructions for iOS
      return { type: 'ios-instructions' as const };
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (result.outcome === 'accepted') {
        setState(s => ({ ...s, isInstalled: true, isInstallable: false }));
      }
      return { type: 'native' as const, outcome: result.outcome };
    }
    return null;
  };

  const dismiss = () => {
    const now = Date.now();
    localStorage.setItem('pwa-dismissed', String(now));
    setState(s => ({ ...s, promptDismissedAt: now }));
  };

  return { ...state, shouldShowPrompt, install, dismiss };
};
```

```typescript
// src/components/InstallPrompt.tsx
// Shown on SessionRecordedPage if installable

const InstallPrompt = () => {
  const { shouldShowPrompt, install, dismiss, isIOS } = usePWAInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  if (!shouldShowPrompt()) return null;

  const handleInstall = async () => {
    const result = await install();
    if (result?.type === 'ios-instructions') {
      setShowIOSInstructions(true);
    }
  };

  return (
    <>
      <Card className="mt-4 p-4">
        <h3 className="font-semibold">Install First Thought?</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Quick access from your home screen — start sessions with one tap — keep your history.
        </p>
        <div className="flex gap-2 mt-3">
          <Button variant="ghost" onClick={dismiss}>Maybe later</Button>
          <Button onClick={handleInstall}>Install</Button>
        </div>
      </Card>

      {/* iOS Instructions Modal */}
      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install on iOS</DialogTitle>
          </DialogHeader>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Tap the <strong>Share</strong> button in Safari</li>
            <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
            <li>Tap <strong>Add</strong> in the top right</li>
          </ol>
          <Button onClick={() => setShowIOSInstructions(false)}>Got it</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
```

---

## PWA Configuration

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/first-thought/',  // GitHub Pages repo name
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'First Thought',
        short_name: 'First Thought',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/first-thought/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/first-thought/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
});
```

---

## GitHub Pages Deployment

### Vite Configuration
Set `base` in `vite.config.ts` to match your repository name:
```typescript
export default defineConfig({
  base: '/first-thought/',  // Replace with your repo name
  // ...
});
```

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'
      - run: yarn install --frozen-lockfile
      - run: yarn build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Hash Routing for GitHub Pages
Use `HashRouter` instead of `BrowserRouter` to avoid 404s on page refresh:
```typescript
import { HashRouter } from 'react-router-dom';

// In App.tsx
<HashRouter>
  <Routes>
    {/* ... */}
  </Routes>
</HashRouter>
```

---

## Verification Checklist

- [ ] **Dev server**: `yarn dev` - app loads at localhost
- [ ] **Timer flow**: Press START → lock phone → unlock → capture page shows duration
- [ ] **Tag save**: Enter tag → see in History
- [ ] **Suggestions**: After saving multiple sessions with same tag prefix, suggestions appear
- [ ] **Achievements**: Accumulate 5+ minutes → Achievement screen triggers
- [ ] **Sharing**: Share button on Achievement/Record pages → opens native share or copies link (verify NO private data in message)
- [ ] **PWA local**: Build with `yarn build`, serve locally, install on mobile device
- [ ] **PWA install prompt**: On SessionRecorded page, install banner appears (if not already installed); dismiss respects cooldown
- [ ] **iOS install flow**: On iOS Safari, tapping Install shows manual instructions modal
- [ ] **Persistence**: Close and reopen app → data persists
- [ ] **GitHub Pages**: Push to master → auto-deploys → accessible at `https://rolznz.github.io/first-thought/`
- [ ] **PWA from GitHub Pages**: Install PWA from deployed URL on mobile device
