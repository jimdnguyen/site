# Switching to a Free Model & Handling Reasoning Models

## What Changed

We switched the Digital Twin chat from a specific paid model to `openrouter/free` — a meta-model that OpenRouter routes to whichever free model is currently available.

```js
const MODEL = 'openrouter/free';
```

## The Problem: Two Kinds of Models

After making the switch, we discovered that `openrouter/free` can route to **two fundamentally different kinds of model**, and our streaming code only handled one of them.

### Standard Models

Standard (non-reasoning) models stream their response as `delta.content` chunks:

```json
{ "choices": [{ "delta": { "content": "Hello..." } }] }
```

Our original code already handled this — accumulate the content, update the message in the UI, done.

### Reasoning Models

Reasoning models (like DeepSeek R1, QwQ, etc.) behave differently. They first emit a **reasoning phase** as `delta.reasoning` chunks, then follow up with `delta.content` chunks for the actual answer:

```json
{ "choices": [{ "delta": { "reasoning": "Let me think about this..." } }] }
{ "choices": [{ "delta": { "reasoning": "The user is asking about..." } }] }
{ "choices": [{ "delta": { "content": "Here's the answer." } }] }
```

The reasoning tokens are the model's internal chain-of-thought. They're not the final answer — they're the model "thinking out loud."

## What We Had to Fix

Before the fix, when a reasoning model was selected by `openrouter/free`, the stream would emit only `delta.reasoning` chunks for a long time before any `delta.content` appeared. Our original code ignored anything that wasn't `delta.content`, so:

1. The UI showed nothing during the entire reasoning phase — it looked frozen/broken.
2. When content finally arrived, it worked, but the user had no idea the model was working.

### The Fix

We added handling for both delta types in the streaming loop:

```js
if (choice.content) {
  // Real answer content — accumulate and display it
  contentAccumulated += choice.content;
  setMessages(prev =>
    prev.map(m => m.id === botId
      ? { ...m, content: contentAccumulated, loading: false }
      : m)
  );
  scrollBottom();
} else if (choice.reasoning) {
  // Reasoning tokens — accumulate but keep the loading indicator visible
  reasoningAccumulated += choice.reasoning;
  // keep loading: true during reasoning — typing indicator stays visible
}
```

Key decisions:

- **We don't display reasoning tokens to the user.** The chain-of-thought is internal to the model and usually not useful (or coherent) for end users. We accumulate it in `reasoningAccumulated` but don't render it.
- **We keep the loading/typing indicator alive during reasoning.** This is the critical UX fix — it tells the user the model is still working, even though no visible content has appeared yet.
- **We only flip `loading: false` when actual `content` arrives.** This means the typing dots stay visible for the entire reasoning phase, then disappear as soon as the real answer starts streaming in.
- **After the loop, we ensure the final state is correct** — if content was received, we set it; either way, we clear the loading flag so the UI never gets stuck.

## Why This Matters for `openrouter/free`

With a fixed model, you know what you're getting. With `openrouter/free`, you don't — OpenRouter picks from whatever free models are available at the moment. That means:

- One request might hit a standard model and stream content immediately.
- The next request might hit a reasoning model and emit reasoning tokens for 10-20 seconds before any content appears.

Your streaming code has to handle both cases gracefully, or the UX will break intermittently depending on which model OpenRouter selects.
