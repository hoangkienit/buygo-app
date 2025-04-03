const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const uploadsDir = path.join(__dirname, 'uploads');

// Function to delete files in the uploads folder
const clearUploads = () => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads folder:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(uploadsDir, file);
            fs.unlink(filePath, err => {
                if (err) {
                    console.error(`Failed to delete ${filePath}:`, err);
                } else {
                    console.log(`Deleted: ${filePath}`);
                }
            });
        });
    });
};

// Schedule the job to run every day at midnight (00:00)
cron.schedule('0 0 * * *', () => {
    console.log('Running job: Clearing uploads folder (Every Day at Midnight)');
    clearUploads();
});

module.exports = { clearUploads };
