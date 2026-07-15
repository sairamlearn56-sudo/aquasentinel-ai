import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Maps app language codes to per-language voice ID secret names.
const LANG_TO_VOICE_KEY = {
  en: "VOICE_ID",
  hi: "VOICE_ID_HI",
  te: "VOICE_ID_TE",
  ta: "VOICE_ID_TA",
  kn: "VOICE_ID_KN",
  mr: "VOICE_ID_MR",
  bn: "VOICE_ID_BN",
};

// Free premade voices to try as fallback (in priority order).
// These are official ElevenLabs premade voices that require no "add voice" step.
// Adam is intentionally excluded per project requirements.
const PREMADE_FALLBACKS = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni' },
];

// Model that works on the free tier — used as last-resort fallback if the
// requested model (flash/v3) requires a paid plan
const FREE_TIER_MODEL = 'eleven_multilingual_v2';

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { text, language = "en", speed = 0.9, mode = "chat" } = await req.json();

    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      console.error('[elevenLabsTTS] ELEVENLABS_API_KEY secret is not set');
      return Response.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
    }

    const voiceKey = LANG_TO_VOICE_KEY[language] || "VOICE_ID";
    const voiceId = Deno.env.get(voiceKey) || Deno.env.get("VOICE_ID");
    if (!voiceId) {
      console.error('[elevenLabsTTS] VOICE_ID secret is not set');
      return Response.json({ error: 'Voice ID not configured' }, { status: 500 });
    }

    // ===== Select model and voice settings based on mode =====
    // - "chat": low-latency flash model for live conversational responses
    // - "narration": v3 model for scripted lines with emotional audio tags
    //   like [warmly], [cheerfully], [reassuringly], [concerned]
    // model_id is ALWAYS set explicitly — never rely on ElevenLabs' default.
    const isNarration = mode === "narration";
    const requestedModel = isNarration ? 'eleven_v3' : 'eleven_flash_v2_5';

    const voiceSettings = isNarration
      ? { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true }
      : { stability: 0.35, similarity_boost: 0.75, style: 0.4, use_speaker_boost: true };

    // For narration mode, emotional audio tags are preserved as-is — never stripped.
    const baseTtsBody = {
      text,
      voice_settings: { ...voiceSettings, speed: Math.min(Math.max(speed, 0.7), 1.2) },
    };
    const ttsHeaders = {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
      'Accept': 'audio/mpeg',
    };

    // Helper: call ElevenLabs TTS with a specific voice + model
    async function callEleven(voiceIdParam, modelIdParam) {
      const body = { ...baseTtsBody, model_id: modelIdParam };
      return await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceIdParam}`,
        { method: 'POST', headers: ttsHeaders, body: JSON.stringify(body) }
      );
    }

    // ===== Attempt chain (every step logged — never silent) =====
    // 1. Configured voice + requested model
    // 2. Each premade voice + requested model (if configured voice failed)
    // 3. Each premade voice + free-tier model (if requested model failed)

    // --- Step 1: Configured voice + requested model ---
    let elevenResponse = await callEleven(voiceId, requestedModel);

    if (!elevenResponse.ok) {
      const errorStatus = elevenResponse.status;
      const errorText = await elevenResponse.text();
      console.error(
        `[elevenLabsTTS] Step 1 FAILED — voice="${voiceId}" (configured), model="${requestedModel}", ` +
        `mode=${mode}, status=${errorStatus}: ${errorText}`
      );

      // 402 = payment required (library voice OR paid-only model)
      // 404 = voice not found / not added to account
      // 422 = voice does not support the requested model
      if (![402, 404, 422].includes(errorStatus)) {
        return Response.json(
          { error: `ElevenLabs API error: ${errorStatus} - ${errorText}` },
          { status: 502 }
        );
      }

      let succeeded = false;

      // --- Step 2: Try each premade voice with the requested model ---
      for (const voice of PREMADE_FALLBACKS) {
        console.warn(`[elevenLabsTTS] Step 2 — trying premade voice "${voice.name}" (${voice.id}) with model="${requestedModel}"`);
        elevenResponse = await callEleven(voice.id, requestedModel);
        if (elevenResponse.ok) {
          console.warn(`[elevenLabsTTS] Step 2 SUCCEEDED with voice="${voice.name}", model="${requestedModel}"`);
          succeeded = true;
          break;
        }
        const step2Error = await elevenResponse.text();
        console.error(
          `[elevenLabsTTS] Step 2 FAILED — voice="${voice.name}", model="${requestedModel}", ` +
          `status=${elevenResponse.status}: ${step2Error}`
        );
      }

      // --- Step 3: If requested model failed for all voices, try free-tier model ---
      if (!succeeded) {
        console.warn(
          `[elevenLabsTTS] Step 3 — model "${requestedModel}" may require a paid plan. ` +
          `Trying premade voices with free-tier model "${FREE_TIER_MODEL}"`
        );
        for (const voice of PREMADE_FALLBACKS) {
          console.warn(`[elevenLabsTTS] Step 3 — trying voice="${voice.name}" (${voice.id}) with model="${FREE_TIER_MODEL}"`);
          elevenResponse = await callEleven(voice.id, FREE_TIER_MODEL);
          if (elevenResponse.ok) {
            console.warn(`[elevenLabsTTS] Step 3 SUCCEEDED with voice="${voice.name}", model="${FREE_TIER_MODEL}"`);
            succeeded = true;
            break;
          }
          const step3Error = await elevenResponse.text();
          console.error(
            `[elevenLabsTTS] Step 3 FAILED — voice="${voice.name}", model="${FREE_TIER_MODEL}", ` +
            `status=${elevenResponse.status}: ${step3Error}`
          );
        }
      }

      if (!succeeded) {
        return Response.json(
          { error: `ElevenLabs TTS failed for all voice/model combinations. Last error logged above.` },
          { status: 502 }
        );
      }
    }

    const audioBuffer = await elevenResponse.arrayBuffer();
    const base64Audio = arrayBufferToBase64(audioBuffer);

    return Response.json({
      audio: base64Audio,
      content_type: 'audio/mpeg',
    });
  } catch (error) {
    console.error('[elevenLabsTTS] Unhandled error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});