const path = require('path');
const fs = require('fs');
const { callCodegenAPI } = require('../api/callCodegenAPI');
const { copyFileToSandbox } = require('../fs/fileScanner');

async function runTestgen(targetPath, options) {
  const sandboxPath = await copyFileToSandbox(targetPath);

  const result = await callCodegenAPI({
    filePath: sandboxPath,
    task: options.task,
    coverageThreshold: options.coverageThreshold,
  });

  if (!result?.output) {
    console.error('❌ Codegen failed or returned no output');
    return;
  }

  if (options.dryRun) {
    console.log('🧪 Dry Run:\n\n' + result.output);
    return;
  }

  const fileName = path.basename(targetPath).replace('.tsx', '.test.js');
  const outputPath = options.outputFolder
    ? path.join(options.outputFolder, fileName)
    : targetPath.replace('.tsx', '.test.js');

  if (!result?.output || typeof result.output !== 'string') {
    console.error('❌ Invalid or empty test output received:', result.output);
    return;
  }

  console.log(`✅ Test output path: ${outputPath}`, result.output);
  try {
    fs.writeFileSync(outputPath, result.output, 'utf8');
    console.log(`✅ Test written to ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error writing test file: ${error}`);
  }
}

module.exports = { runTestgen };
