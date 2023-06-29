import { useFoldersStore } from "@/store/foldersStore";
import { IFile } from "@/models";
import { basename } from "@tauri-apps/api/path";
import { readDir, type FileEntry } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { nanoid } from "nanoid";

let files: IFile[] = [];

function processEntries(entries: FileEntry[]) {
  for (const entry of entries) {
    if (entry.children) {
      processEntries(entry.children);
    } else if (entry.name) {
      files.push({
        name: entry.name,
        path: convertFileSrc(entry.path),
      });
    }
  }
}

const addFolder = useFoldersStore.getState().addFolder;

export async function getFilesRecursivelyThenStore(foldersPaths: string[]) {
  if (!foldersPaths) return;
  for (let i = 0; i < foldersPaths.length; i++) {
    files = [];
    const folderName = await basename(foldersPaths[i]);
    const entries = await readDir(foldersPaths[i], { recursive: true });
    processEntries(entries);
    addFolder({
      name: folderName,
      path: foldersPaths[i],
      id: nanoid(),
      files: files,
    });
  }
}
