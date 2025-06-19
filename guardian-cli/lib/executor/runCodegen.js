const path = require('path');
const fs = require('fs');
const { callCodegenAPI } = require('../api/callCodegenAPI');

async function runCodegen(targetPath, options) {
  const result = await callCodegenAPI({
    filePath: targetPath,
    task: options.task,
  });

  if (!result?.output) {
    console.error('❌ Codegen failed or returned no output');
    return;
  }

  if (options.dryRun) {
    console.log('🪄 Dry Run:\n\n' + result.output);
    return;
  }

  const ext = path.extname(targetPath);
  const fileName = path.basename(targetPath).replace(ext, `.generated${ext}`);
  const outputPath = options.outputFolder
    ? path.join(options.outputFolder, fileName)
    : targetPath.replace(ext, `.generated${ext}`);

  try {
    fs.writeFileSync(outputPath, result.output, 'utf8');
    console.log(`✅ Code written to ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error writing generated file: ${error}`);
  }
}

module.exports = { runCodegen };
