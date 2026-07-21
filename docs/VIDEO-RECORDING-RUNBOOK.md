# BridgeBack submission video recording runbook

Target length: **2 minutes 35 seconds**. Hard limit: **under 3 minutes**.

Record at 1920×1080 in OBS. Capture the browser window only, hide bookmarks and notifications, and use 110–125% browser zoom if the interface remains fully visible. The words in quotation marks are narration. Bracketed instructions are actions, not narration.

## Before recording

- Close personal tabs and notification-producing applications.
- Confirm the microphone level does not clip and record a ten-second test.
- Open the prepared Edge window with these tabs, in this order:
  1. `https://bridgeback.phaseo.app`
  2. `https://bridgeback.phaseo.app/demo`
  3. `https://github.com/DanielButler1/BridgeBack`
- Keep the demo as one continuous authenticated journey. Do not pre-open teacher and pupil roles in separate tabs because they share the demo role cookie.
- On the demo tab, confirm that entering as Ms Morgan works. Return to `/demo` before recording.
- If demonstrating Realtime, allow microphone access before the final take, then return to `/demo`.
- Make sure no generated image or voice request is already loading.

## Script and cues

### 0:00-0:20: The problem and the idea

**Tab 1: landing page, hero visible**

> “When a pupil returns after an absence, catching up can mean facing every worksheet and lesson they missed. BridgeBack starts somewhere different. It asks: what is the minimum this pupil needs to understand to take part in the lesson happening next?”

**[Scroll slowly to the attendance evidence]**

> “Persistent absence affected 18.7 percent of pupils in England’s state-funded schools in 2024–25, rising to 24.3 percent in secondary schools.”

### 0:20-0:35: The product promise

**[Scroll to “How BridgeBack works”]**

> “BridgeBack works backwards from the upcoming lesson. It identifies the prerequisite concepts, checks only what the pupil needs, and creates a short route back while keeping the teacher in control.”

**[Next Tab]**

### 0:35-1:15: Teacher journey

**Tab 2: guided demo chooser**

**[Click “Enter as Ms Morgan”]**

> “Ms Morgan’s Year 10 class is about to learn binary search after Mia has missed four weeks. The upcoming lesson and source materials are already here.”

**[Pause on the lesson overview, then scroll to the concept dependency map]**

> “GPT-5.6 uses those sources to propose what unlocks the lesson: iteration, trace tables and sorted data. Every prerequisite is source-labelled, and the map remains a draft until the teacher reviews it.”

**[Scroll to Lesson materials, then to Pupil pathway]**

> “The teacher can see the evidence, the diagnostic and Mia’s pathway in one place. Instead of assigning all twelve missed resources, BridgeBack selects only the gaps that matter for tomorrow.”

**[Click “Open Mia’s view”]**

### 1:15-1:58: Pupil journey

> “Mia sees a calm explanation. Her check-in covers only the prerequisites, not why she was absent or her rank in class.”

**[Show one diagnostic question or the completed diagnostic summary]**

> “Her answers produce a manageable pathway of no more than three concepts. Progress is saved across refreshes, so returning later never means starting again.”

**[Open the first available focused activity]**

> “Each activity has a concise explanation, worked example, quick check and teacher-approved source. It does not replace the teacher; it makes the next conversation possible.”

### 1:58-2:18: Visual and spoken support

**[Show the existing generated visual, or click “Visualise this” if no visual is present]**

> “If text is not enough, Mia can request a visual explanation using GPT Image.”

**[Move to “Talk it through” and click the conversation button]**

> “She can also talk through this one approved activity in a five-minute GPT Realtime conversation.”

**[Ask: “Why do low, high and middle change during binary search?” Allow one short response, then click End]**

> “The voice session receives the learning activity, not Mia’s absence history or personal record.”

### 2:18-2:38: Engineering and Codex

**[Next Tab]**

**Tab 3: public GitHub repository, README visible**

> “BridgeBack is a working Next.js product backed by Convex and Clerk. GPT-5.6 powers source-grounded analysis and diagnostics with structured outputs and teacher approval. I used Codex throughout Build Week to build this end-to-end architecture, test both journeys, improve mobile accessibility, and challenge its child-data and safeguarding boundaries.”

**[Next Tab]**

### 2:38-2:50: Close

**Tab 1: return to the landing-page hero or final call to action**

> “BridgeBack does not ask a returning pupil to conquer the backlog. It gives them the shortest path back into learning.”

**[Hold for two seconds, then stop recording]**

## Editing checklist

- Remove loading time, accidental pauses and cursor hunting.
- Keep the final cut between 2:30 and 2:50.
- Add readable captions and briefly label the Teacher, Pupil, Visual and Realtime sections.
- Do not add copyrighted music or third-party brand footage.
- Check that no API key, dashboard, email address, browser profile or notification appears.
- Ensure the final narration explicitly says both **GPT-5.6** and **Codex**.
- Export at 1080p, watch the complete export, then upload it publicly to YouTube.
