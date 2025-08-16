import { expect, test } from 'vitest';

test('minus 2 from 3 to equal 1', () => {
    // smoke test
    const one = 1;
    const two = 2;
    const three = 3;

    expect(three - two).toBe(one);
});
