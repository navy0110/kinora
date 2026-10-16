import { test } from 'node:test';
import assert from 'node:assert/strict';
import { walletError } from '../lib/wallet-errors.ts';
test('wallet rejection is found inside wrapped SDK errors', () => assert.match(walletError({cause:{cause:{code:4001}}}),/cancelled/));
test('pending wallet request does not encourage a duplicate transaction', () => assert.match(walletError({code:-32002}),/already open/));
test('insufficient funds explains how to obtain test GLM', () => assert.match(walletError({cause:{name:'InsufficientFundsError'}}),/faucet/));
