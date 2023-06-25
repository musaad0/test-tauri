import { IFolder } from "@/types";
import { create } from "zustand";

export type Timer = `${number}${"m" | "s"}`;

interface IFileStore {
  timer: Timer;
  index: number;
  isPlaying: boolean;
  setTimer: (val: Timer) => void;
  setIsPlaying: (val: boolean) => void;
  nextIndex: () => void;
  previousIndex: () => void;
}

export const usePlayerStore = create<IFileStore>((set) => ({
  timer: "30s",
  index: 0,
  isPlaying: false,
  setTimer: (val: Timer) =>
    set(() => {
      return {
        timer: val,
      };
    }),
  nextIndex: () =>
    set((state) => {
      return {
        index: state.index + 1,
      };
    }),
  previousIndex: () =>
    set((state) => {
      return {
        index: state.index - 1,
      };
    }),
  setIsPlaying: (val: boolean) =>
    set(() => {
      return {
        isPlaying: val,
      };
    }),
}));
