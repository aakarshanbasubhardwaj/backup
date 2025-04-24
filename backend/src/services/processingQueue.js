import File from '../../db/models/metadata.js';
import { extractMetadata } from './metadataExtractor.js';

const MAX_RETRIES = 3;

export async function addToQueue(fileId) {
    try {
        const file = await File.findById(fileId);
        if (!file) {
            console.error(`File not found: ${fileId}`);
            return;
        }

        try {
            const metadata = await extractMetadata(file);
            await File.updateOne(
                { _id: fileId },
                { $set: metadata }
            );
        } catch (error) {
            await File.updateOne(
                { _id: fileId },
                {
                    $inc: { 'ps.n': 1 },
                    $set: {
                        'ps.e': error.message,
                        'ps.a': new Date()
                    }
                }
            );
        }
    } catch (error) {
        console.error(`Error processing file ${fileId}:`, error);
    }
}

export async function processMultipleFiles(fileIds) {
    // Process files in parallel with a concurrency limit
    const concurrencyLimit = 5; // Process 5 files at a time
    const chunks = [];
    
    for (let i = 0; i < fileIds.length; i += concurrencyLimit) {
        chunks.push(fileIds.slice(i, i + concurrencyLimit));
    }

    for (const chunk of chunks) {
        await Promise.all(chunk.map(fileId => addToQueue(fileId)));
    }
} 