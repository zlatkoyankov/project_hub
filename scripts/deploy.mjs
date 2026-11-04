// Uploads ./dist to the hosting account over FTPS and removes files that are no longer in the build.
//
//   npm run deploy            shows what would change, writes nothing
//   npm run deploy -- --yes   uploads and deletes
//
// Login details come from .env.deploy in the repository root (not in git); see .env.deploy.example.
import { readFile, readdir, stat } from 'node:fs/promises'
import { dirname, join, posix, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from 'basic-ftp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const apply = process.argv.includes('--yes')

// Never deleted on the server even though the build does not have them: server and panel files.
const KEEP = [/(^|\/)\./, /(^|\/)cgi-bin(\/|$)/, /(^|\/)php\.ini$/, /(^|\/)error_log$/]
const kept = (path) => KEEP.some((pattern) => pattern.test(path))

async function loadEnv() {
  let text
  try {
    text = await readFile(resolve(root, '.env.deploy'), 'utf8')
  } catch {
    throw new Error('.env.deploy is missing. Copy .env.deploy.example to .env.deploy and fill it in.')
  }
  const env = {}
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/)
    if (match) env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  for (const key of ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD']) {
    if (!env[key]) throw new Error(`${key} is not set in .env.deploy.`)
  }
  return env
}

/** Every file under a local folder: relative path -> size. */
async function localFiles(dir, prefix = '', out = new Map()) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) await localFiles(join(dir, entry.name), path, out)
    else if (entry.isFile()) out.set(path, (await stat(join(dir, entry.name))).size)
  }
  return out
}

/** Every file and folder under a remote folder. */
async function remoteTree(client, dir, prefix = '', files = new Map(), dirs = []) {
  for (const entry of await client.list(dir)) {
    if (entry.name === '.' || entry.name === '..') continue
    const path = prefix ? `${prefix}/${entry.name}` : entry.name
    if (kept(path)) continue
    if (entry.isDirectory) {
      dirs.push(path)
      await remoteTree(client, posix.join(dir, entry.name), path, files, dirs)
    } else files.set(path, entry.size)
  }
  return { files, dirs }
}

const env = await loadEnv()
const remoteRoot = env.FTP_DIR || '/public_html'

try {
  await stat(join(dist, 'index.html'))
} catch {
  throw new Error('dist/index.html is missing. Run npm run build first.')
}

const local = await localFiles(dist)
const client = new Client(30_000)
try {
  await client.access({
    host: env.FTP_HOST,
    port: Number(env.FTP_PORT || 21),
    user: env.FTP_USER,
    password: env.FTP_PASSWORD,
    secure: env.FTP_SECURE !== 'false',
    secureOptions: { rejectUnauthorized: env.FTP_ALLOW_SELF_SIGNED !== 'true' },
  })
  const remote = await remoteTree(client, remoteRoot)

  const uploads = [...local.keys()].sort()
  const changed = uploads.filter((path) => remote.files.get(path) !== local.get(path))
  const deletions = [...remote.files.keys()].filter((path) => !local.has(path)).sort()
  const localDirs = new Set([...local.keys()].flatMap((path) => path.split('/').slice(0, -1).map((_, i, parts) => parts.slice(0, i + 1).join('/'))))
  const emptyDirs = remote.dirs.filter((dir) => !localDirs.has(dir)).sort((a, b) => b.length - a.length)

  console.log(`${uploads.length} files to upload (${changed.length} new or a different size), ${deletions.length} to delete, ${emptyDirs.length} folders to remove.`)
  for (const path of deletions) console.log(`  delete  ${path}`)
  for (const dir of emptyDirs) console.log(`  rmdir   ${dir}/`)

  if (!apply) {
    console.log('\nNothing was changed. Run "npm run deploy -- --yes" to apply.')
  } else {
    // Upload first so the site is never missing a file, then remove what the build no longer has.
    for (const path of uploads) {
      await client.ensureDir(posix.join(remoteRoot, posix.dirname(path)))
      await client.uploadFrom(join(dist, path), posix.join(remoteRoot, path))
    }
    console.log(`Uploaded ${uploads.length} files.`)
    for (const path of deletions) await client.remove(posix.join(remoteRoot, path))
    for (const dir of emptyDirs) await client.removeEmptyDir(posix.join(remoteRoot, dir)).catch(() => console.warn(`  could not remove ${dir}/ (not empty?)`))
    console.log(`Deleted ${deletions.length} files and ${emptyDirs.length} folders. Done.`)
  }
} finally {
  client.close()
}
