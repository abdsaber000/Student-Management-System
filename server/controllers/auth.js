import { StatusCodes } from "http-status-codes";
import {User} from "../models/User.js";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import { errorHandler } from "../errors/error-handler.js";
export const register = async (req, res) =>{
    try{
        const user = await User.create({...req.body});
        const token = user.createJWT();
        res.status(StatusCodes.CREATED).json({
            user_name : user.user_name,
            token
        })
    }catch(error){
        return errorHandler(error , res);
    }
}

export const login = async (req, res) =>{
    try{
        const {email , password} = req.body;

        if(!email || !password){
            throw new BadRequestError("Please provide email and password");
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new UnauthenticatedError('Invalid Credentials');
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            throw new UnauthenticatedError('Invalid Credentials')
        }

        const token = user.createJWT()
        res.status(StatusCodes.OK).json({
            user_name : user.user_name,
            token
        })
    }catch(error){
        return errorHandler(error , res);
    }
}



