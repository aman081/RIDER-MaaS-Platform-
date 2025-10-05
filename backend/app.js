const dotenv=require('dotenv');
dotenv.config();
const express=require('express');
const cors=require('cors');
const app=express();
const DB_CONNECT=require('../backend/db/db');
const userRouter=require('./routes/user.routes');
const cookieParser=require('cookie-parser');


DB_CONNECT();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get('/',(req,res)=>{
  res.send('Hello World');

})

app.use('/user',userRouter);

module.exports=app;