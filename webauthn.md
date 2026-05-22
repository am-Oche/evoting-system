# WebAuthn (Web Authentication) Overview

## What is WebAuthn?

WebAuthn is a web standard (W3C) for passwordless authentication using public-key cryptography. It allows users to authenticate via biometrics, security keys, or platform authenticators instead of passwords.

## How It Works

### Registration (Attestation)

```
1. Server  ──challenge──►  Client (Browser)
2. Browser ──challenge──►  Authenticator (TPM/Secure Enclave)
3. Authenticator generates keypair (privKey + pubKey)
4. Authenticator ──pubKey + credentialId──► Browser
5. Browser ──pubKey + credentialId + signed challenge──► Server
6. Server stores pubKey + credentialId for user
```

### Authentication (Assertion)

```
1. Server  ──challenge──►  Client
2. Client selects credential (user gestures: fingerprint/PIN)
3. Authenticator signs challenge with privKey
4. Client ──credentialId + signature──► Server
5. Server verifies signature using stored pubKey ✓/✗
```

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Relying Party (RP)** | Your web server |
| **Authenticator** | Device that holds private keys (phone TPM, YubiKey, etc.) |
| **Credential ID** | Opaque identifier for the stored keypair |
| **Challenge** | Random one-time token to prevent replay attacks |
| **Attestation** | Registration process |
| **Assertion** | Authentication (login) process |
| **User Verification** | Local gesture (fingerprint, PIN) to authorize use |
| **Resident Key (Discoverable Credential)** | Key stored on authenticator itself |

## Core Flows

### Registration

```javascript
const credential = await navigator.credentials.create({ publicKey: {
  challenge: new Uint8Array(challengeFromServer),
  rp: { name: "E-Voting System" },
  user: {
    id: new Uint8Array(userId),
    name: "user@example.com",
    displayName: "User"
  },
  pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256
  authenticatorSelection: { userVerification: "required" }
}});
```

### Authentication

```javascript
const assertion = await navigator.credentials.get({ publicKey: {
  challenge: new Uint8Array(challengeFromServer),
  allowCredentials: [{ id: credentialId, type: "public-key" }],
  userVerification: "required"
}});
```

## Security Properties

- **Phishing-resistant**: Keys are scoped to origin; won't work on fake sites
- **No shared secrets**: Server stores only public key, never private key
- **Replay protection**: Challenges are single-use
- **Hardware-bound**: Private keys never leave the authenticator
- **Multi-factor**: Something you have (device) + something you are/know (biometric/PIN)

## Algorithm Support

| Algorithm | ID | Curve |
|-----------|----|-------|
| ES256 | -7 | P-256 |
| RS256 | -257 | RSA 2048+ |
| EdDSA | -8 | Ed25519 |

## Integration Checklist

- [ ] Generate and verify challenges (crypto-random, single-use)
- [ ] Store public keys per user
- [ ] Define RP ID (e.g., `evoting.example.com`)
- [ ] Set proper origins — WebAuthn is origin-scoped
- [ ] Handle platform vs cross-platform authenticators
- [ ] Implement attestation verification (or skip with `none`)
- [ ] Add user verification (fingerprint/PIN prompt)

### Server Libraries

| Language | Library |
|----------|---------|
| Node.js | `@simplewebauthn/server` |
| Python | `webauthn` |
| Go | `github.com/go-webauthn/webauthn` |
| Java | `webauthn4j` |
| Rust | `webauthn-rs` |

### Client Considerations

- Use `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` to check if platform authenticator (Windows Hello, Touch ID) is available
- Fall back to cross-platform (USB security key) if unavailable
- Encode binary data (challenge, credentialId) as `Uint8Array` / Base64url
