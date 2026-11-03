// Builds the deployable site in ./dist from the separately built apps.
// Run after every app has been built (npm run build does this for you).
import { cp, mkdir, rm, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = resolve(root, 'dist')

// Each app's build output and the path it is served from on zyankov.eu.
const parts = [
  { name: 'hub', from: 'apps/hub/dist', to: '.' },
  { name: 'letterwell', from: 'apps/letterwell/dist', to: 'letterwell' },
  { name: 'buildcalc', from: 'apps/buildcalc/dist/buildcalc/browser', to: 'calculators' },
]

for (const part of parts) {
  try {
    await stat(resolve(root, part.from, 'index.html'))
  } catch {
    throw new Error(`${part.name} has not been built: ${part.from}/index.html is missing.`)
  }
}

await rm(output, { force: true, recursive: true })
await mkdir(output, { recursive: true })

for (const part of parts) {
  await cp(resolve(root, part.from), resolve(output, part.to), { recursive: true })
  console.log(`${part.name}: ${part.from} -> dist/${part.to === '.' ? '' : `${part.to}/`}`)
}
