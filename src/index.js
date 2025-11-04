import app from "./app.js";
import ConnectDb from "./db/index.js";
import dotenv from "dotenv"


dotenv.config({})

ConnectDb()
    .then(() => {
        // console.log(process.env.port)
        app.listen(process.env.port || 8000, () => {
            console.log("app is listen on the ", process.env.port);
        })

    })
    .catch((error) => {
        console.log('====================================');
        console.log("index.js :: connectDb index.js :error :: ", error);
        console.log('====================================');
        throw error
    })