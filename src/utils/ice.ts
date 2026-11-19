export const MAX_CONNECTION_RETRIES = 3;

const stunServers: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export async function loadIceConfiguration(signal: AbortSignal): Promise<RTCConfiguration> {
  if (signal.aborted) return { iceServers: stunServers };

  const request = new AbortController();
  const abortRequest = () => request.abort();
  const timeout = setTimeout(abortRequest, 4500);
  signal.addEventListener('abort', abortRequest, { once: true });
  try {
    const response = await fetch('/api/ice-servers', {
      method: 'POST',
      signal: request.signal,
    });
    if (response.ok) {
      const { iceServers } = await response.json();
      if (Array.isArray(iceServers)) {
        const relayServers: RTCIceServer[] = [];
        for (const server of iceServers) {
          if (typeof server?.username !== 'string' || !server.username ||
              typeof server.credential !== 'string' || !server.credential) continue;
          const urls: unknown[] = Array.isArray(server.urls) ? server.urls : [server.urls];
          const relayUrls = urls.filter((url): url is string =>
            typeof url === 'string' && /^turns?:[^\s]+$/i.test(url) && !/:53(?:\?|$)/.test(url));
          if (relayUrls.length) {
            relayServers.push({ urls: relayUrls, username: server.username, credential: server.credential });
          }
        }
        return { iceServers: [...stunServers, ...relayServers] };
      }
    }
  } catch {
    // Direct connections can still work when the relay endpoint is unavailable.
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener('abort', abortRequest);
  }
  return { iceServers: stunServers };
}
