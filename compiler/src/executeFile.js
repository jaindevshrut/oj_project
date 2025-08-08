import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputDir = path.join(__dirname, './public/temp/output');
const codesDir = path.join(__dirname, './public/temp/codes');


const executeFile = async (filePath, inputFile, timeLimit = 10000) => {
    try {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
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
                const { stdout: compileStdout, stderr: compileStderr } = await execAsync(compileCommand);
                
                if (compileStderr && !compileStderr.includes('warning')) {
                    return {
                        success: false,
                        error: 'Compilation Error',
                        details: compileStderr
                    };
                }
                
            } catch (compileError) {
                return {
                    success: false,
                    error: 'Compilation Failed',
                    details: compileError.stderr || compileError.message
                };
            }
        }

        // Execution step with time tracking
        try {
            const startTime = Date.now();
            const { stdout, stderr } = await execAsync(runCommand, { 
                timeout: timeLimit
            });
            const executionTime = Date.now() - startTime;

            // Clean up temporary files
            cleanupFiles(filePath, outputFilePath, inputFile, extension);

            if (stderr && !stderr.includes('warning')) {
                return {
                    success: false,
                    error: 'Runtime Error',
                    details: stderr,
                    output: stdout || '',
                    executionTime: executionTime
                };
            }

            return {
                success: true,
                output: stdout || 'Program executed successfully (no output)',
                error: null,
                executionTime: executionTime
            };

        } catch (executionError) {
            // Clean up on error
            cleanupFiles(filePath, outputFilePath, inputFile, extension);
            
            const isTimeout = executionError.killed && executionError.signal === 'SIGTERM';
            
            return {
                success: false,
                error: isTimeout ? 'Time Limit Exceeded' : 'Execution Failed',
                details: executionError.stderr || executionError.message,
                timeout: isTimeout,
                executionTime: isTimeout ? timeLimit : 0
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

const cleanupFiles = (filePath, outputFilePath,inputFile, extension) => {
    try {
        
        // Remove source file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        if(fs.existsSync(inputFile)){
            fs.unlinkSync(inputFile);
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