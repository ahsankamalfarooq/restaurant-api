import { User } from "../models";
import CustomErorHandler from "../services/CustomErrorHandler";



const admin = async (req,res,next) => {
    try{
        const user = await User.findOne({_id : req.user._id});
        if (user.role === 'admin') {
            next();
        }
        else {
            return next(CustomErorHandler.unAuthorized());
        }
    } catch (err) {
        return next(CustomErorHandler.serverError())
    }

} 


export default admin;











