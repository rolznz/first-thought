import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

export function RunningPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh flex flex-col">
      <header className="flex justify-end items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/history')}>
          <History className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="text-6xl font-mono mb-8">00:00:00</p>
        <p className="text-muted-foreground text-center text-sm">
          Lock phone / turn off screen to begin
        </p>
      </main>
    </div>
  );
}
