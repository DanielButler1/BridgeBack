"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BookOpenText, Check, CircleDashed, Sparkles } from "lucide-react";

import { concepts, conceptLinks } from "@/lib/demo-data";

const statusStyles = {
  secure: {
    label: "Secure",
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
    dot: "bg-emerald-500",
    icon: Check,
  },
  check: {
    label: "Check",
    className: "border-amber-200 bg-amber-50 text-amber-950",
    dot: "bg-amber-500",
    icon: CircleDashed,
  },
  support: {
    label: "Support",
    className: "border-rose-200 bg-rose-50 text-rose-950",
    dot: "bg-rose-500",
    icon: BookOpenText,
  },
  upcoming: {
    label: "Next lesson",
    className: "border-primary/30 bg-primary text-primary-foreground",
    dot: "bg-primary-foreground",
    icon: Sparkles,
  },
};

const nodes: Node[] = concepts.map((concept) => {
  const status = statusStyles[concept.status];
  const Icon = status.icon;

  return {
    id: concept.id,
    position: concept.position,
    data: {
      label: (
        <div className="min-w-44 text-left">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-65">
              {status.label}
            </span>
            <Icon className="size-3.5" />
          </div>
          <p className="font-heading text-sm font-semibold leading-tight">
            {concept.title}
          </p>
          <p className="mt-1 text-[10px] leading-relaxed opacity-65">
            {concept.source}
          </p>
        </div>
      ),
    },
    style: {
      borderRadius: 14,
      borderWidth: 1,
      width: 190,
      padding: 14,
    },
    className: `shadow-sm ${status.className}`,
  };
});

const edges: Edge[] = conceptLinks.map((link) => ({
  ...link,
  type: "smoothstep",
  animated: link.target === "binary-search",
  style: { stroke: "var(--muted-foreground)", strokeOpacity: 0.38, strokeWidth: 1.5 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 14,
    height: 14,
    color: "var(--muted-foreground)",
  },
}));

export function ConceptMap() {
  return (
    <div className="h-[430px] w-full overflow-hidden rounded-xl border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_40%,transparent),transparent)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.14 }}
        minZoom={0.55}
        maxZoom={1.25}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1}
          color="var(--border)"
        />
        <Controls
          showInteractive={false}
          className="overflow-hidden! rounded-lg! border! bg-background! shadow-sm!"
        />
      </ReactFlow>
    </div>
  );
}

