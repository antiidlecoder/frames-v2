"use client";

import PixelCanvas from "@/components/PixelCanvas";
import dynamic from "next/dynamic";

const Demo = dynamic(() => import("@/components/Demo"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Frames v2 Demo" }
) {
  return (
    <div>
      <Demo title={title} />
      <PixelCanvas />
    </div>
  );
}
