import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const QUALITY = 80; // Good balance between size and quality
const MAX_WIDTH = 1200; // Reasonable max width for web images

async function optimizeImages(dirPath) {
  try {
    const files = await readdir(dirPath);

    for (const file of files) {
      const filePath = join(dirPath, file);
      const ext = extname(file).toLowerCase();

      if (IMAGE_EXTENSIONS.includes(ext)) {
        const stats = await stat(filePath);
        const originalSize = stats.size;

        console.log(`Optimizing ${file} (${(originalSize / 1024).toFixed(1)}KB)...`);

        let sharpInstance = sharp(filePath);

        // Get image metadata
        const metadata = await sharpInstance.metadata();

        // Only resize if image is larger than max width
        if (metadata.width > MAX_WIDTH) {
          sharpInstance = sharpInstance.resize(MAX_WIDTH, null, {
            withoutEnlargement: true,
            fit: 'inside'
          });
        }

        // Create temporary file path
        const tempPath = filePath + '.tmp';

        // Compress based on format
        if (ext === '.jpg' || ext === '.jpeg') {
          sharpInstance = sharpInstance.jpeg({ quality: QUALITY, progressive: true });
        } else if (ext === '.png') {
          sharpInstance = sharpInstance.png({ quality: QUALITY, compressionLevel: 9 });
        }

        // Write to temporary file first
        await sharpInstance.toFile(tempPath);

        // Replace original file
        const fs = await import('fs/promises');
        await fs.rename(tempPath, filePath);

        const newStats = await stat(filePath);
        const newSize = newStats.size;
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

        console.log(`✅ Optimized: ${(newSize / 1024).toFixed(1)}KB (${savings}% smaller)`);
      }
    }
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

// Optimize images in static directory
console.log('🚀 Starting image optimization...\n');
await optimizeImages('./static');
await optimizeImages('./static/hackline');
console.log('\n✅ Image optimization complete!');