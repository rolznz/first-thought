import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/running');
  };

  return (
    <div className="min-h-svh flex flex-col">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold">First Thought</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate('/history')}>
          <History className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground text-center mb-8">
          Clear your mind. Track first thoughts.
        </p>
        <Button size="lg" className="text-lg px-8 py-6" onClick={handleStart}>
          START
        </Button>
      </main>
    </div>
  );
}
