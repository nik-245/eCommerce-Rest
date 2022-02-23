import express from "express";
import  path  from "path";
import mongoose from "mongoose";
import { APP_PORT , DB_URL } from "./config";
import auth from "./middleware/auth";
import errorHandler from "./middleware/errorHandler";
const app = express();
import routes from './routes'


// database connection
mongoose.connect(DB_URL)
const db = mongoose.connection;
db.on('error', console.error.bind(console , 'connection error'));
db.once('open', ()=>{
    console.log('Database connected! :)');
})

global.appRoot = path.resolve(__dirname);

app.use(express.urlencoded({extended:false}))
// json enneble
app.use(express.json()); 
 
// router register in oue=r application
app.use('/api', routes);
app.use('/uploads' , express.static('uploads/'));  

// middelware 
app.use(errorHandler);
app.use(auth)

app.listen(APP_PORT , ()=> console.log(`listening on port ${APP_PORT}`))