import http from "http"
import dotenv from "dotenv";
dotenv.config();
import {config} from "./constants.js"
import app from "./server.js";
import connectDB from "./src/config/db.js";
import mongoose from "mongoose";

// Create an HTTP server
const httpServer = http.createServer(app);

// Graceful shutdown function
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  // Stop accepting new connections
  httpServer.close(async () => {
    console.log('HTTP server closed');
    
    try {
      // Close MongoDB connection
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      
      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('Forcefully shutting down after timeout');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

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

