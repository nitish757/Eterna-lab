import { mergeTokens } from '../src/services/merge.js';

test('merge by tokenAddress and prefer newest fields', () => {
  const merged = mergeTokens([
    { tokenAddress: 'a', tokenName: 'X', tokenTicker: 'X', volumeSol: 10 },
    { tokenAddress: 'a', priceSol: 2, volumeSol: 5 },
    { tokenAddress: 'b', tokenName: 'Y' }
  ]);
  expect(merged.length).toBe(2);
  const a = merged.find(t => t.tokenAddress === 'a')!;
  expect(a.volumeSol).toBe(15);
  expect(a.priceSol).toBe(2);
});
