import dotenv from "dotenv"
dotenv.config({path: "../env"})
import app from './app.js'
const PORT = process.env.PORT || 4000
import connectDB from './db/connectdb.js'
connectDB().then(()=>{
    app.on("error", (error)=>{
        console.error("Error: ", error)
        throw error
    }) // using for listining the error event
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((error)=>{
    console.error("Error: ", error)
    process.exit(1)
})