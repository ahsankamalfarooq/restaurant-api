import Joi from "joi"
import CustomErorHandler from "../../services/CustomErrorHandler";
import {RefreshToken, User} from '../../models'
import brcypt from 'bcrypt'
import JwtService from '../../services/JwtService'
import { REFRESH_SECRET } from "../../config";


const registerController = {
    async register(req, res, next) {
    // Validation of request
        const registerSchema = Joi.object({
            name : Joi.string().min(3).max(30).required(),
            email : Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)).required(),
            repeat_password : Joi.ref('password')
        })


        const {error} = registerSchema.validate(req.body);
//as our app is huge so
// cant send individual err from all files
        // if (error) {
        //     res.status(500).json({

        //     })
        // }
//so


        if (error) {
            return next(error);
        }

//Chk if the user is in database

try {
    const exist = await User.exists({
        email : req.body.email
    })
    if (exist) {
        return next(CustomErorHandler.alreadyExist('THis email is already taken'))
    }
} catch(err) {
    return next(err)
}



// Hash password

const hashedPassword = await brcypt.hash(req.body.password, 10);

//prepeare the model

const user = new User({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
})

 let access_token;
 let refresh_token;
// const access_token = JwtService.sign({_id : result._id, role : result.role})
// console.log(access_token)

try{
    const result = await user.save();
    
    //token

    access_token = JwtService.sign({_id : result._id, role : result.role})
    refresh_token = JwtService.sign({_id : result._id, role : result.role}, '1y', REFRESH_SECRET)
    
    await RefreshToken.create({token : refresh_token})

    //WE haveto store refresh secet in our data base as discuss earlier
    
  //  res.json({access_token : access_token , refresh_token: refresh_token})

    //console.log(access_token)

} catch(err) {
    return next(err)
}



        res.json({access_token : access_token, refresh_token})
 
    }
}



export default registerController