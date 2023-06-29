import "./styles.css";
import { useFoldersStore } from "@/store/foldersStore";
import { useEffect, useState } from "react";
import { Timer, usePlayerStore } from "@/store/playerStore";
import { IFile } from "@/models";
import { PlayerControls } from "@/pages/Player/PlayerControls";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Pencil } from "lucide-react";
import { useInterval } from "usehooks-ts";
import { shuffleList } from "@/utils";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

type Props = {};

export function Player({}: Props) {
  const [files, setFiles] = useState<IFile[]>([]);
  const folders = useFoldersStore((state) => state.folders);
  const shuffle = usePlayerStore((state) => state.shuffle);
  const setShuffle = usePlayerStore((state) => state.setShuffle);

  useEffect(() => {
    const flatFiles = folders.map((item) => item.files).flat();
    if (shuffle.isShuffle) {
      const randomSeed = Math.floor(Math.random() * 10000 + 1);
      setFiles(shuffleList(flatFiles, shuffle.seed || randomSeed));
      // if there is no existing shuffle seed save the new one
      if (!shuffle.seed) {
        setShuffle({
          isShuffle: true,
          seed: randomSeed,
        });
      }
    } else {
      setFiles(flatFiles);
    }
  }, [folders, shuffle.isShuffle]);

  return (
    <div>
      <div>
        <Countdown filesLength={files.length} />
        {files.length && <DisplayedImage files={files} />}
        <PlayerControls filesLength={files.length} />
      </div>
    </div>
  );
}

function DisplayedImage({ files }: { files: IFile[] }) {
  const index = usePlayerStore((state) => state.index);

  return (
    <Avatar>
      <AvatarImage
        src={files[index].path}
        className="mx-auto object-contain max-w-full h-screen fade-in animate-in duration-700"
      />
      <AvatarFallback
        delayMs={200}
        className="flex justify-center items-center h-screen"
      >
        <Pencil className="animate-spin" />
      </AvatarFallback>
    </Avatar>
  );
}

function convertInputToSecondsNumber(intervalInput: Timer) {
  const lastInputChar = intervalInput[intervalInput.length - 1].toLowerCase();
  if (typeof lastInputChar === "string" && lastInputChar === "m") {
    // convert minutes to seconds
    return parseInt(intervalInput, 10) * 60;
  }
  // seconds is default
  return parseInt(intervalInput, 10);
}

function Countdown({ filesLength }: { filesLength: number }) {
  // The counter
  const interval = usePlayerStore((state) => state.timer);
  const [count, setCount] = useState<number>(
    convertInputToSecondsNumber(interval)
  );
  // ON/OFF
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const nextIndex = usePlayerStore((state) => state.nextIndex);
  const index = usePlayerStore((state) => state.index);

  const resetCounter = () => {
    setCount(convertInputToSecondsNumber(interval));
  };

  useInterval(
    () => {
      // Your custom logic here
      if (count === 0) {
        resetCounter();
        // if last image
        if (filesLength === index) return;
        nextIndex();
        return;
      }
      setCount(count - 1);
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? 1000 : null
  );

  useEffect(() => {
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    resetCounter();
  }, [index]);

  return (
    // <div className="absolute right-0 top-0 text-white p-4 backdrop-blur-sm bg-slate-600/50 rounded-es-lg">
    //   <span className="countdown">
    //     {/* typescript doesn't like --value so ignore */}
    //     {/* @ts-ignore */}
    //     <span style={{ "--value": count }}></span>
    //   </span>
    // </div>
    <CountdownCircleTimer
      isPlaying={isPlaying}
      duration={convertInputToSecondsNumber(interval)}
      colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
      colorsTime={[7, 5, 2, 0]}
      onComplete={() => {
        return { shouldRepeat: true, delay: 1 };
      }}
    >
      {({ remainingTime }) => <>{remainingTime}</>}
    </CountdownCircleTimer>
  );
}
