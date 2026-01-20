import natureLoader from "@/assets/animations/nature_loader.lottie.txt";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/hooks/useTimer";
import { useSessionStore } from "@/stores/sessionStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { History, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();
  const { start } = useTimer();
  const [loaded, setLoaded] = useState(false);

  const handleStart = () => {
    if (useSessionStore.getState().isExampleData) {
      useSessionStore.getState().clearAllSessions();
    }
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
          dotLottieRefCallback={(dotLottie) => {
            if (dotLottie) {
              dotLottie.addEventListener("play", () => setLoaded(true));
            }
          }}
          //className="absolute -z-10 flex-1"
        />
      </div>
      {loaded && (
        <header className="flex justify-between items-center p-4">
          <h1 className="text-xl font-semibold">First Thought</h1>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/about")}
            >
              <Lightbulb className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/history")}
            >
              <History className="h-5 w-5" />
            </Button>
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-center">
          {loaded && (
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={handleStart}
            >
              START
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
