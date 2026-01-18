import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  promptDismissedAt: number | null;
}

const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

// Global state to capture beforeinstallprompt before React mounts
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
let globalPromptCaptured = false;

// Set up global listener immediately (runs when module is imported)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    globalPromptCaptured = true;
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => globalDeferredPrompt
  );
  const [state, setState] = useState<PWAInstallState>(() => ({
    isInstallable: globalPromptCaptured,
    isInstalled: window.matchMedia('(display-mode: standalone)').matches,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    promptDismissedAt: localStorage.getItem('pwa-dismissed')
      ? Number(localStorage.getItem('pwa-dismissed'))
      : null,
  }));

  useEffect(() => {
    // Handle case where event fires after hook mounts
    const handler = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
      globalPromptCaptured = true;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState(s => ({ ...s, isInstallable: true }));
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handler = (e: MediaQueryListEvent) => {
      setState(s => ({ ...s, isInstalled: e.matches }));
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const shouldShowPrompt = (): boolean => {
    if (state.isInstalled) return false;
    if (!state.isInstallable && !state.isIOS) return false;
    if (state.promptDismissedAt && Date.now() - state.promptDismissedAt < DISMISS_COOLDOWN_MS) {
      return false;
    }
    return true;
  };

  const install = async (): Promise<{ type: 'native' | 'ios-instructions'; outcome?: string } | null> => {
    if (state.isIOS) {
      return { type: 'ios-instructions' };
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      setDeferredPrompt(null);

      if (result.outcome === 'accepted') {
        setState(s => ({ ...s, isInstalled: true, isInstallable: false }));
      }

      return { type: 'native', outcome: result.outcome };
    }

    return null;
  };

  const dismiss = () => {
    const now = Date.now();
    localStorage.setItem('pwa-dismissed', String(now));
    setState(s => ({ ...s, promptDismissedAt: now }));
  };

  return {
    ...state,
    shouldShowPrompt,
    install,
    dismiss,
  };
}
