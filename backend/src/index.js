import express from 'express'
import cors from 'cors'
const app = express()
const PORT = process.env.PORT || 4000


app.use(cors({
    origin: process.env.CORS_ORIGIN,
}))
app.use(express.json({limit: "16kb"}))  
app.use(express.urlencoded({extended: true}))


app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
    console.log('listening on port :' + PORT);
})