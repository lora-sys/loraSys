import sharp from 'sharp'
import { writeFile, mkdir, copyFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = 'C:/Users/YANBIN~1/AppData/Local/Temp/claude/C--Users-yanBingZhao-loraSys/5e5e54f7-edd7-4321-b2fe-f848f2ab5c96/images/6.webp'
const OUT_DIR = join(__dirname, '..', 'public', 'favicon')
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets', 'favicon')

await mkdir(OUT_DIR, { recursive: true })
await mkdir(ASSETS_DIR, { recursive: true })

// 1) Save source under assets
await copyFile(SRC, join(ASSETS_DIR, 'lora-v4-mark-1024.webp'))
console.log('copied source → src/assets/favicon/lora-v4-mark-1024.webp')

const base = sharp(SRC, { failOn: 'none' })
const meta = await base.metadata()
console.log('source meta:', meta.width, 'x', meta.height, meta.format)

// 2) PNG sizes
const pngSizes = [
  { name: 'lora-v4-favicon-32x32.png', size: 32 },
  { name: 'lora-v4-favicon-16x16.png', size: 16 },
  { name: 'lora-v4-apple-touch-icon.png', size: 180 },
  { name: 'lora-v4-android-chrome-192x192.png', size: 192 },
  { name: 'lora-v4-android-chrome-512x512.png', size: 512 },
  { name: 'lora-v4-mark-512.png', size: 512 }
]
for (const { name, size } of pngSizes) {
  const buf = await sharp(SRC, { failOn: 'none' })
    .resize(size, size, { fit: 'cover' })
    .png()
    .toBuffer()
  await writeFile(join(OUT_DIR, name), buf)
  console.log('wrote', name, buf.length, 'bytes')
}

// 3) Build multi-size ICO (16 + 32, PNG-encoded inside ICO container)
async function pngBuf(size) {
  return await sharp(SRC, { failOn: 'none' }).resize(size, size, { fit: 'cover' }).png().toBuffer()
}

const sizes = [16, 32, 48]
const images = await Promise.all(sizes.map(async (s) => ({ size: s, png: await pngBuf(s) })))

// ICO directory: 6 bytes header + 16 bytes per entry
const headerSize = 6 + 16 * images.length
const dirEntries = images.map((img, i) => {
  const offset = headerSize + images.slice(0, i).reduce((sum, x) => sum + x.png.length, 0)
  return { offset, size: img.png.length, width: img.size === 256 ? 0 : img.size, height: img.size === 256 ? 0 : img.size }
})

const ico = Buffer.alloc(headerSize + images.reduce((sum, x) => sum + x.png.length, 0))
let cursor = 0
// ICONDIR
ico.writeUInt16LE(0, cursor); cursor += 2 // reserved
ico.writeUInt16LE(1, cursor); cursor += 2 // type 1 = ICO
ico.writeUInt16LE(images.length, cursor); cursor += 2
// ICONDIRENTRY x N
for (const e of dirEntries) {
  ico.writeUInt8(e.width, cursor); cursor += 1
  ico.writeUInt8(e.height, cursor); cursor += 1
  ico.writeUInt8(0, cursor); cursor += 1 // color count
  ico.writeUInt8(0, cursor); cursor += 1 // reserved
  ico.writeUInt16LE(1, cursor); cursor += 2 // color planes
  ico.writeUInt16LE(32, cursor); cursor += 2 // bpp
  ico.writeUInt32LE(e.size, cursor); cursor += 4 // image size
  ico.writeUInt32LE(e.offset, cursor); cursor += 4 // image offset
}
// PNG payloads
for (const img of images) {
  img.png.copy(ico, cursor)
  cursor += img.png.length
}
await writeFile(join(OUT_DIR, 'lora-v4-favicon.ico'), ico)
console.log('wrote lora-v4-favicon.ico', ico.length, 'bytes, sizes:', sizes.join(','))

console.log('done')