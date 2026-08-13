import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../dist/', import.meta.url))
const base = '/loraSys'
const textExtensions = new Set(['.html', '.xml', '.txt', '.webmanifest', '.css', '.js'])

async function visit(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) await visit(file)
    else if (textExtensions.has(path.extname(entry.name))) {
      const original = await fs.readFile(file, 'utf8')
      const prefixed = original
        .replaceAll(/(href|src|action)=(['"])\/(?!\/|loraSys(?:\/|['"]))/g, `$1=$2${base}/`)
        .replaceAll(/url\((['"]?)\/(?!\/|loraSys(?:\/|['"]))/g, `url($1${base}/`)
      if (prefixed !== original) await fs.writeFile(file, prefixed)
    }
  }
}

await visit(root)
