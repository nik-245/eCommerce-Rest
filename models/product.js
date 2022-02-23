import mongoose from "mongoose";
import { APP_URL } from "../config";
import {normalize} from 'path'
const schema = mongoose.Schema;

const productSchema = new schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    image: { type: String, required: true , get:(image)=>{
            // console.log(image);
            const url = `${APP_URL}/${image}` 
          return url.replace('\\','/')
    }},
  },
  { timestamps: true  ,toJSON:{getters : true} ,id:false}
);

export default mongoose.model('Product', productSchema, 'products');
