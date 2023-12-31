import { useFoldersStore } from "@/store/foldersStore";
import { IFile } from "@/models";
import { basename, extname } from "@tauri-apps/api/path";
import { readDir, type FileEntry } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { nanoid } from "nanoid";

let files: IFile[] = [];

const allowedExts = ["jpg", "jpeg", "png", "gif", "avif", "apng", "webp"];

async function processEntries(entries: FileEntry[]) {
  for (const entry of entries) {
    if (entry.children) {
      await processEntries(entry.children);
    } else if (entry.name) {
      const ext = await extname(entry.name);
      if (allowedExts.includes(ext)) {
        files.push({
          name: entry.name,
          path: convertFileSrc(entry.path),
        });
      }
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
    await processEntries(entries);
    addFolder({
      name: folderName,
      path: foldersPaths[i],
      id: nanoid(),
      files: files,
    });
  }
}
