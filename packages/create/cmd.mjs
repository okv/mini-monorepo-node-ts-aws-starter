#!/usr/bin/env node

import { cp } from 'node:fs/promises';
import { join } from 'node:path';

const USAGE = 'USAGE: create#cmd.mjs [SRC] [DST_DIR] [NAME]'

async function main() {
  const args = [...process.argv.slice(2)]
  const [src, dstDir, dstName] = args;

  if (!src || !dstDir || !dstName) {
    console.info(USAGE);
    process.exitCode = 1;
    return null;
  } 

  console.log('create#cmd.mjs run with args:', args);
  const dst = join(dstDir, dstName);

  console.log('Copying the template:', { src, dst });
  await cp(src, dst, {
    errorOnExist: true,
    force: false,
    recursive: true,
  });

  console.log('Done');
}

await main();
