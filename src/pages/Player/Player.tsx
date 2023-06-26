import "./styles.css";
import { useFoldersStore } from "@/store/foldersStore";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Timer, usePlayerStore } from "@/store/playerStore";
import { IFile } from "@/types";
import { PlayerControls } from "@/pages/Player/PlayerControls";
import { useIntersectionObserver, useInterval } from "usehooks-ts";
import { normalize } from "@tauri-apps/api/path";
import { cn } from "@/utils";
import { AvatarImage, Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { LoaderIcon, Pen } from "lucide-react";
import { RowVirtualizerDynamicWindow } from "@/pages/Player/VirtualImageList";

type Props = {};

export function Player({}: Props) {
  const files = useFoldersStore((state) => state.folders)
    .map((item) => item.files)
    .flat();
  return (
    <div>
      <div>
        {/* <div className="relative overflow-y-hidden flex justify-center h-screen w-fit mx-auto"> */}
        <Countdown filesLength={files.length} />
        <RowVirtualizerDynamicWindow files={files} />

        {/* <DisplayedImage files={files} /> */}
        <PlayerControls filesLength={files.length} />
      </div>
    </div>
  );
}

function DisplayedImage({ files }: { files: IFile[] }) {
  const index = usePlayerStore((state) => state.index);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const ref = useRef<HTMLImageElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  const [loaded, setLoaded] = React.useState<boolean[]>([]);

  React.useEffect(() => {
    const new_loaded = [...loaded];
    new_loaded[currentSlide] = true;
    setLoaded(new_loaded);
  }, [currentSlide]);

  useEffect(() => {
    setCurrentSlide(index);
  }, [index]);

  return (
    <Avatar>
      <AvatarImage
        ref={ref}
        onLoadingStatusChange={(status) => {
          // status === ''
        }}
        className={cn(
          "mx-auto object-contain max-w-full h-screen ",
          isVisible ? "animate-in fade-in-75 duration-500" : ""
        )}
        src={convertFileSrc(files?.[index]?.path)}
      />
      <AvatarFallback
        delayMs={100}
        className="flex h-full w-screen items-center justify-center"
      >
        <Pen className="animate-spin" />
      </AvatarFallback>

      {/* <img
        className={cn(
          "mx-auto object-contain max-w-full",
          !loaded[index] ? "blur-3xl opacity-10" : ""
        )}
        // src={loaded[index] ? convertFileSrc(files?.[index]?.path) : ""}
        src={convertFileSrc(files?.[index]?.path)}
      /> */}
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
    <div className="absolute right-0 top-0 text-white p-4 backdrop-blur-sm bg-slate-600/50 rounded-es-lg">
      <span className="countdown">
        {/* typescript doesn't like --value so ignore */}
        {/* @ts-ignore */}
        <span style={{ "--value": count }}></span>
      </span>
    </div>
  );
}
