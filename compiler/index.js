import express from "express";
import cors from "cors";
import executeFile from "./src/executeFile.js";
import createFile from "./src/createFile.js";
import createInputFile from "./src/createInputFile.js";
import aiReview from "./src/aiReview.js";
import aiFeatureRequest from "./src/aiFeatures.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Compiler API!",
        endpoints: {
            compile: "POST /compile",
        },
        supportedLanguages: ["c", "cpp", "java", "py"]
    });
});

app.post("/run", async (req, res) => {
    try {
        const { extension, code, input = '' } = req.body;
        // Validation
        if (!extension || !code) {
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
        const fileResult = createFile(extension, code);

        if (!fileResult.success) {
            return res.status(500).json({
                success: false,
                error: "File creation failed",
                details: fileResult.error
            });
        }
        const InputFile = createInputFile(input);
        if (!InputFile.success) {
            return res.status(500).json({
                success: false,
                error: "Input file creation failed",
                details: InputFile.error
            });
        }

        // Execute file
        console.log(`Executing file: ${fileResult.filePath}`);
        const executionResult = await executeFile(fileResult.filePath, InputFile.filePath);

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
app.post("/review", async (req, res) => {
    try {
        const { code , language } = req.body;
        if (!code) {
            return res.status(400).json({
                success: false,
                error: "Missing code",
            });
        }
        const reviewResult = await aiReview(code, language);
        if (reviewResult.success) {
            return res.status(200).json({
                success: true,
                review: reviewResult.review
            });
        } else {
            return res.status(500).json({
                success: false,
                error: "AI Review Failed",
            });
        }
    } catch (error) {
        console.error('Unexpected error in /review:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

// AI Feature endpoints for landing page
app.post("/ai-feature", async (req, res) => {
    try {
        const { feature, code, language, problemDescription, constraints } = req.body;
        
        if (!feature || !code) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
            });
        }

        const aiResult = await aiFeatureRequest(feature, code, language, problemDescription, constraints);
        
        if (aiResult.success) {
            return res.status(200).json({
                success: true,
                result: aiResult.result
            });
        } else {
            return res.status(500).json({
                success: false,
                error: "AI Feature Failed",
            });
        }
    } catch (error) {
        console.error('Unexpected error in /ai-feature:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
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

// 404 handler - Fix the route pattern
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Endpoint not found",
        details: `${req.method} ${req.originalUrl} is not a valid endpoint`
    });
});

app.listen(PORT, () => {
    console.log(`Compiler API is running on http://localhost:${PORT}`);
});

export default app;