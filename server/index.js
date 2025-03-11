import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import routes from "./config/routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use( cors( ) );
app.use( express.json() );
app.use( "/api", routes );
dbConnect();
app.listen( port, ( ) => {
    console.log( `Server is running on thee port ${ port }` );
})

