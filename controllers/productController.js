import { Product } from "../models";
import Joi from "joi";
import multer from "multer";
//inbuilt fn of node js to specify the path of file
import path from 'path';
import CustomErorHandler from "../services/CustomErrorHandler";
import fs from 'fs'
import productSchema from "../validators/productValidator";





//folepath , name storage all features are given by multer
const storage = multer.diskStorage({
    destination : (req,file, cb ) => cb(null, 'uploads/'),
    filename : (req, file, cb) => {
      
     const uniqueName = `${Date.now()}-${Math.round(Math.random() 
        * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);

    }
});

const handlemultiopartData = multer({storage , limits : {fileSize : 1000000 * 5}}).single('image')



const productController = {
    async store(req,res,next) {
         // Validation of request

    handlemultiopartData(req,res,async (err) => {
        if (err) {
            return next (CustomErorHandler.serverError(err.message))
        }
        console.log(req.file);
        const filePath = req.file.path;


        //validation
        // const productSchema = Joi.object({
        //     name : Joi.string().required(),
        //     price : Joi.number().required(),
        //     size : Joi.string().required()
        // });
        //we dont need it anymore as we r importin it from other file

        const {error} = productSchema.validate(req.body);
        if (error) {
// the uploading of image is done before the validation so id=f 
//validation failed then the image wiill be uploaded so due to this 
//we have to remove the image if the error occured mean validation failed
            fs.unlink(`${appRoot}/${filePath}`, (err) => {
                if(err) {
                    return next (CustomErorHandler.serverError(err.message));
                }
                
            })
            
            return next(error)
        }

        
        //document whixh is going to be created
        let document;

        try {
            document = await Product.create({
                name : req.body.name,
                price : req.body.price,
                size : req.body.size,
                image : filePath
            })


        } catch (err) {
            return next(err)
        }


        res.status(201).json(document)
       })

    },

/////////////////////////////////////////////////////////
//Update the product
/////////////////////////////////////////////////////////////

 update(req,res,next) {
    handlemultiopartData(req,res,async (err) => {
        if (err) {
            return next (CustomErorHandler.serverError(err.message))
        }


        let filePath
        if(req.file) {
           filePath = req.file.path;
        }

        //console.log(req.file);


          //validation
        // const productSchema = Joi.object({
        //     name : Joi.string().required(),
        //     price : Joi.number().required(),
        //     size : Joi.string().required()
        // });
        //we dont need it anymore as we r importin it from other file
        

        const {error} = productSchema.validate(req.body);
        if (error) {

            if (req.file) {
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if(err) {
                        return next (CustomErorHandler.serverError(err.message));
                    
            }
// the uploading of image is done before the validation so id=f 
//validation failed then the image wiill be uploaded so due to this 
//we have to remove the image if the error occured mean validation failed
                
            })
 }
              
            return next(error)
        }

        
        //document whixh is going to be created
        let document;

        try {
            document = await Product.findOneAndUpdate({_id : req.params.id}, {
                name : req.body.name,
                price : req.body.price,
                size : req.body.size,
                ...(req.filePath && {image : filePath})
            }, { new : true})
            console.log(document)


        } catch (err) {
            return next(err)
        }


        res.status(201).json(document)
       })
 },


 /////////////////////////////////////////////////////////
//Delete the product
/////////////////////////////////////////////////////////////

async delete(req,res,next) {
    const document = await Product.findOneAndRemove({_id : req.params.id});
    if (!document) {
        return next(new Error('Nothing To Delete'));
    }

    const imagePath = document._doc.image;

    fs.unlink( `${appRoot}/${imagePath}`, (err) => {
        if (err) {
            return next(CustomErorHandler.serverError());
        }
       
    });
    res.json(document);
},



/////////////////////////////////////////////////////////
//Get All the product
/////////////////////////////////////////////////////////////

async index(req,res,next) {

    let documents;
    //pagination (use lib name as mongoose.pagination but we dont 
    //(have too much products so we can ignore pagination)
    try {

        documents = await Product.find().select(' -__v -updatedAt').sort({_id :  -1});
        console.log (documents)
    } catch (err) {
        return next(CustomErorHandler.serverError());
    }
    return res.json(documents)

},



/////////////////////////////////////////////////////////
//Get A Songle the product
/////////////////////////////////////////////////////////////

async show(req,res,next) {

    let documents;
    //pagination (use lib name as mongoose.pagination but we dont 
    //(have too much products so we can ignore pagination)
    try {

        documents = await Product.findOne({_id : req.params.id}).select(' -__v -updatedAt');
    } catch (err) {
        return next(CustomErorHandler.serverError());
    }
    return res.json(documents)

}








}




export default productController;