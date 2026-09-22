# Handoff — always-on tracker shell, and a local dictation stack

Researched 17 September 2026. Two separate problems, one document.

---

# Part 1 — Keeping the tracker open without a browser tab

## The honest finding first

There is no way to run an HTML UI on Windows at "very low RAM" in the sense you
probably mean. Every wrapper worth using — Tauri, Pake, an installed PWA — renders
through **WebView2, which is Chromium**. The savings over Electron are real but they
are mostly *disk*, not memory: Tauri bundles are 5 to 10 MB against Electron's 100 to
300 MB, because Tauri borrows the system webview instead of shipping its own copy.

On memory the picture is muddier than the marketing. Tauri's own benchmarks claim
roughly 40 to 80 MB idle against Electron's 150 to 400 MB. But an issue filed on the
Tauri repo measured real pages and found Tauri on Windows 10 at 399 MB against
Electron's 318 MB for the same site — because on Windows both are Chromium, and the
usual comparison undercounts Electron's shared memory. Treat the 40 MB figure as a
floor for a trivial app, not a prediction for yours.

What this means practically: expect somewhere between 80 and 250 MB for the tracker
however you wrap it. That is the cost of rendering HTML on Windows. If a hard ceiling
under 50 MB actually matters, the answer is not a wrapper — it is rewriting the
tracker as a native widget, which is a different project and not worth it for this.

## Recommended, in order of effort

**Option A — install it as an app from Edge. Two minutes, zero tooling.**
Open the file in Edge, then the three-dot menu, Apps, "Install this site as an app."
You get a windowed app with its own taskbar entry and no browser chrome, and it
already shares the WebView2 runtime with everything else on the machine. For a local
file you may need to serve it rather than open it as `file://` — `python -m
http.server` in the folder, or any static server, then install from `localhost`.
Serving it also fixes a real problem: `localStorage` is unreliable and sometimes
partitioned for `file://` pages, so your progress is safer on `localhost` than on a
double-clicked file.

**Option B — Pake. A real .exe, still no Rust knowledge needed.**
`tw93/Pake` wraps a URL into a Tauri app in one command, around 5 MB, with shortcut
pass-through and tray support. Point it at the `localhost` URL from above, or at a
GitHub Pages URL if you host the repo privately and do not mind it being online.
Caveat worth knowing before you start: Pake is a webview wrapper with no backend, so
it is the right tool for exactly this and the wrong tool the moment you want the app
to touch the filesystem.

**Option C — a real Tauri v2 app.** Only if you later want the tracker to read and
write `progress.json` on disk instead of browser storage, or to sit in the tray with
a global hotkey. That is a weekend, not an afternoon, and it is the same stack Handy
below is built on — so doing it would also teach you the codebase you would be
patching for dictation. There is a genuine argument for doing this later for that
reason alone.

## The cheaper answer nobody asks for

Pin the tab. A pinned tab in a browser you already have open costs you nothing
additional, because the browser process is already resident. Every wrapper above
*adds* a process rather than replacing one. If the goal is "always visible without
thinking about it," a pinned tab plus Option A is strictly better than a new app.

**Links**
- Pake: https://github.com/tw93/Pake
- Pake explained: https://betterstack.com/community/guides/linux/pake-explained/
- Tauri memory, the contested thread: https://github.com/tauri-apps/tauri/issues/5889

---

# Part 2 — Local dictation to replace Wispr Flow

## The recommendation

**Handy** (`cjpais/Handy`), MIT licensed, with **Parakeet TDT 0.6B v3 int8** as the
model. Free, fully offline, no word caps, and it is built on Tauri with a Rust
backend — which is exactly the kind of codebase you can patch.

Why it wins for your case specifically:

- It is the most established of the genuinely open, genuinely cross-platform options,
  and it is the one repeatedly named as the Windows answer rather than a macOS-only
  tool. Most of the polished alternatives — VoiceInk, Voibe, MacWhisper, Superwhisper
  — are Apple Silicon only and therefore irrelevant to you.
- Push-to-talk global hotkey, Silero VAD to strip silence, pastes into whatever field
  your cursor is in. That is the Wispr Flow interaction, reproduced.
- Model choice is a dropdown: Whisper small through large, Parakeet v3, Moonshine,
  SenseVoice, and recently Cohere Transcribe.
- The transcription engine is a separate crate, `cjpais/transcribe-rs`, which is where
  you would patch. It exposes Parakeet, Canary, Cohere, Moonshine, SenseVoice, GigaAM,
  Whisper and Whisperfile behind one trait.

Wispr Flow's free tier is capped at 2,000 words a week, which is roughly fifteen to
twenty minutes of speech — that is the wall you have been hitting. Paid is $15 a
month. Handy has no cap and no account.

## Why Parakeet v3 rather than Whisper

On English it is more accurate and much faster. Reported figures put Parakeet TDT
0.6B v3 at roughly 1.9 percent WER on LibriSpeech clean against about 3.0 percent for
Whisper large-v3-turbo, running roughly ten times faster on English audio. The int8
ONNX build reaches real-time factors in the high tens on ordinary desktop CPUs.

**The caveat that matters to you.** Parakeet v3 covers 25 European languages. It has
**no Hindi, no Chinese, no Japanese, no Korean, no Arabic**. If you dictate in Hindi
or mix Hindi into English, Parakeet will fail badly and you want Whisper large-v3-turbo
instead, which covers 99 or more languages. Handy lets you switch models, so the
practical setup is Parakeet as the daily driver and a Whisper model kept installed for
when you need it.

