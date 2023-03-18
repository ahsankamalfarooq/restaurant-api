import mongoose from 'mongoose';
 import { APP_URL} from '../config'
const Schema = mongoose.Schema;
const productSchema = new Schema({
  //  _id : _id
    name : {type : String, required: true},
    price : {type : Number, required: true},
    size : {type : String, required: true},
    
    //(we dont store the image in data base we store the path 
    //of the image from our server into the data base)
    image : {type : String, required: true, get: (image) => {
      return `${APP_URL}/${image}`;
    }},

}, {timestamps : true, toJSON : {getters : true}, id : false}
);

export default mongoose.model('Product', productSchema,'products')