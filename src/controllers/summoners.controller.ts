import { summonersModel} from '../models/summoners';
import { Route, Get, Controller, Post, BodyProp, Put, Delete, SuccessResponse } from 'tsoa';
import * as mongoose from "mongoose";
require('dotenv').config();


const TeemoJS = require('teemojs');
let api = TeemoJS(process.env.RIOT_API_KEY);

@Route('/')
export class summonersController extends Controller {
    @Get('/summoners')
    public async getAll() : Promise<any[]> {
        try {
            let items: any[] = await summonersModel.find({deletedAt: { $eq: null }});
            items = items.map((item) => { return {
                id: item._id,
                userId: item.userId,
                summonerName: item.summonerName,
                rank: item.rank,
                region: item.region,
                summonerLevel: item.summonerLevel,
                profileIconId: item.profileIconId,
              }
            });
            return items;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }
    @Get('/summoners/{id}')
    public async getOne(id: string) : Promise<any[]> {
        try {
            let item: any = await summonersModel.findOne({userId: id, deletedAt: { $eq: null }});
            console.log(id);
            return item;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Get('/summoners/users/{id}')
    public async getAllByUserId(id: string) : Promise<any[]> {
        try {
            let items: any[] = await summonersModel.find({userId: id, deletedAt: { $eq: null }});
            items = items.map((item) => { return {
                id: item._id,
                userId: item.userId,
                summonerName: item.summonerName,
                rank: item.rank,
                region: item.region,
                summonerLevel: item.summonerLevel,
                profileIconId: item.profileIconId,
              }
            });
            return items;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }


    @Post('/summoners')
    public async create(@BodyProp('userId') userId: string,
     @BodyProp('summonerName') summonerName: string ): Promise<any> {
        let item = new summonersModel({
          userId: userId,
          summonerName: summonerName
        });
        let data: any;
        try {
          api.get('euw1', 'tftSummoner.getBySummonerName', item.summonerName ).then(data => {
            item.puuid = data.puuid;
            item.summonerLevel = data.summonerLevel;
            item.accountId = data.accountId;
            item.region = 'euw';
            item.profileIconId = data.profileIconId;
            try{
              item.save();
            }catch(err){
              console.log('error');
            }

          });
          return item;
        } catch (err) {
          this.setStatus(500);
        }
    }

    @Put('/summoners/{id}')
    public async update(id: string,
      @BodyProp('userId') userId: string,
      @BodyProp('rank') rank: string,
      @BodyProp('summonerName') summonerName: string,
      @BodyProp('puuid') puuid: string,
      @BodyProp('region') region: string,
      @BodyProp('summonerLevel') summonerLevel: number,
      @BodyProp('accountId') accountId: string,
      @BodyProp('profileIconId') profileIconId: number,
      @BodyProp('deletedAt') deletedAt: any ): Promise<void> {
        await summonersModel.findOneAndUpdate({_id: id, deletedAt: { $eq: null }}, { $set: {
            userId: userId,
            rank: rank,
            summonerName: summonerName,
            puuid: puuid,
            region: region,
            summonerLevel: summonerLevel,
            accountId: accountId,
            profileIconId: profileIconId,
            deletedAt: deletedAt
        } } );
    }

    @Delete('/summoners/{id}')
    public async remove(id: string): Promise<void> {
        await summonersModel.findOneAndUpdate({_id: id, deletedAt: { $eq: null }}, { $set: {
            deletedAt: new Date()
        } } );
    }

    @Delete('/summoners/delete/{id}')
    public async trueRemove(id: string): Promise<void> {
        await summonersModel.findByIdAndRemove(id);
    }
}
