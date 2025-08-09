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
                const className = path.basename(filePath, '.java');
                const javaDir = path.dirname(filePath);
                compileCommand = `javac "${filePath}"`;
                runCommand = `cd "${javaDir}" && java ${className} < "${inputFile}"`;
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

            // Clean up only input file and executable (not source file)
            cleanupFiles(null, outputFilePath, inputFile, extension, false);

            if (stderr && !stderr.includes('warning')) {
                return {
                    success: false,
                    error: 'Runtime Error',
                    details: stderr,
                    output: stdout || '',
                    executionTime: executionTime,
                    filePath: filePath // Return file path for later cleanup
                };
            }

            return {
                success: true,
                output: stdout || '',
                error: null,
                executionTime: executionTime,
                filePath: filePath // Return file path for later cleanup
            };

        } catch (executionError) {
            // Clean up on error (only input file and executable, not source file)
            cleanupFiles(null, outputFilePath, inputFile, extension, false);
            
            const isTimeout = executionError.killed && executionError.signal === 'SIGTERM';
            
            return {
                success: false,
                error: isTimeout ? 'Time Limit Exceeded' : 'Execution Failed',
                details: executionError.stderr || executionError.message,
                timeout: isTimeout,
                executionTime: isTimeout ? timeLimit : 0,
                filePath: filePath // Return file path for later cleanup
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

const cleanupFiles = (filePath, outputFilePath, inputFile, extension, cleanupSource = true) => {
    try {
        
        // Remove source file only if requested
        if (cleanupSource && filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        // Always remove input file
        if(inputFile && fs.existsSync(inputFile)){
            fs.unlinkSync(inputFile);
        }
        
        // Remove compiled file
        if (outputFilePath && fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }
        
        // Remove .class file for Java
        if (extension === '.java' && filePath) {
            const classFile = filePath.replace('.java', '.class');
            if (fs.existsSync(classFile)) {
                fs.unlinkSync(classFile);
            }
        }
    } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
    }
};

// Function to cleanup source files after all test cases are done
const cleanupSourceFile = (filePath, extension) => {
    try {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        // Remove .class file for Java
        if (extension === '.java' && filePath) {
            const classFile = filePath.replace('.java', '.class');
            if (fs.existsSync(classFile)) {
                fs.unlinkSync(classFile);
            }
        }
    } catch (cleanupError) {
        console.error('Error during source file cleanup:', cleanupError);
    }
};

export default executeFile;
export { cleanupSourceFile };