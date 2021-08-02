#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'

// TODO: Use import `@yuler/prettier-config`
// https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-import-json
const configPath = './node_modules/@yuler/prettier-config/index.json'

// refs: https://prettier.io/docs/en/configuration.html
const CONFIT_FILES = [
	'.prettierrc',
	'.prettierrc.json',
	'.prettierrc.json5',
	'.prettierrc.yaml',
	'.prettierrc.yml',
	'.prettierrc.js',
	'.prettierrc.cjs',
	'prettier.config.js',
	'prettier.config.cjs',
	'.prettierrc.toml',
]

const pathExists = async path => {
	try {
		await fs.access(path)
		return true
	} catch {
		return false
	}
}

export default async function main() {
	// 1. `prettier` key in package.json
	const packagePath = path.resolve(process.cwd(), 'package.json')
	if (await pathExists(packagePath)) {
		const packageJson = JSON.parse(await fs.readFile(packagePath))
		if (packageJson.prettier) {
			console.log(
				'Has `prettier` config in package.json, please remove it first.',
			)
			return
		}
	}
	// 2. has config file?
	for (const file of CONFIT_FILES) {
		if (await pathExists(path.resolve(process.cwd(), file))) {
			console.log(`Exists config file: ${file}, please delete it first.`)
			return
		}
	}

	// Copy config file
	await fs.copyFile(
		new URL(configPath, import.meta.url),
		path.resolve(process.cwd(), '.prettierrc.json'),
	)
	console.log('Generate prettier config file `.prettierrc.json`')
}

main()
