import { summonersModel, ISummoner} from '../models/summoners';
import { Route, Get, Controller, Post, BodyProp, Put, Delete, SuccessResponse } from 'tsoa';
import * as mongoose from "mongoose";
import { summonersEntriesModel, ISummonerEntries } from '../models/summonerEntries';
import { summonersMatchesModel, ISummonerMatches } from '../models/summonerMatches';
import { participantsModel, IParticipant } from '../models/participants';
import { summonersStatsModel, ISummonerStats } from '../models/summonerStats';
import config from '../helpers/config';
import { usersController } from './users.controller';
import { summonersMatchesDetailsModel, ISummonerMatchesDetails } from '../models/summonerMatchesDetails';
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
                main: item.main
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

            for (const x of item.data.info.participants) {
              let part: IParticipant = await participantsModel.findOne({puuid: x.puuid});
              item.data.info.participants[num].name = part.summonerName;
              ++num;
            }

            return item;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Post('/summoners/leagueEntries_ext')
    public async getEntriesCommonLeagues() {
        try {
            this.summonersStatsDelete(config.leagues);
            for (const l of config.leagues) {
              for (const r of config.rank) {
                api.get('euw1', 'tftLeague.getLeagueEntries', l, r ).then(data => {
                  for (const p of data) {
                    let stats: ISummonerStats = new summonersStatsModel({
                      leagueId: p.leagueId,
                      summonerId: p.summonerId,
                      summonerName: p.summonerName,
                      queueType: p.queueType,
                      tier: p.tier,
                      rank: p.rank,
                      leaguePoints: p.leaguePoints,
                      wins: p.wins,
                      losses: p.losses,
                      hotStreak: p.hotStreak,
                      veteran: p.veteran,
                      freshBlood: p.freshBlood,
                      inactive: p.inactive
                    });
                    stats.save();
                  }
                });
              }
            }
            return true;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Post('/summoners/apexLeagues_ext')
    public async getEntriesApexLeagues() {
        try {
            this.summonersStatsDelete(config.apexLeaguesNames);
            for (const r of config.apexLeaguesEndpoints) {
              api.get('euw1', 'tftLeague.' + r ).then(data => {
                for (const p of data.entries) {
                  let stats: ISummonerStats = new summonersStatsModel({
                    leagueId: data.leagueId,
                    summonerId: p.summonerId,
                    summonerName: p.summonerName,
                    queueType: data.queue,
                    tier: data.tier,
                    rank: p.rank,
                    leaguePoints: p.leaguePoints,
                    wins: p.wins,
                    losses: p.losses,
                    hotStreak: p.hotStreak,
                    veteran: p.veteran,
                    freshBlood: p.freshBlood,
                    inactive: p.inactive
                  });
                  stats.save();
                }
              });
            }
            return true;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Post('/summoners/stats')
    public async getSummonerStats(req: Request) {
        const auth = usersController.getTokenPayload(req);
        let sum = await summonersModel.findOne({userId: auth.id, main: true});
        let stats = await summonersStatsModel.findOne({summonerName:{ $regex : new RegExp(sum.summonerName, "i") }});
        return stats;
    }

    @Get('/summoners/entries/{id}')
    public async getEntriesBySummoner(@BodyProp('userId') userId: string) : Promise<any> {
        let item: ISummoner = await summonersModel.findOne({userId: userId});
        api.get('euw1', 'tftLeague.getLeagueEntriesForSummoner', item.puuid ).then(data => {
          console.log(data);
        });
    }

    @Post('/summoners/match_history/{id}')
    public async getMatchHistory(req: any) : Promise<any> {
        const resPerPage = 10;
        const page = req.body.page || 1;
        try {
            let item: ISummonerMatches[] = await summonersMatchesModel.find({userId: req.params.id, 'data.info.queue_id': {$eq: 1100}})
            .sort({'data.info.game_datetime': -1})
            .skip((resPerPage * page) - resPerPage)
            .limit(resPerPage);
            let numOfProducts = await summonersMatchesModel.count({userId: req.params.id, 'data.info.queue_id': {$eq: 1100}})
            const res = {data: item, pageIndex: page, pageSize: resPerPage, pages: Math.ceil(numOfProducts / resPerPage), numResult: numOfProducts};
            return res;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Get('/summoners/users/{id}')
    public async getAllByUserId(@BodyProp('id') id: string) : Promise<any[]> {
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
                main: item.main
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
            data.forEach(async value => {
              let match: ISummonerMatches = await summonersMatchesModel.findOne({entrie: value});
              if(!match) {
                let sumE = new summonersEntriesModel({
                  userId: sum.userId,
                  entrie: value
                });
                sumE.save();
              }
            });
            return sum;
          });

        } catch (err) {
          console.log('Error:' + err);
          this.setStatus(500);
        }
    }

    @Post('/summoners/match_info_ext')
    public async setLastMatchInfoExt(@BodyProp('userId') userId: string ) {
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
                  sumE.data.info.participants.forEach(async x => {
                    let part: IParticipant = await participantsModel.findOne({puuid: x.puuid});
                    if(!part) {
                      api.get('euw1', 'tftSummoner.getByPUUID', x.puuid ).then(data => {
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
                    let s: ISummoner = await summonersModel.findOne({userId: userId, deletedAt: { $eq: null }});
                    if (x.puuid == s.puuid) {
                      let details = new summonersMatchesDetailsModel({
                        userId: ent.userId,
                        entrie: ent.entrie,
                        data: {
                          match_id: sumE.data.metadata.match_id,
                          game_datetime: sumE.data.info.game_datetime,
                          game_length: sumE.data.info.game_length,
                          game_variation: sumE.data.info.game_variation,
                          game_version: sumE.data.info.game_version,
                          companion: x.companion,
                          gold_left: x.gold_left,
                          last_round: x.last_round,
                          level: x.level,
                          placement: x.placement,
                          players_eliminated: x.players_eliminated,
                          puuid: x.puuid,
                          time_eliminated: x.time_eliminated,
                          total_damage_to_players: x.total_damage_to_players,
                          traits: x.traits,
                          units: x.units,
                          queue_id: sumE.data.info.queue_id,
                          tft_set_number: sumE.data.info.tft_set_number
                        }
                      });
                      details.save();
                    }
                  });
                });

              }
            }, 100);

          });
          return data;

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

    @Put('/summoners/main/{id}')
    public async setMain(@BodyProp('id') id: string, @BodyProp('userId') userId: string,@BodyProp('main') main: boolean) {
        await summonersModel.updateMany({userId: userId, main: true, deletedAt: { $eq: null }}, { $set: { main: false } } );
        await summonersModel.findOneAndUpdate({_id: id, deletedAt: { $eq: null }}, { $set: { main: main } } );
    }

    @Delete('/summoners/{id}')
    public async remove(@BodyProp('id') id: string): Promise<void> {
        await summonersModel.findOneAndUpdate({_id: id, deletedAt: { $eq: null }}, { $set: {
            deletedAt: new Date()
        } } );
    }

    @Delete('/summoners/delete/{id}')
    public async trueRemove(id: string): Promise<void> {
        await summonersModel.findByIdAndRemove(id);
    }

    private async summonersStatsDelete(params: any) {
        await summonersStatsModel.deleteMany({tier: { $in: params}});
    }
}
