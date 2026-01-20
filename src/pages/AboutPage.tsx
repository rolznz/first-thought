import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh flex flex-col">
      <header className="flex items-center gap-2 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">About</h1>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-2">First Thought</h2>
            <p className="text-muted-foreground">
              A simple "choiceless awareness" meditation app.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">How it works</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Press START to begin your session</li>
              <li>Clear your mind and stay in a state of awareness</li>
              <li>
                When you realize you have been thinking about something, end the
                session
              </li>
              <li>Write down your thought to track over time</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Why?</h2>
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                Tracking your first thought helps you notice patterns in your
                mind and develop greater awareness of your mental habits.
              </p>

              <p className="text-muted-foreground">
                By understanding why certain thoughts arise, you can find ways
                to accept, resolve, and dismiss them.
              </p>
              <p className="text-muted-foreground">
                This will reduce stress, improve your sleep, and compact your
                context window.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Privacy</h2>
            <p className="text-muted-foreground">
              Your data is only saved on your device. Nothing is sent to any
              server.
            </p>
          </section>

          <section className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              100% open source on{" "}
              <a
                href="https://github.com/rolznz/first-thought"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
