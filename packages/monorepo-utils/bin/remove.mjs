#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const USAGE = (
  'USAGE: remove.mjs PROJECT_DIR PROJECT_NAME\n' +
  '       lambda:delete PROJECT_NAME'
);

async function main() {
  const { positionals } = parseArgs({
    allowPositionals: true,
    args: process.argv,
    options: {},
    strict: true
  });
  const args = positionals.slice(2);

  const [projectDir, projectName] = args;

  if (!projectDir || !projectName) {
    console.info(USAGE);
    process.exitCode = 1;
    return null;
  } 

  console.log('remove.mjs run with args:', args);

  const projectPath = join(projectDir, projectName);
  console.log(`> Removing "${projectPath}" recursively`);
  await rm(projectPath, {
    errorOnExist: true,
    force: false,
    recursive: true,
  });

  console.log(`> Running "pnpm install" to clean up dependencies`);
  const installOutput = execSync(`pnpm install`).toString('utf8');
  console.log(installOutput);

  console.log('*** Done, please manually commit the changes now!');
}

await main();
