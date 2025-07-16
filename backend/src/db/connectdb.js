import mongoose from 'mongoose';

const connectdb = async () => {
    console.log("Connecting db..")
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        console.log(`\n MongoDB Connected!! Db host : ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.error("Error:", error)
        process.exit(1)
    }
}
export default connectdb;