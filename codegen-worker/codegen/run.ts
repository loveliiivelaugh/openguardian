export async function runTestsOnFile(filePath: string) {
  const { stdout, stderr, success } = Bun.spawnSync({
    cmd: ['vitest', 'run', '--coverage', filePath],
    stdout: 'pipe',
    stderr: 'pipe',
  });

  const output = new TextDecoder().decode(stdout);
  const errorOutput = new TextDecoder().decode(stderr);

  const coverageMatch = output.match(/Coverage.*?(\d+)%/);
  const coverage = coverageMatch ? parseInt(coverageMatch[1], 10) : 0;

  return {
    passed: success,
    coverage,
    output: output + errorOutput,
  };
}
