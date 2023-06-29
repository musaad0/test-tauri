import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/components";
import { usePlayerStore } from "@/store/playerStore";
import { Pause, Play, Square, StepBack, StepForward } from "lucide-react";
import { useNavigate } from "@/hooks";
import React, { ReactNode } from "react";
import { useFoldersStore } from "@/store/foldersStore";
import { storeSessionData } from "@/store/store";

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
        <EndSessionDialog
          button={
            <PlayerControlButton
              onClick={() => {}}
              icon={<Square className="w-4 h-4" />}
            />
          }
        />
      </div>
    </div>
  );
}

interface PlayerControlButton {
  icon: ReactNode;
  onClick: () => void;
}

const PlayerControlButton = React.forwardRef<
  HTMLButtonElement,
  PlayerControlButton
>(({ onClick, icon }, ref) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex flex-col items-center justify-center px-5 hover:bg-primary-foreground/10 group text-primary-foreground/70 hover:text-primary-foreground/80 transition-colors"
    >
      {icon}
    </button>
  );
});

function EndSessionDialog({ button }: { button: ReactNode }) {
  const folders = useFoldersStore((state) => state.folders);
  const index = usePlayerStore((state) => state.index);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const navigate = useNavigate();

  const handleSave = () => {
    storeSessionData({
      folders: folders.map((item) => item.path),
      index,
      shuffle,
    });
    navigate("/");
  };

  const handleSavedIndex = () => {
    // setIndex(initialIndex);
    navigate("/");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Save & Quit ?</DialogTitle>
          <DialogDescription>
            You can save your current progress and continue later
          </DialogDescription>
        </DialogHeader>
        <div></div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
