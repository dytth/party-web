const headers = { 'Cache-Control': 'no-store' };

export async function onRequestPost({ env }) {
  if (!env.TURN_KEY_ID || !env.TURN_KEY_API_TOKEN) {
    return new Response(null, { status: 503, headers });
  }

  try {
    const keyId = encodeURIComponent(env.TURN_KEY_ID);
    const response = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${keyId}/credentials/generate-ice-servers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.TURN_KEY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ttl: 24 * 60 * 60 }),
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) return new Response(null, { status: 502, headers });

    const { iceServers } = await response.json();
    if (!Array.isArray(iceServers)) return new Response(null, { status: 502, headers });
    return Response.json({ iceServers }, { headers });
  } catch {
    return new Response(null, { status: 502, headers });
  }
}
