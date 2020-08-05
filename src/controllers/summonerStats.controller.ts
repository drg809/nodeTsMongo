import { Route, Get, Controller, Post, BodyProp, Put, Delete, SuccessResponse } from 'tsoa';
import { summonersStatsModel, ISummonerStats} from '../models/summonerStats';

@Route('/')
export class summonerStatsController extends Controller {
    @Get('/summonerStats')
    public async getAll() : Promise<any[]> {
        try {
            let items: any[] = await summonersStatsModel.find({});
            items = items.map((item) => { return {
                id: item._id,
                userId: item.userId,
                action: item.action,
                summonerStats: item.summonerStats,
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

    @Get('/summonerStats/{id}')
    public async getOne(id: string) : Promise<any[]> {
        try {
            let item: any = await summonersStatsModel.findOne({_id: id});
            return item;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Post('/summonerStats')
    public async create(@BodyProp('userId') userId: string,
     @BodyProp('action') action: string,
     @BodyProp('summonerStats') summonerStats: string,
     @BodyProp('first') first: Date,
     @BodyProp('last') last: Date ): Promise<any> {
        const item = new summonersStatsModel({
          userId: userId,
          action: action,
          summonerStats: summonerStats,
          first: first,
          last: last
        });
        await item.save();
        return item;
    }

    @Put('/summonerStats/{id}')
    public async update(id: string,
      @BodyProp('userId') userId: string,
      @BodyProp('action') action: string,
      @BodyProp('summonerStats') summonerStats: number,
      @BodyProp('first') first: Date,
      @BodyProp('last') last: Date ): Promise<void> {
        await summonersStatsModel.findOneAndUpdate({_id: id}, { $set: {
          userId: userId,
          action: action,
          summonerStats: summonerStats,
          first: first,
          last: last
        } } );
    }

    @Delete('/summonerStats/{id}')
    public async remove(id: string): Promise<void> {
        await summonersStatsModel.findByIdAndRemove(id);
    }
}
