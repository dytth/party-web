// Comprehensive WebRTC ICE & TURN Configuration for Party Web
// Enables reliable P2P traversal across Symmetric NAT, 4G/5G CGNAT, and non-hairpinning home routers.

export const RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    // Google Public STUN Servers (Diverse IPs and ports)
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },

    // Cloudflare Public STUN
    { urls: 'stun:stun.cloudflare.com:3478' },

    // Mozilla & Twilio STUN
    { urls: 'stun:stun.services.mozilla.com' },
    { urls: 'stun:global.stun.twilio.com:3478' },

    // OpenRelay Public TURN / STUN Servers (Free tier for open-source / WebRTC)
    // Works over UDP and TCP (Port 80 and Port 443 - bypasses restrictive firewalls & Symmetric NAT)
    {
      urls: 'stun:openrelay.metered.ca:80',
    },
    {
      urls: [
        'turn:openrelay.metered.ca:80',
        'turn:openrelay.metered.ca:443',
        'turn:openrelay.metered.ca:443?transport=tcp',
      ],
      username: 'openrelay',
      credential: 'openrelay',
    },
  ],
  iceCandidatePoolSize: 10,
  iceTransportPolicy: 'all',
};
