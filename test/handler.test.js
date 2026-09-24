const test = require('node:test');
const assert = require('node:assert/strict');

const { handleTextRequest } = require('../lib/text/handler');

test('handleTextRequest: title + body -> 200 with slug, minutes and words', () => {
  const result = handleTextRequest({ title: 'Hello World', body: 'one two three' });
  assert.deepStrictEqual(result, { status: 200, body: { slug: 'hello-world', minutes: 1, words: 3 } });
});

test('handleTextRequest: rounds reading time up to whole minutes', () => {
  const body = Array(201).fill('word').join(' ');
  const result = handleTextRequest({ title: 'Long Read', body });
  assert.deepStrictEqual(result, { status: 200, body: { slug: 'long-read', minutes: 2, words: 201 } });
});

test('handleTextRequest: missing title -> 400', () => {
  const result = handleTextRequest({ body: 'some text' });
  assert.deepStrictEqual(result, { status: 400, body: { error: 'title is required' } });
});

test('handleTextRequest: blank/whitespace-only title -> 400', () => {
  const result = handleTextRequest({ title: '   \n\t ', body: 'some text' });
  assert.deepStrictEqual(result, { status: 400, body: { error: 'title is required' } });
});

test('handleTextRequest: missing body -> 200 with minutes 0 and words 0', () => {
  const result = handleTextRequest({ title: 'No Body' });
  assert.deepStrictEqual(result, { status: 200, body: { slug: 'no-body', minutes: 0, words: 0 } });
});

test('handleTextRequest: array title (repeated query param) does not crash', () => {
  const result = handleTextRequest({ title: ['Hello', 'World'] });
  assert.deepStrictEqual(result, { status: 200, body: { slug: 'hello', minutes: 0, words: 0 } });
});

test('handleTextRequest: array body does not crash', () => {
  const result = handleTextRequest({ title: 'Array Body', body: ['one', 'two'] });
  assert.deepStrictEqual(result, { status: 200, body: { slug: 'array-body', minutes: 1, words: 1 } });
});

test('handleTextRequest: non-object query -> 400', () => {
  const result = handleTextRequest(undefined);
  assert.deepStrictEqual(result, { status: 400, body: { error: 'title is required' } });
});
