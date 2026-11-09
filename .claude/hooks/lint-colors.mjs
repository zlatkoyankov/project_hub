// Claude Code hook: after Claude edits a .css or .scss file, run the colour lint.
// A colour literal outside packages/design-system/tokens.css is reported back to Claude
// (exit code 2), so it fixes it in the same turn instead of the CI catching it later.
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

let input = ''
for await (const chunk of process.stdin) input += chunk
let file = ''
try {
  const data = JSON.parse(input)
  file = data.tool_input?.file_path ?? ''
} catch {
  process.exit(0)
}
if (!/\.(css|scss)$/.test(file)) process.exit(0)

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const run = spawnSync(process.execPath, [resolve(root, 'scripts/lint-colors.mjs')], { encoding: 'utf8' })
if (run.status !== 0) {
  process.stderr.write(`${run.stdout}${run.stderr}`)
  process.exit(2)
}
