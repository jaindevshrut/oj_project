import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
        index: true
    },
    language: {
        type: String,
        enum: ["java", "python", "cpp"],
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Accepted", "WA", "TLE", "RE", "CE"],
        default: "CE"
    },
    runtime: {
        type: Number,
        required: true,
        validate: {
            validator: value => value >= 0,
            message: "Runtime must be non-negative"
        }
    },
    memory: {
        type: Number,
        required: true,
        validate: {
            validator: value => value >= 0,
            message: "Memory must be non-negative"
        }
    }
}, { timestamps: true })

const Submission = mongoose.model('Submission', submissionSchema)
export default Submission