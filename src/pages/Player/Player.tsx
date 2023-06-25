import "./styles.css";
import { useFoldersStore } from "@/store/foldersStore";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Timer, usePlayerStore } from "@/store/playerStore";
import { IFile } from "@/types";
import { PlayerControls } from "@/pages/Player/PlayerControls";
import { useInterval } from "usehooks-ts";

type Props = {};

export function Player({}: Props) {
  const files = useFoldersStore((state) => state.folders)
    .map((item) => item.files)
    .flat();
  return (
    <div>
      <div className="relative overflow-y-hidden flex justify-center h-screen w-fit mx-auto">
        <Countdown filesLength={files.length} />
        <DisplayedImage files={files} />
        <PlayerControls filesLength={files.length} />
      </div>
    </div>
  );
}

function DisplayedImage({ files }: { files: IFile[] }) {
  const index = usePlayerStore((state) => state.index);
  return (
    <img
      className="mx-auto object-contain max-w-full"
      src={convertFileSrc(files?.[index]?.path)}
    />
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
    <div className="absolute right-0 top-0 text-white p-4 backdrop-blur-sm bg-slate-600/50 rounded-es-lg">
      <span className="countdown">
        {/* typescript doesn't like --value so ignore */}
        {/* @ts-ignore */}
        <span style={{ "--value": count }}></span>
      </span>
    </div>
  );
}
