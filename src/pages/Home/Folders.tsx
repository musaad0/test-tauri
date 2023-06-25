import { open } from "@tauri-apps/api/dialog";
import { type FileEntry, readDir } from "@tauri-apps/api/fs";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import { nanoid } from "nanoid";
import { basename } from "@tauri-apps/api/path";
import { Button } from "@/components";
import { Trash2Icon, UploadCloudIcon } from "lucide-react";
import { useFoldersStore } from "@/store/foldersStore";
import { o } from "@tauri-apps/api/dialog-20ff401c";

type Props = {};

let files: {
  name: string;
  path: string;
}[] = [];

function processEntries(entries: FileEntry[]) {
  for (const entry of entries) {
    if (entry.children) {
      processEntries(entry.children);
    } else if (entry.name) {
      files.push({
        name: entry.name,
        path: entry.path,
      });
    }
  }
}

const addFolder = useFoldersStore.getState().addFolder;

async function openFileDialog() {
  const selected = await open({
    directory: true,
    multiple: true,
    // to bypass a bug on tauri that allows files to be uploaded
    filters: [
      {
        name: "fileBug",
        extensions: [],
      },
    ],
  });
  if (Array.isArray(selected)) {
    // user selected multiple files
    for (let i = 0; i < selected.length; i++) {
      files = [];
      const folderName = await basename(selected[i]);
      const entries = await readDir(selected[i], { recursive: true });
      processEntries(entries);
      addFolder({
        name: folderName,
        path: selected[i],
        id: nanoid(),
        files: files,
      });
    }
    // return folders;
  } else if (selected === null) {
    // user cancelled the selection
  } else {
    // user selected a single file
    // user woudn't/shouldn't be able to do that
  }
}

export default function Folders({}: Props) {
  return (
    <>
      <Button
        className="w-full"
        onClick={async () => {
          await openFileDialog();
          //   setImages(convertFileSrc(selectedFolders[0]));
        }}
      >
        Upload File
        <UploadCloudIcon className="w-4 h-4 ms-2" />
      </Button>
      <FoldersTable />
    </>
  );
}

function FoldersTable() {
  const folders = useFoldersStore((state) => state.folders);
  const deleteFolder = useFoldersStore((state) => state.deleteFolder);
  const [parent] = useAutoAnimate();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-6 border-t border-gray-100">
        {/* Mimick a table because animating table causes issues with useAutoAnimate */}
        <dl ref={parent} className="divide-y divide-gray-100">
          {folders.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 gap-4 text-sm"
            >
              <div className="flex justify-between w-72 items-center">
                <dt className="font-medium text-primary truncate overflow-hidden w-40">
                  {item.name}
                </dt>
                <dd className="">{item.files.length}</dd>
              </div>
              <Button
                variant={"ghost"}
                onClick={() => {
                  deleteFolder(item.id);
                }}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center justify-between py-2 gap-4 text-sm">
            <div className="flex justify-between w-72 items-center">
              <dt className="font-medium text-primary truncate overflow-hidden w-40">
                Total
              </dt>
              <dd className="">
                {folders.reduce((sum, li) => sum + li.files.length, 0)}
              </dd>
            </div>
            <div className={"h-10 px-4 py-2"}>
              <div className="w-4 h-4" />
            </div>
          </div>
        </dl>

        {/* 
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table ref={parent} className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Folder
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Num.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {folders?.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-pre-wrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.files.length}
                    </td>
                    <td className=" text-sm text-gray-500">
                      <Button
                        variant={"ghost"}
                        onClick={() => {
                          deleteFolder(item.id);
                        }}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th
                    scope="row"
                    className="pl-4 pr-3 pt-6 text-sm text-left font-normal text-gray-500 sm:table-cell sm:pl-0"
                  >
                    Total
                  </th>
                  <td className="pl-3 pr-6 pt-6 text-left text-sm text-gray-500 sm:pr-0">
                    {folders.reduce((sum, li) => sum + li.files.length, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div> */}
      </div>
    </div>
  );
}
