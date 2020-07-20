import { Route, Get, Controller, Post, BodyProp, Put, Delete, SuccessResponse } from 'tsoa';
import { databaseModel, IDatabase} from '../models/database';

@Route('/')
export class databaseController extends Controller {
    @Get('/database')
    public async getAll() : Promise<any[]> {
        try {
            let items: any[] = await databaseModel.find({});
            items = items.map((item) => { return {
                id: item._id,
                tag: item.tag,
                setTft: item.setTft
              }
            });
            return items;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Get('/database/{id}')
    public async getOne(id: string) : Promise<any[]> {
        try {
            let item: any = await databaseModel.findOne({_id: id});
            item.password = "";
            return item;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Post('/database')
    public async create(@BodyProp('tag') tag: string,
     @BodyProp('setTft') setTft: string,
     @BodyProp('data') data: string,
     @BodyProp('deletedAt') deletedAt: Date ): Promise<any> {
        const item = new databaseModel({
          tag: tag,
          setTft: setTft,
          data: data,
          deletedAt: deletedAt
        });
        await item.save();
        return item;
    }

    @Put('/database/{id}')
    public async update(id: string,
      @BodyProp('tag') tag: string,
      @BodyProp('setTft') setTft: string,
      @BodyProp('data') data: string,
      @BodyProp('deletedAt') deletedAt: Date ): Promise<void> {
        await databaseModel.findOneAndUpdate({_id: id}, { $set: {
          tag: tag,
          setTft: setTft,
          data: data,
          deletedAt: deletedAt
        } } );
    }

    @Delete('/database/{id}')
    public async remove(id: string): Promise<void> {
        await databaseModel.findByIdAndRemove(id);
    }
}
