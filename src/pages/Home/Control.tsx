import { Button } from "@/components";
import { useFoldersStore } from "@/store/foldersStore";
import { Pen } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

type Props = {};

export default function Control({}: Props) {
  const navigate = useNavigate();
  const files = useFoldersStore((state) => state.folders)
    .map((item) => item.files)
    .flat();
  return (
    <div className="py-10">
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
    </div>
  );
}
