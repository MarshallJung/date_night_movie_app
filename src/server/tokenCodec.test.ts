import test from 'node:test';
import assert from 'node:assert/strict';
import { STARTER_MOVIES } from '../shared/catalog';
import { isTokenSpoilerFree } from '../shared/validation';
import { decodeInvitationToken, encodeInvitationToken } from './tokenCodec';
import type { InvitationPayload } from '../shared/types';

test('tokenCodec encrypts and decrypts preset invitations without leaking movie title', () => {
  const secret = 'test-secret-for-unit-tests-only-12345';
  const payload: InvitationPayload = {
    v: 1,
    presetId: 'the-beekeeper-2024',
    householdServices: ['prime', 'netflix'],
    salutation: 'Dearest Elizabeth',
  };

  const token = encodeInvitationToken(payload, secret);
  assert.equal(isTokenSpoilerFree(token, 'The Beekeeper'), true);
  assert.equal(token.toLowerCase().includes('statham'), false);

  const decoded = decodeInvitationToken(token, secret);
  assert.deepEqual(decoded, payload);
});

test('tokenCodec encrypts and decrypts full custom movie dossiers cleanly', () => {
  const secret = 'test-secret-for-unit-tests-only-12345';
  const customMovie = { ...STARTER_MOVIES[0], id: 'custom-test', isStarter: false };
  const payload: InvitationPayload = {
    v: 1,
    customMovie,
    householdServices: ['hulu'],
    salutation: 'My Love',
  };

  const token = encodeInvitationToken(payload, secret);
  assert.equal(isTokenSpoilerFree(token, 'The Beekeeper'), true);

  const decoded = decodeInvitationToken(token, secret);
  assert.equal(decoded?.customMovie?.title, 'The Beekeeper');
  assert.deepEqual(decoded?.householdServices, ['hulu']);
});

test('tokenCodec rejects tampered or malformed tokens', () => {
  const secret = 'test-secret-for-unit-tests-only-12345';
  const payload: InvitationPayload = {
    v: 1,
    presetId: 'die-hard-1988',
    householdServices: ['hulu'],
    salutation: 'Dearest',
  };

  const token = encodeInvitationToken(payload, secret);
  const tampered = token.slice(0, -4) + 'AAAA';
  assert.equal(decodeInvitationToken(tampered, secret), null);
  assert.equal(decodeInvitationToken('not-a-valid-token', secret), null);
  assert.equal(decodeInvitationToken(token, 'wrong-secret'), null);
});
