import { onMount, onCleanup } from 'solid-js';

const WIDGET_SCRIPT = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
let scriptRequested = false;

/** Inject the ElevenLabs ConvAI embed script once, lazily, on first use. */
function ensureWidgetScript() {
  if (scriptRequested) return;
  scriptRequested = true;
  const s = document.createElement('script');
  s.src = WIDGET_SCRIPT;
  s.async = true;
  s.type = 'text/javascript';
  document.body.appendChild(s);
}

/**
 * Mounts the ElevenLabs floating voice widget for one public agent. The widget
 * renders fixed bottom-right, so we hide the Digital Twin launcher while a
 * session is active and expose an "End voice chat" control that unmounts it.
 */
export default function VoiceWidget(props) {
  onMount(() => {
    ensureWidgetScript();
    document.body.classList.add('voice-active');
    const onKey = (e) => { if (e.key === 'Escape') props.onClose(); };
    window.addEventListener('keydown', onKey);
    onCleanup(() => {
      document.body.classList.remove('voice-active');
      window.removeEventListener('keydown', onKey);
    });
  });

  return (
    <>
      <button class="voice-end-btn" onClick={props.onClose}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        End voice chat — {props.title}
      </button>
      <elevenlabs-convai attr:agent-id={props.agentId} variant="expanded" />
    </>
  );
}
