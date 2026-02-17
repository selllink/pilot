/**
 * Genera solo versiones optimizadas en public/ (favicon-16, favicon-32,
 * apple-touch-icon, logo-64/128 en PNG y WebP). En el repo solo se suben estas.
 *
 * Uso:
 * 1. Crea la carpeta assets-src/ y pon ahí favicon.png y/o logo.png (originales).
 * 2. npm run optimize-images
 * 3. Las versiones optimizadas quedan en public/. Borra public/favicon.png
 *    y public/logo.png si los tuvieras; no los subas (están en .gitignore).
 */
import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const assetsSrcDir = join(rootDir, 'assets-src')
const publicDir = join(rootDir, 'public')

async function optimizeFavicon() {
  const input = join(assetsSrcDir, 'favicon.png')
  try {
    const image = sharp(input)
    const sizes = [
      { name: 'favicon-16.png', size: 16 },
      { name: 'favicon-32.png', size: 32 },
      { name: 'apple-touch-icon.png', size: 180 },
    ]
    for (const { name, size } of sizes) {
      await image
        .clone()
        .resize(size, size)
        .png({ compressionLevel: 9 })
        .toFile(join(publicDir, name))
      console.log(`  ${name} (${size}x${size})`)
    }
    return true
  } catch (err) {
    console.warn('  assets-src/favicon.png not found or invalid, skipping')
    return false
  }
}

async function optimizeLogo() {
  const input = join(assetsSrcDir, 'logo.png')
  try {
    const image = sharp(input)
    const sizes = [
      { name: 'logo-64', size: 64 },
      { name: 'logo-128', size: 128 },
    ]
    for (const { name, size } of sizes) {
      const resized = image.clone().resize(size, size)
      await resized.clone().png({ compressionLevel: 9 }).toFile(join(publicDir, `${name}.png`))
      await resized.clone().webp({ quality: 85 }).toFile(join(publicDir, `${name}.webp`))
      console.log(`  ${name}.png, ${name}.webp (${size}x${size})`)
    }
    return true
  } catch (err) {
    console.warn('  assets-src/logo.png not found or invalid, skipping')
    return false
  }
}

async function main() {
  await mkdir(publicDir, { recursive: true })
  await mkdir(assetsSrcDir, { recursive: true })
  console.log('Reading from assets-src/, writing optimized files to public/...')
  console.log('Favicon:')
  await optimizeFavicon()
  console.log('Logo:')
  await optimizeLogo()
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
