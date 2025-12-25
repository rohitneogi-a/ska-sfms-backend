import express from 'express';
import User from './models/User.model.js';
const app = express();

app.get('/',async (req,res)=>{
    res.send("Backend is running");
    

});

export default app;