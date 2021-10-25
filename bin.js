#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import {createRequire} from 'node:module'

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

	// Write config file
	const require = createRequire(import.meta.url)
	const modulePath = require.resolve('@yuler/prettier-config')
	await fs.copyFile(
		modulePath,
		path.resolve(process.cwd(), '.prettierrc.json'),
	)
	console.log('Generate prettier config file `.prettierrc.json`')
}

main()
