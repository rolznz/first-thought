import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CapturePage() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-svh flex flex-col p-4">
      <main className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-2">Session complete</h2>
        <p className="text-muted-foreground mb-8">Duration: 00:00:00</p>

        <p className="text-center mb-4 max-w-xs">
          In a single word, describe the first thought that entered your mind:
        </p>

        <Input
          type="text"
          placeholder="Enter a word..."
          className="max-w-xs mb-4"
        />

        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </main>
    </div>
  );
}
