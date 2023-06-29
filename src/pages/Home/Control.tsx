import { getFilesRecursivelyThenStore } from "@/apis/files";
import { Button } from "@/components";
import { Toggle } from "@/components/ui/toggle";
import { useFoldersStore } from "@/store/foldersStore";
import { usePlayerStore } from "@/store/playerStore";
import { getSessionData } from "@/store/store";
import { Pen, Shuffle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

type Props = {};

export default function Control({}: Props) {
  const navigate = useNavigate();
  const files = useFoldersStore((state) => state.folders)
    .map((item) => item.files)
    .flat();
  const setFolders = useFoldersStore((state) => state.setFolders);
  const setIndex = usePlayerStore((state) => state.setIndex);
  const setShuffle = usePlayerStore((state) => state.setShuffle);
  const shuffle = usePlayerStore((state) => state.shuffle);

  const loadSession = async () => {
    // if there are already uploaded files don't update the session
    const session = await getSessionData();
    setIndex(session.index);
    setShuffle(session.shuffle);
    await getFilesRecursivelyThenStore(session.folders);
  };

  const reset = async () => {
    setIndex(0);
    setFolders([]);
    setShuffle({
      isShuffle: false,
      seed: 0,
    });
  };

  return (
    <div className="py-10 space-y-8">
      <Button
        disabled={!files.length}
        onClick={() => {
          navigate("/player");
        }}
        className="w-full"
      >
        <Pen className="w-4 h-4 me-2" />
        Start
      </Button>
      <div className="flex gap-4">
        <Button
          disabled={!!files.length}
          onClick={loadSession}
          className="w-full"
        >
          Load Session
        </Button>
        <Button variant={"outline"} onClick={reset}>
          Reset
        </Button>
        <Toggle
          onPressedChange={(val) =>
            setShuffle({
              isShuffle: val,
              seed: 0,
            })
          }
          pressed={shuffle.isShuffle}
        >
          <Shuffle className="w-4 h-4" />
        </Toggle>
      </div>
    </div>
  );
}
