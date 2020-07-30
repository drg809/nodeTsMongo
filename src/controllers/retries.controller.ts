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
    public async create(@BodyProp('tag') tag: string,
     @BodyProp('setTft') setTft: string,
     @BodyProp('data') data: string ): Promise<any> {
        const item = new retriesModel({
          tag: tag,
          setTft: setTft,
          data: data
        });
        await item.save();
        return item;
    }

    @Put('/retries/{id}')
    public async update(id: string,
      @BodyProp('tag') tag: string,
      @BodyProp('setTft') setTft: string,
      @BodyProp('data') data: string,
      @BodyProp('deletedAt') deletedAt: Date ): Promise<void> {
        await retriesModel.findOneAndUpdate({_id: id}, { $set: {
          tag: tag,
          setTft: setTft,
          data: data,
          deletedAt: deletedAt
        } } );
    }

    @Delete('/retries/{id}')
    public async remove(id: string): Promise<void> {
        await retriesModel.findByIdAndRemove(id);
    }
}
