import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/assets');

const jobs = [
    { input: 'profile.png', output: 'profile.webp', width: 400 },
    { input: 'artavecmoi_1.png', output: 'artavecmoi_1.webp', width: 1200 },
    { input: 'artavecmoi_logo.png', output: 'artavecmoi_logo.webp', width: 600 },
];

for (const job of jobs) {
    const inputPath = path.join(assetsDir, job.input);
    const outputPath = path.join(assetsDir, job.output);
    if (!fs.existsSync(inputPath)) {
        console.warn(`Missing: ${job.input}`);
        continue;
    }
    try {
        await sharp(inputPath)
            .resize({ width: job.width, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outputPath);
        const inSize = fs.statSync(inputPath).size;
        const outSize = fs.statSync(outputPath).size;
        console.log(`${job.input} (${(inSize / 1024).toFixed(0)}kB) -> ${job.output} (${(outSize / 1024).toFixed(0)}kB) [${Math.round((1 - outSize / inSize) * 100)}% saved]`);
    } catch (e) {
        console.error(`Failed ${job.input}: ${e.message}`);
    }
}
