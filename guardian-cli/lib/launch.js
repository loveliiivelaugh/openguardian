// guardian-cli/src/commands/launch.ts

import { Command } from 'commander';
import inquirer from 'inquirer';
import { runDockerSetup } from './docker';
import { runNativeSetup } from './native';

export const launch = new Command('launch')
  .description('Guardian OSS Launch Wizard')
  .action(async () => {
    console.log("\nWelcome to Guardian OSS Setup Wizard\n");

    const { mode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'Which mode do you want to run?',
        choices: ['Docker Compose', 'Native Host'],
      },
    ]);

    if (mode === 'Docker Compose') {
      await runDockerSetup();
    } else {
      await runNativeSetup();
    }
  });
