import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ExpirationTime } from '@arkiv-network/sdk';
import { publicationLifetimeBlocks } from '../lib/expiration.ts';

test('reported odd-second lifetime produces an expiry accepted by the SDK', () => {
  const blocks = publicationLifetimeBlocks(1043903 * 1000, 0);
  assert.equal(blocks, 521952);
  assert.doesNotThrow(() => ExpirationTime.fromBlocks(blocks));
});

test('storage expiry rounds up by less than one block without changing exact boundaries', () => {
  for (const remaining of [1, 1999, 2000, 2001, 1043903001]) {
    const blocks = publicationLifetimeBlocks(remaining, 0);
    assert.ok(blocks * 2000 >= remaining);
    assert.ok(blocks * 2000 - remaining < 2000);
  }
  assert.equal(publicationLifetimeBlocks(4000, 0), 2);
});

test('expired or invalid end times fail before a wallet write', () => {
  for (const end of [0, -1, NaN, Infinity]) assert.throws(() => publicationLifetimeBlocks(end, 0));
});
