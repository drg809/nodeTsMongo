import { Route, Get, Controller, Post, BodyProp, Put, Delete, SuccessResponse } from 'tsoa';
import { usersProfileModel, IUserProfile} from '../models/usersProfile';

@Route('/')
export class usersProfileController extends Controller {
    @Get('/profile')
    public async getAll() : Promise<any[]> {
        try {
            let items: any[] = await usersProfileModel.find({deletedAt: { $eq: null }});
            items = items.map((item) => { return {
                id: item._id,
                name: item.name,
              }
            });
            return items;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Get('/profile/{id}')
    public async getOne(id: string) : Promise<any[]> {
        try {
            let item: any = await usersProfileModel.findOne({_id: id, deletedAt: { $eq: null }});
            return item;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Get('/profile/user/{userId}')
    public async getByUserId(userId: string) : Promise<any[]> {
        try {
            let item: any = await usersProfileModel.findOne({userId: userId, deletedAt: { $eq: null }});
            return item;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Post('/profile')
    public async create(@BodyProp('name') name: string,
     @BodyProp('userId') userId: string,
     @BodyProp('lastname') lastname: string,
     @BodyProp('phone') phone: string,
     @BodyProp('country') country: string,
     @BodyProp('about') about: string): Promise<any> {
        const item = new usersProfileModel({
          userId: userId,
          name: name,
          lastname: lastname,
          phone: phone,
          country: country,
          about: about
        });
        await item.save();
        return item;
    }

    @Put('/profile/{id}')
    public async update(id: string,
     @BodyProp('userId') userId: string,
     @BodyProp('name') name: string,
     @BodyProp('lastname') lastname: string,
     @BodyProp('phone') phone: string,
     @BodyProp('country') country: string,
     @BodyProp('about') about: string): Promise<void> {
        await usersProfileModel.findOneAndUpdate({_id: id, deletedAt: { $eq: null }}, { $set: {
          userId: userId,
          name: name,
          lastname: lastname,
          phone: phone,
          country: country,
          about: about
        } } );
    }

    @Delete('/profile/{id}')
    public async remove(id: string): Promise<void> {
        await usersProfileModel.findOneAndUpdate({_id: id, deletedAt: { $eq: null }}, { $set: {
          deletedAt: new Date()
        } } );
    }
}
