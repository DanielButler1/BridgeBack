"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BookOpenText, Check, CircleDashed, Sparkles } from "lucide-react";
import { useEffect, useMemo } from "react";

import { concepts, conceptLinks } from "@/lib/demo-data";

export type ConceptMapItem = {
  key: string;
  title: string;
  description: string;
  sourceRef: string;
  x: number;
  y: number;
};

export type ConceptMapLink = { source: string; target: string };
export type ConceptReadiness = "secure" | "check" | "support" | "upcoming";

const statusStyles = {
  secure: { label: "Secure", className: "border-emerald-200 bg-emerald-50 text-emerald-950", icon: Check },
  check: { label: "Check", className: "border-amber-200 bg-amber-50 text-amber-950", icon: CircleDashed },
  support: { label: "Support", className: "border-rose-200 bg-rose-50 text-rose-950", icon: BookOpenText },
  upcoming: { label: "Next lesson", className: "border-primary/30 bg-primary text-primary-foreground", icon: Sparkles },
};

const fallbackItems: ConceptMapItem[] = concepts.map((concept) => ({
  key: concept.id,
  title: concept.title,
  description: concept.description,
  sourceRef: concept.source,
  x: concept.position.x,
  y: concept.position.y,
}));

function createNodes(
  items: ConceptMapItem[],
  targetConceptKey: string,
  readiness: Record<string, ConceptReadiness>,
) {
  return items.map((concept): Node => {
    const state = concept.key === targetConceptKey ? "upcoming" : readiness[concept.key] ?? "check";
    const status = statusStyles[state];
    const Icon = status.icon;
    return {
      id: concept.key,
      position: { x: concept.x, y: concept.y },
      data: {
        label: (
          <div className="min-w-44 text-left">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-65">{status.label}</span>
              <Icon className="size-3.5" />
            </div>
            <p className="font-heading text-sm font-semibold leading-tight">{concept.title}</p>
            <p className="mt-1 text-[10px] leading-relaxed opacity-65">{concept.sourceRef}</p>
          </div>
        ),
      },
      style: { borderRadius: 14, borderWidth: 1, width: 190, padding: 14 },
      className: `shadow-sm ${status.className}`,
    };
  });
}

function createEdges(links: ConceptMapLink[], targetConceptKey: string) {
  return links.map((link, index): Edge => ({
    id: `${link.source}-${link.target}-${index}`,
    ...link,
    type: "smoothstep",
    animated: link.target === targetConceptKey,
    style: { stroke: "var(--muted-foreground)", strokeOpacity: 0.38, strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: "var(--muted-foreground)" },
  }));
}

export function ConceptMap({
  items = fallbackItems,
  links = conceptLinks,
  targetConceptKey = "binary-search",
  readiness = {},
  editable = false,
  onSelect,
  onPositionChange,
}: {
  items?: ConceptMapItem[];
  links?: ConceptMapLink[];
  targetConceptKey?: string;
  readiness?: Record<string, ConceptReadiness>;
  editable?: boolean;
  onSelect?: (key: string) => void;
  onPositionChange?: (key: string, position: { x: number; y: number }) => void;
}) {
  const preparedNodes = useMemo(
    () => createNodes(items, targetConceptKey, readiness),
    [items, readiness, targetConceptKey],
  );
  const preparedEdges = useMemo(
    () => createEdges(links, targetConceptKey),
    [links, targetConceptKey],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(preparedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(preparedEdges);

  useEffect(() => setNodes(preparedNodes), [preparedNodes, setNodes]);
  useEffect(() => setEdges(preparedEdges), [preparedEdges, setEdges]);

  return (
    <div className="h-[430px] w-full overflow-hidden rounded-xl border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_40%,transparent),transparent)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onSelect?.(node.id)}
        onNodeDragStop={(_, node) => onPositionChange?.(node.id, node.position)}
        fitView
        fitViewOptions={{ padding: 0.14 }}
        minZoom={0.55}
        maxZoom={1.25}
        nodesDraggable={editable}
        nodesConnectable={false}
        elementsSelectable={editable}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="var(--border)" />
        <Controls showInteractive={false} className="overflow-hidden! rounded-lg! border! bg-background! shadow-sm!" />
      </ReactFlow>
    </div>
  );
}
