import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Maps app language codes to per-language voice ID secret names.
// Falls back to the default VOICE_ID when a language-specific one isn't set.
const LANG_TO_VOICE_KEY = {
  en: "VOICE_ID",
  hi: "VOICE_ID_HI",
  te: "VOICE_ID_TE",
  ta: "VOICE_ID_TA",
  kn: "VOICE_ID_KN",
  mr: "VOICE_ID_MR",
  bn: "VOICE_ID_BN",
};

// Safely convert ArrayBuffer to base64 in chunks (avoids call-stack overflow on large audio)
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000; // 32 KB
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

    const { text, language = "en", speed = 0.9 } = await req.json();

    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return Response.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
    }

    // Pick voice ID: try language-specific first, fall back to default
    const voiceKey = LANG_TO_VOICE_KEY[language] || "VOICE_ID";
    const voiceId = Deno.env.get(voiceKey) || Deno.env.get("VOICE_ID");
    if (!voiceId) {
      return Response.json({ error: 'Voice ID not configured' }, { status: 500 });
    }

    // Call ElevenLabs TTS with the multilingual v2 model (auto-detects language from text)
    const elevenResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
            speed: Math.min(Math.max(speed, 0.7), 1.2),
          },
        }),
      }
    );

    if (!elevenResponse.ok) {
      const errorText = await elevenResponse.text();
      return Response.json(
        { error: `ElevenLabs API error: ${elevenResponse.status} - ${errorText}` },
        { status: 502 }
      );
    }

    const audioBuffer = await elevenResponse.arrayBuffer();
    const base64Audio = arrayBufferToBase64(audioBuffer);

    return Response.json({
      audio: base64Audio,
      content_type: 'audio/mpeg',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});