import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);
const outputDir = path.join(__dirname, '../output');
const codesDir = path.join(__dirname, '../codes');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const executeFile = async (fileName, input = '') => {
    try {
        const jobId = path.basename(fileName, path.extname(fileName));
        const extension = path.extname(fileName);
        const filePath = path.join(codesDir, fileName);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return {
                success: false,
                error: 'File not found'
            };
        }

        let outputFilePath = path.join(outputDir, jobId);
        let compileCommand = '';
        let runCommand = '';

        switch(extension) {
            case '.c':
                outputFilePath += '.exe'; // For Windows compatibility
                compileCommand = `gcc "${filePath}" -o "${outputFilePath}"`;
                runCommand = `"${outputFilePath}"`;
                break;
            case '.cpp':
                outputFilePath += '.exe';
                compileCommand = `g++ "${filePath}" -o "${outputFilePath}"`;
                runCommand = `"${outputFilePath}"`;
                break;
            case '.java':
                // Compile Java first
                compileCommand = `javac "${filePath}"`;
                const javaClassName = path.basename(fileName, '.java');
                runCommand = `java -cp "${codesDir}" ${javaClassName}`;
                break;
            case '.py':
                runCommand = `python "${filePath}"`;
                break;
            default:
                return {
                    success: false,
                    error: `Unsupported file extension: ${extension}`
                };
        }

        // Compilation step (if needed)
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
            
            // Set timeout to prevent infinite loops
            const { stdout, stderr } = await execAsync(runCommand, { 
                timeout: 10000, // 10 seconds timeout
                input: input 
            });

            // Clean up temporary files
            cleanupFiles(fileName, outputFilePath, extension);

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
            cleanupFiles(fileName, outputFilePath, extension);
            
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

// Helper function to clean up temporary files
const cleanupFiles = (fileName, outputFilePath, extension) => {
    try {
        const filePath = path.join(codesDir, fileName);
        
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