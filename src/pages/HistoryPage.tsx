import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh flex flex-col">
      <header className="flex items-center gap-2 p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">History</h1>
      </header>

      <main className="flex-1 p-4">
        <p className="text-muted-foreground text-center">No sessions yet.</p>
      </main>

      <footer className="p-4 flex gap-2">
        <Button variant="outline" className="flex-1">Clear all</Button>
        <Button variant="ghost" className="flex-1" onClick={() => navigate('/')}>Back</Button>
      </footer>
    </div>
  );
}
