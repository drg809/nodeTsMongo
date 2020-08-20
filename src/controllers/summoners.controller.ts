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
import { cpuUsage } from 'process';
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
        try {
            let top1: number = 0; let top2: number = 0; let top3: number = 0; let top4: number = 0; let top5: number = 0; let top6: number = 0; let top7: number = 0; let top8: number = 0;let countsT1 = {};let traitsArrayT4S3 = [];let countsT4S3 = {};
            let champCountTop1 = {};let champCountTotal = {};let champCount = {};let unitsArrayTop1 = [];let unitsArrayTotal = [];let traitsArrayTotal = [];let traitsArrayT4 = [];let traitsArrayT4S1 = [];let traitsArrayT4S2 = [];let countsTotal = {};
            let countsTop4 = {};let counts = {};let winRateGalaxie = {top1:{},top2:{},top3:{},top4:{},top5:{},top6:{},top7:{},top8:{},top:[],maxV:0};let w = [];let unitsArray = [];let traitsArrayT1 = [];let countsT4 = {};let countsT4S1 = {};let countsT4S2 = {};
            const auth = usersController.getTokenPayload(req);
            let sum: ISummoner = await summonersModel.findOne({userId: auth.id, main: true});
            let stats: ISummonerStats = await summonersStatsModel.findOne({summonerName:{ $regex : new RegExp(sum.summonerName, "i") }});
            let matches: ISummonerMatchesDetails[] = await summonersMatchesDetailsModel.find({sumId: sum._id, userId: auth.id});
            stats.positions = {top1: top1,top2: top2,top3: top3,top4: top4,top5: top5,top6: top6,top7: top7,top8: top8, total: matches.length, maxV: 0};
            for (const x of matches) {
              switch(x.data.placement){
                case 1:
                  stats.positions.top1++;
                  winRateGalaxie.top1[x.data.game_variation] = (winRateGalaxie.top1[x.data.game_variation] || 0)+1;
                  winRateGalaxie.top[x.data.game_variation] = (winRateGalaxie.top[x.data.game_variation] || 0)+1;
                  for (const u of x.data.units) {
                    unitsArrayTop1.push(u);
                  }
                  for (const u of x.data.traits) {
                    if (u.style > 0) {
                      traitsArrayT1.push(u);
                    }
                  }
                  break;
                case 2:
                  stats.positions.top2++;
                  winRateGalaxie.top2[x.data.game_variation] = (winRateGalaxie.top2[x.data.game_variation] || 0)+1;
                  winRateGalaxie.top[x.data.game_variation] = (winRateGalaxie.top[x.data.game_variation] || 0)+1;
                  break;
                case 3:
                  stats.positions.top3++;
                  winRateGalaxie.top3[x.data.game_variation] = (winRateGalaxie.top3[x.data.game_variation] || 0)+1;
                  winRateGalaxie.top[x.data.game_variation] = (winRateGalaxie.top[x.data.game_variation] || 0)+1;
                  break;
                case 4:
                  stats.positions.top4++;
                  winRateGalaxie.top4[x.data.game_variation] = (winRateGalaxie.top4[x.data.game_variation] || 0)+1;
                  winRateGalaxie.top[x.data.game_variation] = (winRateGalaxie.top[x.data.game_variation] || 0)+1;
                  break;
                case 5:
                  stats.positions.top5++;
                  winRateGalaxie.top5[x.data.game_variation] = (winRateGalaxie.top5[x.data.game_variation] || 0)+1;
                  break;
                case 6:
                  stats.positions.top6++;
                  winRateGalaxie.top6[x.data.game_variation] = (winRateGalaxie.top6[x.data.game_variation] || 0)+1;
                  break;
                case 7:
                  stats.positions.top7++;
                  winRateGalaxie.top7[x.data.game_variation] = (winRateGalaxie.top7[x.data.game_variation] || 0)+1;
                  break;
                default:
                  stats.positions.top8++;
                  winRateGalaxie.top8[x.data.game_variation] = (winRateGalaxie.top8[x.data.game_variation] || 0)+1;
              }

              if(x.data.placement < 5) {
                countsTop4[x.data.game_variation] = (countsTop4[x.data.game_variation] || 0)+1;
                for (const t of x.data.units) {
                  unitsArray.push(t);
                }
                for (const s of x.data.traits) {
                  if (s.style > 0) {
                    traitsArrayT4.push(s);
                  }
                  if(s.style === 1) {
                    traitsArrayT4S1.push(s);
                  } else if (s.style === 2) {
                    traitsArrayT4S2.push(s);
                  } else if (s.style === 3) {
                    traitsArrayT4S3.push(s);
                  }
                }
              }
              for (const s of x.data.units) {
                unitsArrayTotal.push(s);
              }
              for (const s of x.data.traits) {
                if (s.style > 0) {
                  traitsArrayTotal.push(s);
                }
              }

              counts[x.data.game_variation] = (counts[x.data.game_variation] || 0)+1;
            };
            for (let key in winRateGalaxie.top) {
              w.push({key: key, value: winRateGalaxie.top[key]});
            }
            winRateGalaxie.top = w;
            for (const z of unitsArrayTop1) {
              champCountTop1[z.character_id] = (champCountTop1[z.character_id] || 0)+1;
            }
            unitsArrayTop1 = [];
            for (const key of Object.keys(champCountTop1)) {
              const value = champCountTop1[key];
              unitsArrayTop1.push({x: key, y: value});
            }
            for (const c of unitsArray) {
              champCount[c.character_id] = (champCount[c.character_id] || 0)+1;
            }
            unitsArray = [];
            for (const key1 of Object.keys(champCount)) {
              const value1 = champCount[key1];
              unitsArray.push({x: key1, y: value1});
            }
            for (const y of unitsArrayTotal) {
              champCountTotal[y.character_id] = (champCountTotal[y.character_id] || 0)+1;
            }
            unitsArrayTop1.sort((a, b) => b.y - a.y).splice(10, unitsArrayTop1.length - 10);
            unitsArray.sort((a, b) => b.y - a.y).splice(10, unitsArray.length - 10);

            for (const z of traitsArrayT1) {
              countsT1[z.name] = (countsT1[z.name] || 0)+1;
            }
            traitsArrayT1 = [];
            for (const key of Object.keys(countsT1)) {
              const value = countsT1[key];
              traitsArrayT1.push({x: key, y: value});
            }
            for (const z of traitsArrayT4) {
              countsT4[z.name] = (countsT4[z.name] || 0)+1;
            }
            traitsArrayT4 = [];
            for (const key of Object.keys(countsT4)) {
              const value = countsT4[key];
              traitsArrayT4.push({x: key, y: value});
            }
            for (const y of traitsArrayTotal) {
              countsTotal[y.name] = (countsTotal[y.name] || 0)+1;
            }
            for (const y of traitsArrayT4S1) {
              countsT4S1[y.name] = (countsT4S1[y.name] || 0)+1;
            }
            for (const y of traitsArrayT4S2) {
              countsT4S2[y.name] = (countsT4S2[y.name] || 0)+1;
            }
            for (const y of traitsArrayT4S3) {
              countsT4S3[y.name] = (countsT4S3[y.name] || 0)+1;
            }

            let maxP = stats.positions;
            maxP.total = 0;
            stats.positions.maxV = Math.max.apply(null, Object.values(maxP));
            winRateGalaxie.maxV = Math.max.apply(null, Object.values(counts));
            const maxC = Math.max.apply(null, Object.values(champCount));

            traitsArrayT1.sort((a, b) => b.y - a.y).splice(10, traitsArrayT1.length - 10);
            traitsArrayT4.sort((a, b) => b.y - a.y).splice(10, traitsArrayT4.length - 10);

            stats.count = {top4: countsTop4, perGalaxie: winRateGalaxie, total: counts, champs: { top1: unitsArrayTop1, top4: unitsArray, top4C: champCount, maxV: maxC, totalC: champCountTotal }, traits: { top1: traitsArrayT1, top4: traitsArrayT4, top4C: countsT4, totalC: countsTotal, top4S1: countsT4S1, top4S2: countsT4S2, top4S3: countsT4S3 }};
            return stats;
        } catch (err) {
            this.setStatus(204);
            console.error('Caught error', err);
        }
    }

    @Get('/summoners/entries/{id}')
    public async getEntriesBySummoner(@BodyProp('userId') userId: string) : Promise<any> {
        let item: ISummoner = await summonersModel.findOne({userId: userId});
        api.get('euw1', 'tftLeague.getLeagueEntriesForSummoner', item.puuid ).then(x => {
          console.log(x);
        });
    }

    @Post('/summoners/match_history_paginate/{id}')
    public async getMatchHistoryPaginate(req: any) : Promise<any> {
        const resPerPage = 10;
        const page = req.body.page || 1;
        try {
            let item: ISummonerMatches[] = await summonersMatchesModel.find({sumId: req.body.sumId, userId: req.params.id, 'data.info.queue_id': {$eq: 1100}})
            .sort({'data.info.game_datetime': -1})
            .skip((resPerPage * page) - resPerPage)
            .limit(resPerPage);
            let numOfProducts = await summonersMatchesModel.count({sumId: req.body.sumId, userId: req.params.id, 'data.info.queue_id': {$eq: 1100}})
            const res = {data: item, pageIndex: page, pageSize: resPerPage, pages: Math.ceil(numOfProducts / resPerPage), numResult: numOfProducts};
            return res;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }

    @Get('/summoners/match_history/{userId}')
    public async getMatchHistory(@BodyProp('sumId') sumId: string, @BodyProp('userId') userId: string) : Promise<any> {
        try {
            let item: ISummonerMatches[] = await summonersMatchesModel.find({sumId: sumId, userId: userId, 'data.info.queue_id': {$eq: 1100}}).sort({'data.info.game_datetime': -1});
            return item;
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
                puuid: item.puuid,
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
    public async getMatchesExt(@BodyProp('userId') userId: string, @BodyProp('id') id: string ): Promise<any> {
        let sum: ISummoner = await summonersModel.findOne({_id: id, userId: userId, deletedAt: { $eq: null }});
        let data: any[];
        try {
          api.get('europe', 'tftMatch.getMatchIdsByPUUID', sum.puuid ).then(res => {
            data = res;
            data.forEach(async value => {
              let match: ISummonerMatches = await summonersMatchesModel.findOne({entrie: value});
              if(!match) {
                let sumE = new summonersEntriesModel({
                  userId: sum.userId,
                  sumId: sum._id,
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
    public async setLastMatchInfoExt(@BodyProp('userId') userId: string, @BodyProp('id') id: string ) {
        await this.getMatchesExt(userId, id);
        let sum: ISummonerEntries[] = await summonersEntriesModel.find({userId: userId, sumId: id});
        let data: any[];
        try {
          sum.forEach(ent => {
            setTimeout(async function () {
              let match: ISummonerMatches = await summonersMatchesModel.findOne({entrie: ent.entrie});
              //if (!match) {
                api.get('europe', 'tftMatch.getMatch', ent.entrie ).then(res => {
                  data = res;
                  let sumE = new summonersMatchesModel({
                    userId: ent.userId,
                    sumId: ent.sumId,
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
                    let s: ISummoner = await summonersModel.findOne({_id: id, userId: userId, deletedAt: { $eq: null }});
                    if (x.puuid == s.puuid) {
                      let details = new summonersMatchesDetailsModel({
                        userId: ent.userId,
                        sumId: ent.sumId,
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

              //}
            }, 100);

          });
          return sum;

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
