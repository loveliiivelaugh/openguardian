import { writeFile } from 'fs/promises';

export async function writeLogs({
  testPath,
  output,
  coverage,
  attempts,
}: {
  testPath: string;
  output: string;
  coverage: number;
  attempts: number;
}) {
  const dir = testPath.split('/').slice(0, -1).join('/');
  const logPath = `${dir}/.guardian-codegen.log`;
  const changelogPath = `${dir}/.changelog.md`;

  await writeFile(logPath, `Coverage: ${coverage}%\nAttempts: ${attempts}`, 'utf8');
  await writeFile(
    changelogPath,
    `## Test generated for ${testPath}\n- Coverage: ${coverage}%\n- Attempts: ${attempts}\n\n\`\`\`ts\n${output}\n\`\`\`\n`,
    { flag: 'a' }
  );
}
