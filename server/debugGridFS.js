import mongoose from 'mongoose';
import 'dotenv/config';

const listFiles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const filesCollection = db.collection('uploads.files');
        
        const count = await filesCollection.countDocuments();
        console.log(`Total files in uploads.files: ${count}`);

        const files = await filesCollection.find({}).limit(20).toArray();
        console.log('Recent files (limit 20):');
        files.forEach(f => {
            console.log(`- ${f.filename} (${f.contentType}, ${f.length} bytes, uploaded: ${f.uploadDate})`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

listFiles();
