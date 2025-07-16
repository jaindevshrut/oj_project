import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import multer from "multer"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Allow cookies to be sent with requests
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"]
    
})) // using for defining the origin of the request
app.use(express.json({limit: "16kb"})) // using for parsing the json data
app.use(express.urlencoded({extended: true})) // using for parsing the form data (isse ham vo %20 ya + wali cheeze jo url me hoti h usse configure kr skte h) 
app.use(express.static("public")) // using for serving the static files
app.use(multer().none()) // using for parsing the multipart/form-data (isse ham file upload kr skte h)
app.use(cookieParser()) // using for parsing the cookies


// Routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)

app.use((err, req, res, next) => {
    console.error("Error caught by middleware:", err);
    
    if (err.statusCode) {
        // This is an ApiError
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || []
        });
    }
    
    // Generic error
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message
    });
});

export default app