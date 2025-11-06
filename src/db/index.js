import mongoose from "mongoose";



const ConnectDb = async () => {

    try {
        const db = await mongoose.connect(String(process.env.DB_URI))
        console.log('====================================');
        // console.log("index.js :: ConnectDb :: db", db);
        // console.log("index.js :: ConnectDb :: db", db?.connection);
        console.log('====================================');
    } catch (error) {
        console.log('====================================');
        console.log("db/index.js :: connectDb :error :: ", error);
        console.log('====================================');
        throw error
    }
}

export default ConnectDb