import { program } from 'commander';
import * as esbuild from 'esbuild';
import { join } from 'path';
import { readFile } from 'fs/promises';

const validEntries = ['server', 'lambda'] as const;
type ValidEntry = (typeof validEntries)[number];
const isValidEntry = (test: string): test is ValidEntry =>
  (validEntries as readonly string[]).includes(test);

program.requiredOption(
  `--target <${validEntries.join(', ')}>`,
  `Either ${validEntries.join(', ')}`,
);

program.parse();

const { target } = program.opts() as {
  target: string;
};

if (!isValidEntry(target)) {
  throw new Error(`Target must be one of ${validEntries.join(', ')}`);
}

esbuild.build({
  entryPoints: [join(__dirname, `../src/server/${target}.ts`)],
  bundle: true,
  minify: false,
  outdir: 'dist',
  platform: 'node',
  external: ['aws-sdk'],
  loader: {
    '.html': 'text',
  },
});
