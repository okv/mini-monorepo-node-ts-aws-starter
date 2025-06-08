#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { access, constants as fsconst, cp, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const USAGE = (
  'USAGE: create#cmd.mjs TEMPLATE PROJECT_DIR PROJECT_NAME\n' +
  '       lambda:create PROJECT_NAME'
);
const NAME_PLACEHOLDER = '%PROJECT_NAME%';

async function isFileExists(filePath) {
  try {
    await access(filePath, fsconst.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function replaceInFile(filePath, from, to) {
  const fileExists = await isFileExists(filePath);
  if (!fileExists) {
    console.log(`Skipping ${filePath} because it doesn't exist`);
    return null;
  }

  const content = await readFile(filePath, { encoding: 'utf8' });
  const updated = content.replaceAll(from, to);
  if (content !== updated) {
    await writeFile(filePath, updated, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

async function main() {
  const { positionals } = parseArgs({
    allowPositionals: true,
    args: process.argv,
    options: {},
    strict: true
  });
  const args = positionals.slice(2);

  const [templatePath, projectDir, projectName] = args;

  if (!templatePath || !projectDir || !projectName) {
    console.info(USAGE);
    process.exitCode = 1;
    return null;
  } 

  console.log('create#cmd.mjs run with args:', args);

  const projectPath = join(projectDir, projectName);
  console.log(`Copying "${templatePath}" to "${projectPath}"`);
  await cp(templatePath, projectPath, {
    errorOnExist: true,
    force: false,
    recursive: true,
  });

  console.log(`Updating "${projectPath}"`);
  await replaceInFile(join(projectPath, 'package.json'), NAME_PLACEHOLDER, projectName);
  await replaceInFile(join(projectPath, 'README.md'), NAME_PLACEHOLDER, projectName);

  console.log(`Running "pnpm install" for "${projectName}"`);
  spawnSync('pnpm', ['--filter', projectName]);

  console.log('Done, please manually commit the changes now!');
}

await main();
