import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import config from "../helpers/config";
import {usersModel} from "../models/users";

const checkRol = async (req: Request, res: Response, next: NextFunction) => {
    let userToken = <string>req.headers['authorization'];
    let jwtPayload;
    try {
        userToken = userToken.replace('Bearer ', '');
        jwtPayload = <any>jwt.verify(userToken, config.jwtSecret);

        const queryResult = await usersModel.findOne({ "_id": jwtPayload.id, "token": userToken });

        if (queryResult.role == 'Admin') {
            next();
        } else {
            res.status(401).send({error: "unauthorized"});
        }
    } catch (error) {
        res.status(401).send({error: "unauthorized1"});
        return;
    }
};

export { checkRol };
