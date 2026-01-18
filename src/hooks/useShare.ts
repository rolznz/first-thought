interface ShareData {
  type: 'achievement' | 'record';
  milestone?: string;
  duration?: string;
}

export function useShare() {
  const share = async (data: ShareData): Promise<{ success: boolean; method: 'native' | 'clipboard' }> => {
    const appUrl = 'https://rolznz.github.io/first-thought/';

    const text = data.type === 'achievement'
      ? `I just unlocked the ${data.milestone} milestone on First Thought!`
      : `New personal best: ${data.duration} meditation with First Thought!`;

    const shareData = {
      title: 'First Thought',
      text,
      url: appUrl,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return { success: true, method: 'native' };
      }
    } catch (error) {
      // User cancelled or share failed
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, method: 'native' };
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${text}\n${appUrl}`);
      return { success: true, method: 'clipboard' };
    } catch {
      return { success: false, method: 'clipboard' };
    }
  };

  return { share };
}
