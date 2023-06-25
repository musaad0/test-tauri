import { usePlayerStore } from "@/store/playerStore";
import {
  ArrowLeft,
  Home,
  LucideIcon,
  Pause,
  Play,
  StepBack,
  StepForward,
} from "lucide-react";
import React, { ReactNode } from "react";

type Props = {
  filesLength: number;
};

export function PlayerControls({ filesLength }: Props) {
  const nextIndex = usePlayerStore((state) => state.nextIndex);
  const previousIndex = usePlayerStore((state) => state.previousIndex);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const index = usePlayerStore((state) => state.index);

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-7 bg-primary/60 backdrop-blur-sm  opacity-0 hover:opacity-100 transition-opacity">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        <PlayerControlButton
          onClick={() => {
            if (index === 0) return;
            previousIndex();
          }}
          icon={<StepBack className="w-4 h-4" />}
        />
        <PlayerControlButton
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
          icon={
            isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )
          }
        />
        <PlayerControlButton
          onClick={() => {
            if (index + 1 === filesLength) return;
            nextIndex();
          }}
          icon={<StepForward className="w-4 h-4" />}
        />
      </div>
    </div>
  );
}

function PlayerControlButton({
  icon,
  onClick,
}: {
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex flex-col items-center justify-center px-5 hover:bg-primary-foreground/10 group text-primary-foreground/70 hover:text-primary-foreground/80 transition-colors"
    >
      {icon}
    </button>
  );
}
