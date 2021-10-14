import { build } from "esbuild";
import fs from 'fs/promises';
import path from 'path';

const cleanup = async (dirname) => {
	await fs.rm(dirname, {recursive: true, force: true});
};

const copydir = async (src, dest) => {
	const entries = await fs.readdir(path.resolve(src));
	const operations = [];

	await fs.mkdir(path.resolve(dest), {recursive: true});

	for (const entry of entries) {
		const lstat = await fs.lstat(path.resolve(src, entry));

		if (lstat.isDirectory()) {
			operations.push(copydir(path.resolve(src, entry), path.resolve(dest, entry)));
		} else if (lstat.isFile()) {
			operations.push(fs.copyFile(path.resolve(src, entry), path.resolve(dest, entry)));
		}
	}

	await Promise.all(operations);
};

const entrybase = path.resolve('src');
const outbase = path.resolve('built');

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
	entryPoints: [
		path.resolve(entrybase, 'main/main.ts'),
	],
	outdir: path.resolve(outbase, 'main'),
	platform: 'node',
	format: 'cjs',
	target: 'node14',
	minify: true,
};

await cleanup(outbase);
await copydir(path.resolve(entrybase, 'renderer'), path.resolve(outbase, 'renderer'));
await build(buildOptions);
