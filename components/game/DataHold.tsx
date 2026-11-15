"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HoldControls } from "./HoldControls";

export function DataHold() {
  const [paused, setPaused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setPaused((value) => !value);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <HoldControls
      paused={paused}
      onToggle={() => setPaused((value) => !value)}
      onMenu={() => router.push("/")}
    />
  );
}
