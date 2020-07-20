import { Route, Get, Controller, Post, BodyProp, Put, Delete, SuccessResponse } from 'tsoa';
import { usersModel, IUser} from '../models/users';
import * as jwt from "jsonwebtoken";
import config from "../helpers/config";
const bcrypt = require('bcrypt');

@Route('/')
export class usersController extends Controller {
    @Get('/users')
    public async getAll() : Promise<any[]> {
        try {
            let items: any[] = await usersModel.find({});
            items = items.map((item) => { return {
                id: item._id,
                email: item.email,
                name: item.name
              }
            });
            return items;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Get('/users/{id}')
    public async getOne(id: string) : Promise<any[]> {
        try {
            let item: any = await usersModel.findOne({_id: id});
            item.password = "";
            return item;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Post('/users/login')
    public async login(@BodyProp('email') email: string,
    @BodyProp('password') password: string) : Promise<any> {
        let user = await usersModel.findOne({email: email});
        if (user && bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {id: user._id},
                config.jwtSecret,
                {expiresIn: "30d"}
            );
            user.password = "";
            user.token = token;
            this.updateToken(user._id,token);
            return user;
        } else {
            this.setStatus(500);
        }
    }

    @Post('/users')
    public async create(@BodyProp('email') email: string,
     @BodyProp('password') password: string,
     @BodyProp('token') token: string,
     @BodyProp('name') name: string,
     @BodyProp('lastname') lastname: string,
     @BodyProp('status') status: number,
     @BodyProp('role') role: string,
     @BodyProp('phone') phone: string,
     @BodyProp('deletedAt') deletedAt: Date ): Promise<any> {
        const item = new usersModel({
          email: email,
          password: password,
          token: token,
          name: name,
          lastname: lastname,
          status: status,
          role: role,
          phone: phone,
          deletedAt: deletedAt
        });
        console.log(item.password);
        item.password = bcrypt.hashSync(item.password, 10);
        await item.save();
        item.password = "";
        return item;
    }

    @Put('/users/{id}')
    public async update(id: string,
      @BodyProp('name') name: string,
      @BodyProp('lastname') lastname: string,
      @BodyProp('status') status: number,
      @BodyProp('role') role: string,
      @BodyProp('phone') phone: string,
      @BodyProp('deletedAt') deletedAt: Date ): Promise<void> {
        await usersModel.findOneAndUpdate({_id: id}, { $set: {
          name: name,
          lastname: lastname,
          status: status,
          role: role,
          phone: phone,
          deletedAt: deletedAt
        } } );
    }

    @Delete('/users/{id}')
    public async remove(id: string): Promise<void> {
        await usersModel.findByIdAndRemove(id);
    }

    private async updateToken(id: any, token: string ): Promise<void> {
      await usersModel.findOneAndUpdate({_id: id}, { $set: {
        token: token
      } } );
  }
}
