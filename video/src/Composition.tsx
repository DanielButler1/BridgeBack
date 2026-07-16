import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { AbsoluteFill, Composition, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";

import { scenes } from "./script";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
const FPS = 30;
const DURATION = 120 * FPS;
const ink = "#0d1f18";
const green = "#5db487";
const pale = "#eaf6ef";

type Props = { includeVoiceover: boolean };

export const MyComposition = () => <Composition id="BridgeBackBuildWeek" component={BridgeBackFilm} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ includeVoiceover: true }} />;

const BridgeBackFilm = ({ includeVoiceover }: Props) => <AbsoluteFill style={{ backgroundColor: ink, color: "#f6fbf8", fontFamily }}>
  {scenes.map((scene) => <Sequence key={scene.id} from={scene.start * FPS} durationInFrames={scene.duration * FPS}><FilmScene scene={scene} /></Sequence>)}
  {includeVoiceover ? <Audio src={staticFile("voiceover/bridgeback-build-week.mp3")} /> : null}
</AbsoluteFill>;

function FilmScene({ scene }: { scene: (typeof scenes)[number] }) {
  const frame = useCurrentFrame();
  const duration = scene.duration * FPS;
  const opacity = interpolate(frame, [0, 14, duration - 14, duration], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const rise = interpolate(frame, [0, 28], [44, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <AbsoluteFill style={{ opacity, padding: "96px 112px 82px", background: scene.light ? pale : ink, color: scene.light ? ink : "#f6fbf8" }}>
    <div style={{ position: "absolute", width: 680, height: 680, borderRadius: 999, right: -220, top: -280, border: `1px solid ${scene.light ? "#9dcbb3" : "#315b49"}` }} />
    <header style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, fontWeight: 700 }}><BrandMark /><span>BridgeBack</span><span style={{ marginLeft: "auto", color: green, fontSize: 25, fontWeight: 600 }}>{scene.label}</span></header>
    <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", translate: `0 ${rise}px` }}>{scene.kind === "problem" ? <ProblemScene /> : scene.kind === "failure" ? <FailureScene /> : scene.kind === "idea" ? <IdeaScene /> : scene.kind === "computer-science" ? <ComputerScienceScene frame={frame} /> : scene.kind === "pupil" ? <PupilScene /> : scene.kind === "maths" ? <MathsScene /> : scene.kind === "architecture" ? <ArchitectureScene /> : <ClosingScene />}</main>
    <footer style={{ minHeight: 88, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 60, borderTop: `1px solid ${scene.light ? "#bdd9ca" : "#315044"}`, paddingTop: 24 }}><div style={{ maxWidth: 1480, fontSize: 34, lineHeight: 1.3, fontWeight: 500 }}>{scene.caption}</div><div style={{ flexShrink: 0, color: scene.light ? "#49665b" : "#9ab2a7", fontSize: 22 }}>{scene.start + scene.duration}s</div></footer>
  </AbsoluteFill>;
}

const BrandMark = () => <div style={{ width: 48, height: 48, borderRadius: 15, border: `2px solid ${green}`, display: "grid", placeItems: "center", color: green, fontSize: 28 }}>↗</div>;
const Headline = ({ children, maxWidth = 1500 }: { children: React.ReactNode; maxWidth?: number }) => <h1 style={{ maxWidth, margin: 0, fontSize: 100, lineHeight: 1.02, letterSpacing: "-0.055em", fontWeight: 650 }}>{children}</h1>;
const Accent = ({ children }: { children: React.ReactNode }) => <span style={{ color: green }}>{children}</span>;

const ProblemScene = () => <div><div style={{ color: green, fontSize: 28, fontWeight: 700, marginBottom: 28 }}>THE ATTENDANCE GAP</div><Headline>Almost <Accent>one in five</Accent> pupils in England is persistently absent.</Headline><p style={{ fontSize: 40, color: "#a9beb4", marginTop: 34 }}>Returning is only the beginning.</p></div>;
const FailureScene = () => <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 110, alignItems: "center" }}><Headline>“Catch up on everything” is not a route back.</Headline><div style={{ display: "grid", gap: 18 }}>{["20 missed days", "12 lesson resources", "Tomorrow's lesson still arrives"].map((text, i) => <div key={text} style={{ padding: "28px 34px", borderRadius: 24, background: i === 2 ? green : "#17372a", color: i === 2 ? ink : "#f6fbf8", fontSize: 38, fontWeight: 650 }}>{text}</div>)}</div></div>;
const IdeaScene = () => <div><div style={{ color: "#49665b", fontSize: 30, fontWeight: 700, marginBottom: 26 }}>BRIDGEBACK WORKS BACKWARDS</div><Headline maxWidth={1650}>What is the <Accent>minimum</Accent> this pupil needs to join the next lesson?</Headline><div style={{ display: "flex", gap: 22, marginTop: 54 }}>{["Analyse the lesson", "Check prerequisites", "Build a short route"].map((item, i) => <div key={item} style={{ flex: 1, borderRadius: 26, padding: 30, background: i === 1 ? ink : "#d8ebdf", color: i === 1 ? "#fff" : ink, fontSize: 31, fontWeight: 650 }}><span style={{ color: green, marginRight: 16 }}>0{i + 1}</span>{item}</div>)}</div></div>;
function ComputerScienceScene({ frame }: { frame: number }) { const values = [20, 12, 7, 2, 3]; const labels = ["days missed", "resources", "possible prerequisites", "support needs", "focused activities"]; return <div><div style={{ color: green, fontSize: 28, fontWeight: 700, marginBottom: 34 }}>GCSE COMPUTER SCIENCE · ALGORITHMS AND DATA</div><div style={{ display: "flex", alignItems: "center", gap: 20 }}>{values.map((value, i) => <div key={value} style={{ display: "flex", alignItems: "center", gap: 20, opacity: interpolate(frame, [i * 12, i * 12 + 18], [0.18, 1], { extrapolateRight: "clamp" }) }}><div style={{ width: i === 4 ? 320 : 260, minHeight: 210, borderRadius: 28, background: i >= 3 ? green : "#17372a", color: i >= 3 ? ink : "#fff", padding: 30, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}><strong style={{ fontSize: 82, lineHeight: 1 }}>{value}</strong><span style={{ marginTop: 16, fontSize: 25, lineHeight: 1.2 }}>{labels[i]}</span></div>{i < values.length - 1 ? <span style={{ color: green, fontSize: 44 }}>→</span> : null}</div>)}</div></div>; }
const PupilScene = () => <div style={{ display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: 70, alignItems: "center" }}><div><div style={{ color: "#49665b", fontSize: 28, fontWeight: 700, marginBottom: 24 }}>MIA&apos;S VIEW</div><Headline maxWidth={760}>Three steps. Never a wall of missed work.</Headline></div><div style={{ background: "#fff", border: "1px solid #c5ded1", borderRadius: 34, padding: 40, boxShadow: "0 30px 80px rgba(13,31,24,.12)" }}><div style={{ fontSize: 27, color: "#49665b" }}>Your shortest path</div>{["Loops that narrow a search", "Follow the changing boundaries", "Join tomorrow's binary-search lesson"].map((item, i) => <div key={item} style={{ display: "flex", gap: 24, alignItems: "center", padding: "27px 0", borderBottom: i < 2 ? "1px solid #dbe9e1" : "none", fontSize: 31, fontWeight: 650 }}><span style={{ width: 52, height: 52, borderRadius: 999, background: i === 0 ? green : pale, display: "grid", placeItems: "center" }}>{i + 1}</span>{item}</div>)}</div></div>;
const MathsScene = () => <div><div style={{ color: green, fontSize: 28, fontWeight: 700, marginBottom: 24 }}>A SECOND SUBJECT · GCSE MATHEMATICS</div><Headline maxWidth={1560}>The same method finds a different route.</Headline><div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 30, alignItems: "center" }}><EquationCard text="x + y = 10" label="Rearrange" /><span style={{ fontSize: 64, color: green }}>→</span><EquationCard text="y = 10 − x" label="Substitute next" /></div></div>;
const EquationCard = ({ text, label }: { text: string; label: string }) => <div style={{ background: "#17372a", borderRadius: 30, padding: 40 }}><div style={{ color: green, fontSize: 25, fontWeight: 700 }}>{label}</div><div style={{ marginTop: 18, fontSize: 72, fontWeight: 650 }}>{text}</div></div>;
const ArchitectureScene = () => <div><Headline maxWidth={1450}>AI proposes. Teachers decide. Pupils stay in control.</Headline><div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 54 }}>{[["SOL","Lesson map"],["TERRA","Diagnostic"],["LUNA","Micro-lessons"],["IMAGE MINI","Optional visuals"]].map(([model, job]) => <div key={model} style={{ borderRadius: 24, border: "1px solid #315044", padding: 28 }}><div style={{ color: green, fontSize: 24, fontWeight: 700 }}>{model}</div><div style={{ marginTop: 12, fontSize: 30, fontWeight: 600 }}>{job}</div></div>)}</div><p style={{ marginTop: 32, fontSize: 31, color: "#a9beb4" }}>Deterministic scoring · source labels · no grades · teacher review · optional human help</p></div>;
const ClosingScene = () => <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}><BrandMark /><h1 style={{ fontSize: 124, letterSpacing: "-0.06em", margin: "34px 0 12px" }}>BridgeBack</h1><p style={{ color: green, fontSize: 48, fontWeight: 650, margin: 0 }}>The shortest path back into learning.</p><p style={{ marginTop: 55, fontSize: 27, color: "#a9beb4" }}>Built for OpenAI Build Week · AI-generated narration</p></div>;
