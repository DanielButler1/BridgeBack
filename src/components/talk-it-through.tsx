"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, LoaderCircle, Mic, MicOff, PhoneOff, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import type { RealtimeTutorContext } from "@/lib/realtime-tutor";

type SessionStatus = "idle" | "connecting" | "active" | "ended" | "error";

export function TalkItThrough({ context }: { context: RealtimeTutorContext }) {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeConnection(nextStatus: SessionStatus = "ended") {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    peerRef.current?.close();
    peerRef.current = null;
    if (audioRef.current) audioRef.current.srcObject = null;
    setMuted(false);
    setStatus(nextStatus);
  }

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    peerRef.current?.close();
  }, []);

  async function startSession() {
    if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") {
      setError("Voice conversations are not supported in this browser.");
      setStatus("error");
      return;
    }

    setStatus("connecting");
    setError(null);
    setRemainingSeconds(300);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      streamRef.current = stream;
      const peer = new RTCPeerConnection();
      peerRef.current = peer;
      stream.getAudioTracks().forEach((track) => peer.addTrack(track, stream));
      peer.ontrack = (event) => {
        if (audioRef.current) audioRef.current.srcObject = event.streams[0];
      };
      peer.onconnectionstatechange = () => {
        if (["failed", "disconnected"].includes(peer.connectionState)) {
          setError("The voice connection ended. You can start another conversation.");
          closeConnection("error");
        }
      };

      const events = peer.createDataChannel("oai-events");
      events.addEventListener("open", () => {
        events.send(JSON.stringify({
          type: "response.create",
          response: { instructions: "Welcome the pupil in one short sentence, name the activity, and ask which part they would like to talk through." },
        }));
      });
      events.addEventListener("message", (event) => {
        try {
          const serverEvent = JSON.parse(event.data) as { type?: string; message?: string };
          if (serverEvent.type === "error") setError("The conversation hit a problem. Please end it and try again.");
        } catch { /* Ignore non-JSON control messages. */ }
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      const response = await fetch("/api/realtime/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sdp: offer.sdp, context }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(detail?.error ?? "The voice session could not be started.");
      }
      await peer.setRemoteDescription({ type: "answer", sdp: await response.text() });
      setStatus("active");
      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, 300 - Math.floor((Date.now() - startedAt) / 1000));
        setRemainingSeconds(remaining);
        if (remaining === 0) closeConnection("ended");
      }, 1_000);
    } catch (cause) {
      closeConnection("error");
      setError(cause instanceof DOMException && cause.name === "NotAllowedError"
        ? "Microphone access was not allowed. You can continue with the written activity."
        : cause instanceof Error ? cause.message : "The voice session could not be started.");
    }
  }

  function toggleMute() {
    const nextMuted = !muted;
    streamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !nextMuted; });
    setMuted(nextMuted);
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  return (
    <Card className="overflow-hidden border-primary/20 bg-primary/[0.035]">
      <audio ref={audioRef} autoPlay className="hidden" aria-hidden="true" />
      <CardHeader>
        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Headphones className="size-4" /></div>
        <h3 className="font-heading text-base font-medium leading-snug">Talk it through</h3>
        <CardDescription>Have a short voice conversation about this activity. Ask questions, explain your thinking or work through the example aloud.</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "active" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border bg-background px-4 py-3">
              <div className="flex items-center gap-3"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-primary" /></span><span className="text-sm font-medium">Conversation active</span></div>
              <span className="font-mono text-sm tabular-nums" aria-label={`${minutes} minutes and ${seconds} seconds remaining`}>{minutes}:{seconds}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={toggleMute}>{muted ? <Mic /> : <MicOff />}{muted ? "Unmute" : "Mute"}</Button>
              <Button variant="outline" onClick={() => closeConnection("ended")}><PhoneOff /> End</Button>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">AI voice · You can interrupt, mute or end at any time. BridgeBack does not save the audio or transcript.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-xl border bg-background p-3 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />The conversation is limited to this learning activity. Do not share personal or private information.</div>
            {error ? <p role="alert" className="text-sm leading-6 text-destructive">{error}</p> : null}
            {status === "ended" ? <p className="text-sm text-muted-foreground">Conversation complete. You can start another when you are ready.</p> : null}
            <Button className="w-full" disabled={status === "connecting"} onClick={() => void startSession()}>{status === "connecting" ? <LoaderCircle className="animate-spin" /> : status === "ended" ? <Sparkles /> : <Mic />}{status === "connecting" ? "Connecting…" : status === "ended" ? "Talk again" : "Start a 5-minute conversation"}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
