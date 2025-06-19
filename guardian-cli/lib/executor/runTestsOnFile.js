import { execSync } from 'child_process';

export async function runTestsOnFile(filePath) {
  try {
    const output = execSync(`vitest run --coverage --include ${filePath}`, {
      encoding: 'utf8',
    });

    // TODO: Parse real coverage from output or use coverage JSON file
    return {
      passed: true,
      coverage: 95, // placeholder
      output,
    };
  } catch (err) {
    return {
      passed: false,
      coverage: 0,
      output: err.message,
    };
  }
}
