import Joi from "joi"
import CustomErorHandler from "../../services/CustomErrorHandler";
import {RefreshToken, User} from '../../models'
import brcypt from 'bcrypt'
import JwtService from '../../services/JwtService'
import { REFRESH_SECRET } from "../../config";


const loginController = {
 async login(req, res, next) {

    const loginSchema = Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)).required()
    });
    const {error} = loginSchema.validate(req.body);

    if (error) {
        return next(error);    
    }
    try{
//whats happeing here ? a person sees many boxes in a shop (which is collection )
        const user = await User.findOne({email : req.body.email});
        if (!user) {
            return next(CustomErorHandler.wrongCredentials());
        }
        const match = await brcypt.compare(req.body.password, user.password);
        if (!match) {
            return next(CustomErorHandler.wrongCredentials());
        }

        const access_token = JwtService.sign({_id : user._id, role : user.role})
        const refresh_token = JwtService.sign({_id : user._id, role : user.role}, '1y', REFRESH_SECRET)
    
        await RefreshToken.create({token : refresh_token})


        res.json({access_token: access_token, refresh_token})



    } catch(err) {
       return next(err)
    }

 },

// Logout Controller


async logout(req,res,next) {

    const refreshSchema = Joi.object({refresh_token : Joi.string().required(),})
        
    const {error} = refreshSchema.validate(req.body);

    if(error) {
        return next(error)
    }



    try {
        await RefreshToken.deleteOne({token : req.body.refresh_token})
    } catch(err) {
        return next (new Error("Something went wrong"));
    }

    res.json({status : 1})
}



};




export default loginController;