import { Route, Get, Controller, Post, BodyProp, Put, Delete, SuccessResponse } from 'tsoa';
import { retriesModel, IRetries} from '../models/retries';

@Route('/')
export class retriesController extends Controller {
    @Get('/retries')
    public async getAll() : Promise<any[]> {
        try {
            let items: any[] = await retriesModel.find({});
            items = items.map((item) => { return {
                id: item._id,
                userId: item.userId,
                action: item.action,
                retries: item.retries,
                first: item.first,
                last: item.last
              }
            });
            return items;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Get('/retries/{id}')
    public async getOne(id: string) : Promise<any[]> {
        try {
            let item: any = await retriesModel.findOne({_id: id});
            return item;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Post('/retries')
    public async create(@BodyProp('userId') userId: string,
     @BodyProp('action') action: string,
     @BodyProp('retries') retries: string,
     @BodyProp('first') first: Date,
     @BodyProp('last') last: Date ): Promise<any> {
        const item = new retriesModel({
          userId: userId,
          action: action,
          retries: retries,
          first: first,
          last: last
        });
        await item.save();
        return item;
    }

    @Put('/retries/{id}')
    public async update(id: string,
      @BodyProp('userId') userId: string,
      @BodyProp('action') action: string,
      @BodyProp('retries') retries: number,
      @BodyProp('first') first: Date,
      @BodyProp('last') last: Date ): Promise<void> {
        await retriesModel.findOneAndUpdate({_id: id}, { $set: {
          userId: userId,
          action: action,
          retries: retries,
          first: first,
          last: last
        } } );
    }

    @Delete('/retries/{id}')
    public async remove(id: string): Promise<void> {
        await retriesModel.findByIdAndRemove(id);
    }
}
