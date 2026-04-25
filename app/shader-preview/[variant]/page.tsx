import { notFound } from "next/navigation";

import { PracticeCardShader } from "../../components/practice-card-shader";

const VALID = new Set(["aura", "talent", "dialogue"]);

export default async function ShaderPreview({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  if (!VALID.has(variant)) notFound();
  return (
    <div
      data-shader-preview={variant}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#301712",
      }}
    >
      <PracticeCardShader variant={variant as "aura" | "talent" | "dialogue"} />
    </div>
  );
}
