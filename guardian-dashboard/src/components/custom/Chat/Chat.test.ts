import { expect, test } from 'vitest';

test('adds 1 + 2 to equal 3', () => {
    // smoke test
    const one = 1;
    const two = 2;
    const three = 3;

    expect(one + two).toBe(three);
});