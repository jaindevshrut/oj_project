import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const codesDir = path.join(__dirname, '../codes');

if(!fs.existsSync(codesDir)) {
    fs.mkdirSync(codesDir, { recursive: true });
}

const createFile = (extension, content) => {
    try {
        const jobId = uuidv4();
        const fileName = `${jobId}.${extension}`;
        const filePath = path.join(codesDir, fileName);
        
        fs.writeFileSync(filePath, content);
        
        return {
            success: true,
            fileName,
            filePath,
            jobId
        };
    } catch (error) {
        console.error('Error creating file:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export default createFile;