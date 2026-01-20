import type { TagFrequency } from "@/types";
import { useMemo } from "react";

interface HistoryWordCloudProps {
  tagFrequencies: TagFrequency[];
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// Simple seeded random for consistent positioning
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

export function HistoryWordCloud({ tagFrequencies }: HistoryWordCloudProps) {
  const words = useMemo(() => {
    if (tagFrequencies.length === 0) return [];

    const maxCount = Math.max(...tagFrequencies.map((t) => t.count));
    const minCount = Math.min(...tagFrequencies.map((t) => t.count));
    const range = maxCount - minCount || 1;

    // Shuffle array for variety while keeping positions stable
    const shuffled = [...tagFrequencies].sort((a, b) => {
      const randA = seededRandom(a.tag)();
      const randB = seededRandom(b.tag)();
      return randA - randB;
    });

    return shuffled.map((tf, index) => {
      const rand = seededRandom(tf.tag + index);

      // Calculate size based on frequency (0.85rem to 2.25rem)
      const normalized = (tf.count - minCount) / range;
      const fontSize = 0.85 + normalized * 1.4;

      // Small random rotation (-8 to 8 degrees) for visual interest
      const rotation = (rand() - 0.5) * 16;

      // Assign color
      const color = COLORS[index % COLORS.length];

      return {
        tag: tf.tag,
        count: tf.count,
        fontSize,
        color,
        rotation,
        opacity: 0.8 + normalized * 0.2,
      };
    });
  }, [tagFrequencies]);

  if (tagFrequencies.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">No tags yet.</p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 w-full min-h-[40vh] p-6 rounded-lg bg-neutral-50">
      {words.map((word) => (
        <span
          key={word.tag}
          className="px-2 py-1 rounded-md transition-transform hover:scale-110 cursor-default whitespace-nowrap"
          style={{
            fontSize: `${word.fontSize}rem`,
            color: word.color,
            opacity: word.opacity,
            transform: `rotate(${word.rotation}deg)`,
          }}
          title={`${word.tag}: ${word.count} session${word.count !== 1 ? "s" : ""}`}
        >
          {word.tag}
        </span>
      ))}
    </div>
  );
}
