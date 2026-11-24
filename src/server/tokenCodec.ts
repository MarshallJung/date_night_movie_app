import crypto from 'node:crypto';
import zlib from 'node:zlib';
import type { InvitationPayload } from '../shared/types';

const EPHEMERAL_FALLBACK_KEY = crypto.randomBytes(32);
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const MAX_TOKEN_LENGTH = 8192;

function resolveSecretKey(overrideSecret?: string): Buffer {
  const secretSource = overrideSecret ?? process.env.SHARE_TOKEN_SECRET;
  if (secretSource && secretSource.trim().length > 0) {
    return crypto.createHash('sha256').update(secretSource.trim()).digest();
  }
  return EPHEMERAL_FALLBACK_KEY;
}

export function encodeInvitationToken(
  payload: InvitationPayload,
  overrideSecret?: string,
): string {
  const key = resolveSecretKey(overrideSecret);
  const iv = crypto.randomBytes(IV_LENGTH);
  const jsonBytes = Buffer.from(JSON.stringify(payload), 'utf8');
  const compressed = zlib.deflateRawSync(jsonBytes, { level: 9 });

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(compressed), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const combined = Buffer.concat([iv, authTag, encrypted]);
  return combined.toString('base64url');
}

export function decodeInvitationToken(
  token: string,
  overrideSecret?: string,
): InvitationPayload | null {
  if (
    typeof token !== 'string' ||
    token.length < 36 ||
    token.length > MAX_TOKEN_LENGTH ||
    !/^[A-Za-z0-9_-]+$/.test(token)
  ) {
    return null;
  }

  try {
    const key = resolveSecretKey(overrideSecret);
    const combined = Buffer.from(token, 'base64url');
    if (combined.length <= IV_LENGTH + AUTH_TAG_LENGTH) {
      return null;
    }
    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const compressed = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    const jsonString = zlib.inflateRawSync(compressed).toString('utf8');
    const parsed = JSON.parse(jsonString) as InvitationPayload;

    if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.householdServices)) {
      return null;
    }
    if (!parsed.presetId && !parsed.customMovie) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
