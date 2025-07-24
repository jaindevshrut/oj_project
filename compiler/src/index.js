import express from "express";
import cors from "cors";
import executeFile from "./executeFile.js";
import createFile from "./createFile.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Compiler API!",
        endpoints: {
            compile: "POST /compile",
            health: "GET /health"
        },
        supportedLanguages: ["c", "cpp", "java", "py"]
    });
});

app.post("/compile", async (req, res) => {
    try {
        const { extension, content, input = '' } = req.body;

        // Validation
        if (!extension || !content) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
                details: "Both 'extension' and 'content' are required"
            });
        }

        // Validate extension
        const validExtensions = ['c', 'cpp', 'java', 'py'];
        if (!validExtensions.includes(extension)) {
            return res.status(400).json({
                success: false,
                error: "Invalid file extension",
                details: `Supported extensions: ${validExtensions.join(', ')}`
            });
        }

        // Create file
        console.log(`Creating file with extension: ${extension}`);
        const fileResult = createFile(extension, content);
        
        if (!fileResult.success) {
            return res.status(500).json({
                success: false,
                error: "File creation failed",
                details: fileResult.error
            });
        }

        // Execute file
        console.log(`Executing file: ${fileResult.fileName}`);
        const executionResult = await executeFile(fileResult.fileName, input);

        if (executionResult.success) {
            return res.status(200).json({
                success: true,
                output: executionResult.output,
                jobId: fileResult.jobId,
                language: extension
            });
        } else {
            return res.status(400).json({
                success: false,
                error: executionResult.error,
                details: executionResult.details,
                timeout: executionResult.timeout || false,
                partialOutput: executionResult.output || null
            });
        }

    } catch (error) {
        console.error('Unexpected error in /compile:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: "Internal Server Error",
        details: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: "Endpoint not found",
        details: `${req.method} ${req.originalUrl} is not a valid endpoint`
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Compiler API is running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

export default app;