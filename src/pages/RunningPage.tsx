import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useTimer } from "@/hooks/useTimer";
import { formatDuration } from "@/lib/formatters";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const instructions = [
  "Clear your mind",
  "Lock phone / turn off screen",
  "Return once you have a compelling thought",
  "Touch grass",
];

export function RunningPage() {
  const navigate = useNavigate();
  const { status, elapsedMs, startedAt, complete } = useTimer();
  const isVisible = usePageVisibility();
  const wasHidden = useRef(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInstructionIndex(
        (current) => (current + 1) % instructions.length,
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Redirect to home if timer isn't running
  useEffect(() => {
    if (status === "idle") {
      navigate("/");
    }
  }, [status, navigate]);

  // Track visibility changes
  useEffect(() => {
    if (status !== "running") return;

    if (!isVisible) {
      // Screen locked / tab hidden
      wasHidden.current = true;
    } else if (wasHidden.current && isVisible) {
      // Screen unlocked / tab visible again
      wasHidden.current = false;
      complete();
      navigate("/capture");
    }
  }, [isVisible, status, complete, navigate]);

  // If timer was started and is now completed, navigate to capture
  useEffect(() => {
    if (status === "completed" && startedAt) {
      navigate("/capture");
    }
  }, [status, startedAt, navigate]);

  return (
    <div className="min-h-svh flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="text-6xl font-mono mb-8">{formatDuration(elapsedMs)}</p>
        <p className="text-muted-foreground text-center text-sm animate-pulse">
          {instructions[currentInstructionIndex]}
        </p>
      </main>
    </div>
  );
}
