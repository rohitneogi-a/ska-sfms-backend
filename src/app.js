import http from "http"
import dotenv from "dotenv";
dotenv.config();
import {config} from "../constants.js"
import app from "./server.js";
import connectDB from "./config/db.js";

// Create an HTTP server
const httpServer = http.createServer(app);

connectDB()
  .then(()=>{
    httpServer.listen(config.port,()=>
      console.log(`Server running on port ${config.port} `)
    );
    httpServer.on("error",(error)=>{
      console.error("Error on the server: ", error);
      throw error;
    })
  })
  .catch((error)=>{
    console.error("MongoDB Connection Failed: ", error)
  })

