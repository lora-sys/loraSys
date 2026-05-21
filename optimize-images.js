import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';

const QUALITY = 75;          // Good balance between size and quality
const MAX_WIDTH = 1000;      // Reasonable max width for web display

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

let totalSaved = 0;
let totalFiles = 0;

async function optimizeImages(dirPath) {
	try {
		const files = await readdir(dirPath);

		for (const file of files) {
			const filePath = join(dirPath, file);
			const ext = extname(file).toLowerCase();

			if (!SUPPORTED_EXTENSIONS.includes(ext)) continue;

			const stats = await stat(filePath);
			const originalSize = stats.size;
			const nameWithoutExt = basename(file, ext);

			console.log(`\n📷 ${file} (${(originalSize / 1024).toFixed(1)}KB)`);

			let sharpInstance = sharp(filePath);
			const metadata = await sharpInstance.metadata();

			// Resize if wider than MAX_WIDTH
			if (metadata.width > MAX_WIDTH) {
				sharpInstance = sharpInstance.resize(MAX_WIDTH, null, {
					withoutEnlargement: true,
					fit: 'inside'
				});
			}

			// --- Option 1: Optimize original format in-place ---
			const tempPath = filePath + '.tmp';
			if (ext === '.jpg' || ext === '.jpeg') {
				sharpInstance.jpeg({ quality: QUALITY, progressive: true, mozjpeg: true });
			} else if (ext === '.png') {
				sharpInstance.png({ quality: QUALITY, compressionLevel: 9, palette: true });
			}

			await sharpInstance.toFile(tempPath);
			await rename(tempPath, filePath);

			const newStats = await stat(filePath);
			const savings = originalSize - newStats.size;
			totalSaved += savings;

			console.log(`   ✅ Optimized: ${(newStats.size / 1024).toFixed(1)}KB (${((savings / originalSize) * 100).toFixed(1)}% saved)`);

			// --- Option 2: Also generate WebP version ---
			const webpPath = join(dirPath, nameWithoutExt + '.webp');
			let webpSharp = sharp(filePath);

			// Re-read the newly compressed file for WebP conversion
			if (metadata.width > MAX_WIDTH) {
				webpSharp = webpSharp.resize(MAX_WIDTH, null, {
					withoutEnlargement: true,
					fit: 'inside'
				});
			}

			webpSharp = webpSharp.webp({ quality: QUALITY });
			await webpSharp.toFile(webpPath);

			const webpStats = await stat(webpPath);
			const webpSavings = originalSize - webpStats.size;
			console.log(`   🌐 WebP:    ${(webpStats.size / 1024).toFixed(1)}KB (${((webpSavings / originalSize) * 100).toFixed(1)}% saved)`);

			totalFiles++;
		}
	} catch (error) {
		console.error(`Error processing ${dirPath}:`, error.message);
	}
}

console.log('🚀 Image Optimization Script\n');
console.log('This script:');
console.log('  1. Compresses JPEG/PNG in-place (progressive/mozjpeg for JPEG, palette for PNG)');
console.log('  2. Generates WebP versions alongside originals');
console.log('  - Max width: ' + MAX_WIDTH + 'px');
console.log('  - Quality: ' + QUALITY + '\n');

// Process all image directories
const dirs = [
	'./static/images/anime',
	'./static/images/favorites',
	'./static/images',
	'./src/lib/imgs'
];

for (const dir of dirs) {
	console.log(`\n📁 Processing: ${dir}`);
	console.log('─'.repeat(50));
	await optimizeImages(dir);
}

console.log('\n' + '═'.repeat(50));
console.log(`\n✅ Done! ${totalFiles} files processed.`);
console.log(`   Total size saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);

console.log('\n📌 Next steps:');
console.log('   Run script to update .jpg → .webp references in resume.ts:');
console.log('   node scripts/update-webp-refs.js');
