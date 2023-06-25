import { Button, Input } from "@/components";
import React, { useEffect, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import Folders from "@/pages/Home/Folders";
import { IntervalPicker } from "@/pages/Home/IntervalPicker";
import Control from "@/pages/Home/Control";
import { Player } from "@/pages/Player/Player";

appWindow.setDecorations(true);

export default function Home() {
  return (
    <div className="max-w-sm mx-auto py-10">
      <Folders />
      <IntervalPicker />
      <Control />
    </div>
  );
}
