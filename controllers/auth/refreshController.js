import Joi from "joi"
import CustomErorHandler from "../../services/CustomErrorHandler";
import {RefreshToken, User} from '../../models'
import JwtService from '../../services/JwtService'
import { REFRESH_SECRET } from "../../config";


const refreshController = {
    async refresh(req,res,next) {
        const refreshSchema = Joi.object({refresh_token : Joi.string().required(),})
        
        const {error} = refreshSchema.validate(req.body);

        if(error) {
            return next(error)
        }

        let refreshtoken;

       try{

        //chk token in database
        const refreshtoken = await RefreshToken.findOne({token : req.body.refresh_token})
        if (!refreshtoken) {
            return next(CustomErorHandler.unAuthorized('Invalid Refresh Token'));
        }

        let userId;
        try{

            const {_id} = await JwtService.verify(refreshtoken.token, REFRESH_SECRET);
            userId = _id;

        } catch(err) {
            return next(err)
        }

        const user = await User.findOne({_id : userId});
        if(!user) {
            return next(CustomErorHandler.unAuthorized('User Not Found'));
        }

        //get toekns

        const access_token = JwtService.sign({_id : user._id, role : user.role})
        const refresh_token = JwtService.sign({_id : user._id, role : user.role}, '1y', REFRESH_SECRET)

        await RefreshToken.create({token : refresh_token})
        res.json({access_token,refresh_token})

       } catch (err) {
        return next (new Error('Something Went Wrong' + err.message));
       }


    }
};


export default refreshController;













