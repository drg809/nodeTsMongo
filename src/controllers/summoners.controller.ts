import { summonersModel, ISummoner} from '../models/summoners';
import { Route, Get, Controller, Post, BodyProp, Put, Delete, SuccessResponse } from 'tsoa';
import * as mongoose from "mongoose";
import { summonersEntriesModel, ISummonerEntries } from '../models/summonerEntries';
import { summonersMatchesModel, ISummonerMatches } from '../models/summonerMatches';
import { participantsModel, IParticipant } from '../models/participants';
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
    public async getOne(id: string) : Promise<any> {
        try {
            let item: any = await summonersModel.findOne({userId: id, deletedAt: { $eq: null }});
            console.log(id);
            return item;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Get('/summoners/match/{id}')
    public async getMatchInfo(entrie: string) {
        let num: number = 0;
        try {
            let item: ISummonerMatches = await summonersMatchesModel.findOne({entrie: entrie});
            //console.log({item})

            /*
            for (const x of item.data.info.participants) {
              let part: IParticipant = await participantsModel.findOne({puuid: x.puuid});
              item.data.info.participants[num].name = part.summonerName;
              console.log(item.data.info.participants[num]);
              console.log(num);
              ++num;
            }
            */

            console.log(item.data.info);
            return item;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Get('/summoners/entries/{id}')
    public async getEntriesBySummoner(userId: string) : Promise<any> {
        let item: ISummoner = await summonersModel.findOne({userId: userId});
        api.get('euw1', 'tftLeague.getLeagueEntriesForSummoner', item.puuid ).then(data => {
          console.log(data);
        });
    }

    @Get('/summoners/match_history/{id}')
    public async getMatchHistory(userId: string) : Promise<any> {
        try {
            let item: ISummonerMatches[] = await summonersMatchesModel.find({userId: userId, 'data.info.queue_id': {$eq: 1100}});
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

    @Post('/summoners/get_matches_ext')
    public async getMatchesExt(@BodyProp('userId') userId: string ): Promise<any> {
        let sum: ISummoner = await summonersModel.findOne({userId: userId, deletedAt: { $eq: null }});
        let data: any[];
        try {
          api.get('europe', 'tftMatch.getMatchIdsByPUUID', sum.puuid ).then(res => {
            data = res;
            data.forEach(value => {
              let sumE = new summonersEntriesModel({
                userId: sum.userId,
                entrie: value
              });
              sumE.save();
            });
            return data;
          });

        } catch (err) {
          console.log('Error:' + err);
          this.setStatus(500);
        }
    }

    @Post('/summoners/match_info_ext')
    public async setLastMatchInfoExt(@BodyProp('userId') userId: string ): Promise<any> {
        this.getMatchesExt(userId);
        let sum: ISummonerEntries[] = await summonersEntriesModel.find({userId: userId});
        let data: any[];
        try {
          sum.forEach(ent => {
            setTimeout(async function () {
              let match: ISummonerMatches = await summonersMatchesModel.findOne({entrie: ent.entrie});
              if (!match) {
                api.get('europe', 'tftMatch.getMatch', ent.entrie ).then(res => {
                  data = res;
                  let sumE = new summonersMatchesModel({
                    userId: ent.userId,
                    entrie: ent.entrie,
                    data: res
                  });
                  sumE.save();
                  sumE.data.metadata.participants.forEach(async x => {
                    let part: IParticipant = await participantsModel.findOne({puuid: x});
                    if(!part) {
                      api.get('euw1', 'tftSummoner.getByPUUID', x ).then(data => {
                        let item = new participantsModel({
                          summonerName: data.name,
                          puuid: data.puuid,
                          summonerLevel: data.summonerLevel,
                          accountId: data.accountId,
                          region: 'euw',
                          profileIconId: data.profileIconId
                        });

                        try{
                          item.save();
                        }catch(err){
                          console.log('error');
                        }

                      });
                    }
                  });
                  return data;
                });

              }
            }, 100);

          });


        } catch (err) {
          console.log('Error:' + err);
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
