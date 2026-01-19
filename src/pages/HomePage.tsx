import natureLoader from "@/assets/animations/nature_loader.lottie.txt";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/hooks/useTimer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();
  const { start } = useTimer();

  const handleStart = () => {
    start();
    navigate("/running");
  };

  return (
    <div className="min-h-svh flex flex-col">
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <DotLottieReact
          src={natureLoader}
          loop
          autoplay
          speed={0.5}
          //className="absolute -z-10 flex-1"
        />
      </div>
      <header className="flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold">First Thought</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/history")}
        >
          <History className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* <p className="text-muted-foreground text-center mb-8">
          First Thought is a simple "choiceless awareness" meditation app.
        </p>
        <p className="text-muted-foreground text-center mb-8">
          Clear your mind and return once a thought appears.
        </p>
        <p className="text-muted-foreground text-center mb-8">
          Write your thoughts down to track over time.
        </p> */}
        <div className="flex items-center justify-center">
          <Button size="lg" className="text-lg px-8 py-6" onClick={handleStart}>
            START
          </Button>
        </div>
      </main>
    </div>
  );
}
