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
import { BookOpenText, Check, ChevronRight, CircleDashed, GitBranch, Sparkles } from "lucide-react";
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
  secure: { label: "No support indicated", className: "border-emerald-200 bg-emerald-50 text-emerald-950", icon: Check },
  check: { label: "Not checked yet", className: "border-amber-200 bg-amber-50 text-amber-950", icon: CircleDashed },
  support: { label: "Support selected", className: "border-rose-200 bg-rose-50 text-rose-950", icon: BookOpenText },
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
          <div className="w-full min-w-0 text-left">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[11px] font-medium opacity-65">{status.label}</span>
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
  const mobileItems = useMemo(() => [...items].sort((a, b) => a.x - b.x || a.y - b.y), [items]);

  useEffect(() => setNodes(preparedNodes), [preparedNodes, setNodes]);
  useEffect(() => setEdges(preparedEdges), [preparedEdges, setEdges]);

  return (
    <>
      <div className="space-y-3 md:hidden" aria-label="Prerequisites in learning order">
        <div className="flex items-start gap-3 rounded-xl border bg-muted/25 p-4 text-sm leading-6 text-muted-foreground"><GitBranch className="mt-0.5 size-4 shrink-0 text-primary" /><p>Read from top to bottom. Each card shows the earlier ideas it needs and what it unlocks next.</p></div>
        <ol className="space-y-3">
          {mobileItems.map((concept, index) => {
            const state = concept.key === targetConceptKey ? "upcoming" : readiness[concept.key] ?? "check";
            const status = statusStyles[state];
            const Icon = status.icon;
            const needs = links.filter((link) => link.target === concept.key).map((link) => items.find((item) => item.key === link.source)?.title).filter(Boolean);
            const unlocks = links.filter((link) => link.source === concept.key).map((link) => items.find((item) => item.key === link.target)?.title).filter(Boolean);
            const content = <><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold text-muted-foreground">{index + 1} of {mobileItems.length}</p><h3 className="mt-1 font-heading text-base font-semibold">{concept.title}</h3></div><span className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${status.className}`}><Icon className="size-3" />{status.label}</span></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{concept.description}</p>{needs.length ? <p className="mt-3 text-xs leading-5"><span className="font-semibold">Needs:</span> {needs.join(", ")}</p> : <p className="mt-3 text-xs text-muted-foreground">Foundation concept</p>}{unlocks.length ? <p className="mt-1 text-xs leading-5"><span className="font-semibold">Unlocks:</span> {unlocks.join(", ")}</p> : null}<div className="mt-3 flex items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground"><span>{concept.sourceRef}</span>{onSelect ? <ChevronRight className="size-4 shrink-0" /> : null}</div></>;
            return <li key={concept.key}>{onSelect ? <button type="button" onClick={() => onSelect(concept.key)} className="min-h-11 w-full rounded-xl border bg-card p-4 text-left shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">{content}</button> : <article className="rounded-xl border bg-card p-4 shadow-sm">{content}</article>}</li>;
          })}
        </ol>
      </div>
      <div className="hidden h-[430px] w-full overflow-hidden rounded-xl border bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_40%,transparent),transparent)] md:block" aria-label="Interactive prerequisite concept map">
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
    </>
  );
}
