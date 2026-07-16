# BridgeBack Build Week film

A 120-second, 1920×1080 Remotion composition. It works silently with large captions and includes an OpenAI-generated narration track.

## Preview

```bash
npm install
npm run dev
```

## Generate the narration

Review `src/script.ts` first, then expose `OPENAI_API_KEY` to the current shell and run:

```bash
npm run voiceover
```

The script uses the OpenAI Speech API with `gpt-4o-mini-tts`, the `marin` voice, and explicit UK-English delivery instructions. The committed narration is 117.5 seconds long. The final frame discloses that the narration is AI-generated.

## Render

```bash
npm run still
npm run render
```

The composition intentionally uses no background music. Narration, on-screen captions and visual rhythm carry the story without introducing licensing ambiguity.
