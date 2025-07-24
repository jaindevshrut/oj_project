import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputDir = path.join(__dirname, 'output');
const codesDir = path.join(__dirname, 'codes');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const executeFile = async (filePath, inputFile) => {
    try {
        const jobId = path.basename(filePath).split('.')[0];
        const extension = path.extname(filePath);
        let outputFilePath = path.join(outputDir, jobId);
        let compileCommand = '';
        let runCommand = '';

        switch(extension) {
            case '.c':
                outputFilePath += '.exe';
                compileCommand = `gcc "${filePath}" -o "${outputFilePath}"`;
                runCommand = `"${outputFilePath}" < "${inputFile}"`;
                break;
            case '.cpp':
                outputFilePath += '.exe';
                compileCommand = `g++ "${filePath}" -o "${outputFilePath}"`;
                runCommand = `"${outputFilePath}" < "${inputFile}"`;
                break;
            case '.java':
                runCommand = `java ${filePath} < "${inputFile}"`;
                break;
            case '.py':
                runCommand = `python "${filePath}" < "${inputFile}"`;
                break;
            default:
                return {
                    success: false,
                    error: `Unsupported file extension: ${extension}`
                };
        }

        if (compileCommand) {
            try {
                console.log('Compiling:', compileCommand);
                const { stdout: compileStdout, stderr: compileStderr } = await execAsync(compileCommand);
                
                if (compileStderr && !compileStderr.includes('warning')) {
                    return {
                        success: false,
                        error: 'Compilation Error',
                        details: compileStderr
                    };
                }
                
                console.log('Compilation successful');
            } catch (compileError) {
                return {
                    success: false,
                    error: 'Compilation Failed',
                    details: compileError.stderr || compileError.message
                };
            }
        }

        // Execution step
        try {
            console.log('Executing:', runCommand);
            
            const { stdout, stderr } = await execAsync(runCommand, { 
                timeout: 10000 // 10 seconds timeout
            });

            // Clean up temporary files
            cleanupFiles(filePath, outputFilePath, extension);

            if (stderr && !stderr.includes('warning')) {
                return {
                    success: false,
                    error: 'Runtime Error',
                    details: stderr,
                    output: stdout || ''
                };
            }

            return {
                success: true,
                output: stdout || 'Program executed successfully (no output)',
                error: null
            };

        } catch (executionError) {
            // Clean up on error
            cleanupFiles(filePath, outputFilePath, extension);
            
            return {
                success: false,
                error: 'Execution Failed',
                details: executionError.stderr || executionError.message,
                timeout: executionError.killed && executionError.signal === 'SIGTERM'
            };
        }

    } catch (error) {
        console.error('Unexpected error in executeFile:', error);
        return {
            success: false,
            error: 'Internal Server Error',
            details: error.message
        };
    }
};

const cleanupFiles = (filePath, outputFilePath, extension) => {
    try {
        
        // Remove source file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        // Remove compiled file
        if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }
        
        // Remove .class file for Java
        if (extension === '.java') {
            const classFile = filePath.replace('.java', '.class');
            if (fs.existsSync(classFile)) {
                fs.unlinkSync(classFile);
            }
        }
    } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
    }
};

export default executeFile;