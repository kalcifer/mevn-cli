'use strict';

import execa from 'execa';
import inquirer from 'inquirer';

import { validateInstallation } from '../../utils/validate';

/**
 * Deploy to Heroku via Git integration
 *
 * @returns {Promise<void>}
 */

const deployWithGit = async () => {
  // Commands to be executed inorder to deploy the webapp to Heroku via Git integration.
  try {
    Promise.all([
      await execa('heroku', ['login'], { stdio: 'inherit' }),
      await execa('heroku', ['create'], { stdio: 'inherit' }),
      await execa('git', ['push', 'heroku', 'master'], { stdio: 'inherit' }),
    ]);
  } catch (err) {
    process.exit(1);
  }
};

/**
 * Deploy to Heroku with Docker
 *
 * @returns {Promise<void>}
 */

const deployWithDocker = async () => {
  // Commands to be executed inorder to deploy the webapp to Heroku as a Docker container.
  try {
    Promise.all([
      await execa('heroku', ['login'], { stdio: 'inherit' }),
      await execa('heroku', ['container:login'], { stdio: 'inherit' }),
      await execa('heroku', ['create'], { stdio: 'inherit' }),
      await execa('heroku', ['container:push', 'web'], { stdio: 'inherit' }),
      await execa('heroku', ['container:release', 'web'], { stdio: 'inherit' }),
      await execa('heroku', ['open'], { stdio: 'inherit' }),
    ]);
  } catch (err) {
    process.exit(1);
  }
};

/**
 * Deploy the webapp to Heroku
 *
 * @returns {Promise<void>}
 */

const deployToHeroku = async () => {
  await Promise.all([
    await validateInstallation('heroku'),
    await validateInstallation('git help -g'),
  ]);

  const { mode } = await inquirer.prompt([
    {
      name: 'mode',
      type: 'list',
      choices: ['Deploy with Git', 'Deploy with Docker'],
      message: 'Choose your preferred mode',
    },
  ]);

  mode === 'Deploy with Git' ? deployWithGit() : deployWithDocker();
};

module.exports = deployToHeroku;
