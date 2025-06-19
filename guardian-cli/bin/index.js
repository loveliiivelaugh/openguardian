#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { runTestgen } = require('../lib/executor/runTestgen');

const argv = yargs(hideBin(process.argv))
  .command('testgen <target>', 'Run testgen on a file', (yargs) => {
    return yargs
      .positional('target', { type: 'string', describe: 'Target file path' })
      .option('task', {
        alias: 't',
        type: 'string',
        default: 'Generate unit tests',
        describe: 'Prompt/task to run',
      })
      .option('output', {
        alias: 'o',
        type: 'string',
        describe: 'Output folder',
      })
      .option('dry-run', {
        type: 'boolean',
        default: false,
        describe: 'Print output instead of writing file',
      })
      .option('coverage-threshold', {
        type: 'number',
        default: 90,
        describe: 'Desired test coverage %',
      });
  })
  .command('codegen <target>', 'Run codegen on a file', (yargs) => {
    return yargs
      .positional('target', { type: 'string', describe: 'Target file path' })
      .option('task', {
        alias: 't',
        type: 'string',
        default: 'Generate the implementation code',
        describe: 'Prompt/task to run',
      })
      .option('output', {
        alias: 'o',
        type: 'string',
        describe: 'Output folder',
      })
      .option('dry-run', {
        type: 'boolean',
        default: false,
        describe: 'Print output instead of writing file',
      });
  })
  .help()
  .parse();

if (argv._[0] === 'testgen') {
  runTestgen(argv.target, {
    task: argv.task,
    outputFolder: argv.output,
    dryRun: argv.dryRun,
    coverageThreshold: argv.coverageThreshold,
  });
}


if (argv._[0] === 'codegen') {
  runCodegen(argv.target, {
    task: argv.task,
    outputFolder: argv.output,
    dryRun: argv.dryRun,
  });
}
