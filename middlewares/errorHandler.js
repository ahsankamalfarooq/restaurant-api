import { DEBUG_MODE } from "../config";
import { ValidationError } from "joi";
import CustomErorHandler from "../services/CustomErrorHandler";


const errorHandler = (err, req,res,next) => {
    let statusCode = 500;

    let data = {
        message : "Internaal Server Error",
        ...DEBUG_MODE === 'true' && {origionalError : err.message}
    }
    if (err instanceof ValidationError) {
        statusCode = 422;
        data = {
            message : err.message
        }
    }


    if (err instanceof CustomErorHandler) {
        statusCode = err.status;
        data = {
            message : err.message
        }
    }


    return res.status(statusCode).json(data)
}


export default errorHandler