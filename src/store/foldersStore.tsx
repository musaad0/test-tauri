import { IFile, IFolder } from "@/types";
import { create } from "zustand";

interface IFileStore {
  folders: IFolder[];
  files: IFile[];
  addFolder: (folder: IFolder) => void;
  setFiles: (files: IFile[]) => void;
  deleteFolder: (id: string) => void;
}

export const useFoldersStore = create<IFileStore>((set) => ({
  folders: [],
  files: [],
  setFiles: (files) =>
    set((state) => {
      return {
        files: files,
      };
    }),
  addFolder: (folder) =>
    set((state) => {
      return {
        folders: [...state.folders, folder],
      };
    }),
  deleteFolder: (id: string) =>
    set((state) => {
      return {
        folders: state.folders.filter((item) => item.id !== id),
      };
    }),
}));
