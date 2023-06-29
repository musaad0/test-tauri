import { IFolder, Shuffle } from "@/models";
import { create } from "zustand";

export type Timer = `${number}${"m" | "s"}`;

interface FileStore {
  timer: Timer;
  index: number;
  isPlaying: boolean;
  shuffle: Shuffle;
  setTimer: (val: Timer) => void;
  setIsPlaying: (val: boolean) => void;
  setShuffle: (val: Shuffle) => void;
  nextIndex: () => void;
  setIndex: (index: number) => void;
  previousIndex: () => void;
}

export const usePlayerStore = create<FileStore>((set) => ({
  timer: "30s",
  index: 0,
  isPlaying: false,
  shuffle: {
    isShuffle: false,
    seed: 0,
  },
  setShuffle: (val) =>
    set((state) => {
      return {
        shuffle: {
          ...state.shuffle,
          ...val,
        },
      };
    }),
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
  setIndex: (index) =>
    set(() => {
      return {
        index: index,
      };
    }),
  previousIndex: () =>
    set((state) => {
      return {
        index: state.index - 1,
      };
    }),
  setIsPlaying: (val) =>
    set(() => {
      return {
        isPlaying: val,
      };
    }),
}));
