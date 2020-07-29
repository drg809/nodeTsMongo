import { Route, Get, Controller, Post, BodyProp, Put, Delete, SuccessResponse } from 'tsoa';
import { usersModel, IUser} from '../models/users';
import * as jwt from "jsonwebtoken";
import config from "../helpers/config";
import { summonersModel } from '../models/summoners';
const bcrypt = require('bcrypt');

@Route('/')
export class usersController extends Controller {
    @Get('/users')
    public async getAll() : Promise<any[]> {
        try {
            let items: any[] = await usersModel.find({deletedAt: { $eq: null }});
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
            let item: any = await usersModel.findOne({_id: id, deletedAt: { $eq: null }});
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
        let user = await usersModel.findOne({email: email, deletedAt: { $eq: null }});
        if (user && bcrypt.compare(password, user.password)) {
            // const token = jwt.sign(
            //     {id: user._id},
            //     config.jwtSecret,
            //     {expiresIn: "30d"}
            // );
            user.password = "";
            //user.token = token;
            //this.updateToken(user._id,token);
            //let sum = await summonersModel.findOne({userId: user._id});
            //console.log(sum);
            user.puuid = '3U9Cbs9gIE86er_svec4HWddvFAXhSFQ5HPE3tYM8ahUqk3lBtnaHXMjmo3916HUKDpwLLR0AgQnlw';
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
     @BodyProp('phone') phone: string): Promise<any> {
        const item = new usersModel({
          email: email,
          password: password,
          token: token,
          name: name,
          lastname: lastname,
          status: status,
          role: role,
          phone: phone
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
      @BodyProp('phone') phone: string ): Promise<void> {
        await usersModel.findOneAndUpdate({_id: id, deletedAt: { $eq: null }}, { $set: {
          name: name,
          lastname: lastname,
          status: status,
          role: role,
          phone: phone
        } } );
    }

    @Delete('/users/{id}')
    public async remove(id: string): Promise<void> {
        await usersModel.findOneAndUpdate({_id: id, deletedAt: { $eq: null }}, { $set: {
          deletedAt: new Date()
        } } );
    }

    @Delete('/users/delete/{id}')
    public async trueRemove(id: string): Promise<void> {
        await usersModel.findByIdAndRemove(id);
    }


    private async updateToken(id: any, token: string ): Promise<void> {
      await usersModel.findOneAndUpdate({_id: id, deletedAt: { $eq: null }}, { $set: {
        token: token
      } } );
    }
}
