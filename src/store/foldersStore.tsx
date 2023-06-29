import { IFile, IFolder } from "@/models";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface FileStore {
  folders: IFolder[];
  files: IFile[];
  addFolder: (folder: IFolder) => void;
  // setFiles: (files: IFile[]) => void;
  setFolders: (files: IFolder[]) => void;
  deleteFolder: (id: string) => void;
}

export const useFoldersStore = create<FileStore>()(
  subscribeWithSelector((set) => ({
    folders: [],
    files: [],
    setFolders: (folders) => set({ folders }),
    addFolder: (folder) =>
      set((state) => {
        return {
          folders: [...state.folders, folder],
        };
      }),
    deleteFolder: (id) =>
      set((state) => {
        return {
          folders: state.folders.filter((item) => item.id !== id),
        };
      }),
  }))
);