**A conflict in the sources, flagged rather than resolved.** One comparison claims
Parakeet v3 needs around 16 GB of unified memory and will not run where Whisper turbo
fits in 6 GB. That figure describes NVIDIA's reference full-precision NeMo
configuration, not the int8 ONNX build that Handy ships, which is a few hundred
megabytes of weights and is the thing people run on laptop CPUs. Do not plan around
either number — install it, open Task Manager, and measure. That measurement takes two
minutes and settles it.

## Install

1. Download the Windows release from https://github.com/cjpais/Handy/releases
2. Grant microphone permission on first launch.
3. In Settings, pick the model. Start with Parakeet v3 int8.
4. Set the push-to-talk hotkey to something that does not collide with Claude Code.
5. Test in a text field, then in Claude Code, then in a browser input. Paste behaviour
   differs between them and that is the usual source of complaints.

Models land in `{app_data_dir}/models/`, for example
`parakeet-tdt-0.6b-v3-int8/`. If a download fails behind a network restriction, the
URLs are publicly fetchable and you can drop the folder in by hand.

## Known issues, so you are not surprised

- **Whisper models crash on some Windows configurations.** This is in Handy's own
  README as a known, configuration-dependent issue. Parakeet is the CPU-optimised path
  and the safer default on Windows. If Whisper crashes for you, it is not your setup
  being broken, it is a known bug.
- The default Windows build does **not** use your NVIDIA GPU for Parakeet. It runs
  ONNX on CPU, and the Vulkan feature is what whisper-rs is built with.

## Patch paths, in increasing order of effort

**Building with CUDA for Parakeet.** There is a full worked recipe in Handy discussion
#494 — the short version is: clone `Handy` and `transcribe-rs` side by side, switch
`whisper-rs` features from `vulkan` to `cuda` in `transcribe-rs/Cargo.toml`, set
`transcribe-rs` in `Handy/src-tauri/Cargo.toml` to features
`["whisper", "parakeet", "moonshine", "sense_voice"]`, then set `CMAKE_GENERATOR` to
Ninja, `LIBCLANG_PATH` to the LLVM inside Visual Studio, `CUDAFLAGS` to
`-allow-unsupported-compiler --std=c++17`, and `CUDAARCHS` to your architecture. Build
with `bun run tauri build`. The bundling step fails at code signing and that is
expected — the working `handy.exe` already exists in
`src-tauri/target/release/` at that point. Prerequisites are the CUDA Toolkit, Ninja,
Rust, Bun, and Visual Studio with the C++ workload.

**Custom Whisper models.** Handy auto-discovers GGML models dropped into the models
directory, so a fine-tune is a file copy, not a code change.

**Real-time streaming rather than push-to-talk.** Handy is record-then-transcribe: you
hold the key, speak, release, and the text appears. It is not live captioning. If you
want words appearing as you speak, the path is Moonshine v2 streaming, which
`transcribe-rs` already supports — there is a `moonshine_streaming` example in the
crate. Moonshine is built for exactly this: variable-length input rather than
Whisper's fixed thirty-second chunks, and encoder caching so most of the work happens
while you are still talking. The models are tiny, 26 to 58 MB, and independent
benchmarking puts streaming latency around 107 ms against Whisper large-v3's eleven
seconds on the same hardware. The accuracy cost is real, around 12 percent WER for
tiny and 10 percent for base, so it is a live-preview model rather than a final-text
model.

**The interesting patch, if you want one.** Stream Moonshine for immediate on-screen
feedback while you speak, then re-transcribe the buffered audio with Parakeet on
release and replace the text. You get live feedback and final accuracy. Both engines
are already in `transcribe-rs` behind the same trait, which is what makes this a
plausible afternoon rather than a project.

## What was rejected, and why

| | |
|---|---|
| **VoiceInk, Voibe, MacWhisper, Superwhisper** | macOS only. Not applicable. |
| **OpenWhispr** | Cross-platform and open source, but Electron, which is the opposite of your RAM constraint. |
| **WhisperWriter** (`savbell`) | The obvious Windows answer for years, and effectively abandoned — last commit August 2024, Windows install failures sitting unanswered. Do not start here. |
| **Windows Voice Access** | Free and built in. Worth trying for ten minutes before installing anything, because if it is good enough it costs nothing. It is not competitive on technical vocabulary. |
| **Dragon** | $699 and dated. |
| **Talon Voice** | Powerful and a much larger commitment — it is a voice-control system, not a dictation tool. |

## Verification checklist

Before declaring this solved, measure rather than assume:

- Idle RAM of Handy in Task Manager, and RAM during a transcription.
- Time from key release to text appearing, on a thirty-second dictation.
- Accuracy on your actual vocabulary — say "LangGraph", "idempotency",
  "Sarvam", "eval harness", "Parakeet TDT". This is where cloud tools usually win and
  where a local model either surprises you or disqualifies itself.
- Behaviour inside Claude Code specifically, since that is where you will use it most
  and where paste behaviour is least predictable.
- Whether it survives a Hindi sentence, if you need that. Parakeet will not.

**Links**
- Handy: https://github.com/cjpais/Handy
- Releases: https://github.com/cjpais/Handy/releases
- transcribe-rs: https://github.com/cjpais/transcribe-rs
- CUDA build recipe: https://github.com/cjpais/Handy/discussions/494
- Parakeet GGUF for whisper.cpp: https://huggingface.co/danbev/parakeet-GGUF
- Open-source alternatives survey: https://openalternative.co/alternatives/wisprflow
