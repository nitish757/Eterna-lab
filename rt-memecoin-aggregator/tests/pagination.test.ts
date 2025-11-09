import { encodeCursor, decodeCursor } from '../src/utils/pagination.js';

test('cursor roundtrip', () => {
  const c = encodeCursor({ idx: 50 });
  expect(decodeCursor(c)?.idx).toBe(50);
});
