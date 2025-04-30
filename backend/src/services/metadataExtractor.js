import fs from 'fs';
import { promisify } from 'util';
import exifr from 'exifr';
import NodeGeocoder from 'node-geocoder';

const readFile = promisify(fs.readFile);

// Initialize geocoder
const options = {
    provider: 'openstreetmap',
    addressdetails: 1  // This ensures we get the detailed address object
};

const geocoder = NodeGeocoder(options);

// Track last geocoding request time
let lastGeocodingTime = 0;

// Function to ensure rate limit compliance
async function waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastGeocodingTime;
    if (timeSinceLastRequest < 1000) { // Wait for 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
    }
    lastGeocodingTime = Date.now();
}

export async function extractMetadata(file) {
    try {
        
        // Parse EXIF data with specific options
        const exifData = await exifr.parse(file.path, {
            gps: true,
            tiff: true,
            exif: true,
            icc: true,
            xmp: true
        });
        

        // Get location data from coordinates if available
        let locationData = {
            p: null,
            c: null,
            co: null
        };

        if (exifData.latitude && exifData.longitude) {
            try {
                await waitForRateLimit();
                const geoResults = await geocoder.reverse({ lat: exifData.latitude, lon: exifData.longitude });
                if (geoResults && geoResults.length > 0) {
                    const result = geoResults[0];
                    
                    locationData = {
                        p: result.formattedAddress || null,
                        c: result.city || null,
                        co: result.country || null
                    };
                }
            } catch (geoError) {
                console.error('Error during geocoding:', geoError);
            }
        }
        
        if (!exifData || Object.keys(exifData).length === 0) {
            console.log('No EXIF data found');
            return {
                ps: {
                    p: true,
                    h: false,
                    a: new Date(),
                    n: 1
                }
            };
        }

        // Parse and validate date
        let dateTaken = null;
        if (exifData.DateTimeOriginal) {
            try {
                dateTaken = new Date(exifData.DateTimeOriginal);
                if (isNaN(dateTaken.getTime())) {
                    console.log('Invalid date parsed:', exifData.DateTimeOriginal);
                    dateTaken = null;
                }
            } catch (error) {
                console.error('Error parsing date:', error);
                dateTaken = null;
            }
        }

        const metadata = {
            md: {
                dt: dateTaken,
                loc: locationData,
                dev: {
                    m: exifData.Make || null,
                    mo: exifData.Model || null
                }
            },
            ps: {
                p: true,
                h: true,
                a: new Date(),
                n: 1
            }
        };

        return metadata;
    } catch (error) {
        console.error('Metadata extraction error:', error);
        return {
            ps: {
                p: true,
                h: false,
                a: new Date(),
                n: 1,
                e: error.message
            }
        };
    }
}
