import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function InstallPrompt() {
  const { shouldShowPrompt, install, dismiss } = usePWAInstall();
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
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Install First Thought?</CardTitle>
          <CardDescription>
            Quick access from your home screen — start sessions with one tap — keep your history.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="ghost" onClick={dismiss}>
            Maybe later
          </Button>
          <Button onClick={handleInstall}>
            Install
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install on iOS</DialogTitle>
          </DialogHeader>
          <ol className="list-decimal list-inside space-y-2 text-sm py-4">
            <li>Tap the <strong>Share</strong> button in Safari</li>
            <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
            <li>Tap <strong>Add</strong> in the top right</li>
          </ol>
          <Button onClick={() => setShowIOSInstructions(false)}>
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
