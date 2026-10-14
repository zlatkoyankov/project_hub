import { cp, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDirectory = resolve(projectRoot, '../test-app/dist')
const targetDirectory = resolve(projectRoot, 'public/letterwell')

await rm(targetDirectory, { force: true, recursive: true })
await cp(sourceDirectory, targetDirectory, { recursive: true })
