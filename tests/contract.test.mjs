import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateDraft, decodePublication } from '../lib/contract.ts';
const now = Date.now();
const draft = { community:'builders-sur', title:'Workshop', description:'Synthetic data',topic:'Technology',kind:'event',mode:'online',startsAt:now+3600000,endsAt:now+7200000,url:'https://example.org' };
test('rejects unsafe external links',()=>assert.throws(()=>validateDraft({...draft,url:'javascript:alert(1)'},now)));
test('rejects expiry before start and past events',()=> {assert.throws(()=>validateDraft({...draft,endsAt:now},now));assert.throws(()=>validateDraft({...draft,startsAt:now-1},now));});
test('rejects malformed public payloads',()=>{assert.equal(decodePublication({title:'fake'}),null);assert.equal(decodePublication({...draft,community:'../../fake'}),null);});
test('valid contract can be reused by another client',()=>assert.deepEqual(decodePublication(draft),draft));
