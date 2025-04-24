import mongoose from 'mongoose';

const metadataSchema = new mongoose.Schema({
    filename: String,
    originalname: String,
    path: String,
    size: Number,
    mimetype: String,
    userId: String,
    md: {
        dt: Date,      // date taken
        loc: {
            p: String, // place
            c: String, // city
            co: String // country
        },
        dev: {
            m: String, // make
            mo: String // model
        }
    },
    ps: {
        p: Boolean,    // is processed
        h: Boolean,    // has metadata
        a: Date,       // last attempt
        n: Number,     // attempts
        e: String      // error
    }
});

export default mongoose.model('File', metadataSchema); 