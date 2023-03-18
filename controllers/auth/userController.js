import CustomErorHandler from "../../services/CustomErrorHandler";
import {User} from '../../models'

const userController = {

   async me(req,res,next) {

    try{

        const user = await User.findOne({_id : req.user._id}).select('-__v -password -updatedAt ');
        if(!user) {
            return next(CustomErorHandler.notFound());
        }
        res.json(user);

    } catch(err) {
        return next(err);
    }

    }
}

export default userController;