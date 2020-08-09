import * as mongoose from "mongoose";

const summonerStatsSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    leagueId: { type: String, required: false },
    summonerId: { type: String, unique: true, required: false },
    summonerName: { type: String, unique: true, required: false },
    queueType: { type: String, required: false },
    tier: { type: String, required: false },
    rank: { type: String, required: false },
    leaguePoints: { type: Number, required: false },
    wins: { type: Number, required: false },
    losses: { type: Number, required: false },
    hotStreak: { type: Boolean, required: false },
    veteran: { type: Boolean, required: false },
    inactive: { type: Boolean, required: false },
    freshBlood: { type: Boolean, required: false },
    miniSeries: [{
      losses:	{ type: Number, required: false },
      progress:	{ type: String, required: false },
      target:	{ type: Number, required: false },
      wins:	{ type: Number, required: false }
    }],
    positions: {top1: Number,top2: Number,top3: Number,top4: Number,top5: Number,top6: Number,top7: Number,top8: Number, total: Number},
    count: {top4: {}, perGalaxie: {}, total: {}}
});

export interface ISummonerStats extends mongoose.Document {
  leagueId?: string,
  summonerId?: string,
  summonerName?: string,
  queueType?: string,
  tier?: string,
  rank?: string,
  leaguePoints?: number,
  wins?: number,
  losses?: number,
  hotStreak?: boolean,
  veteran?: boolean,
  freshBlood?: boolean,
  inactive?: boolean,
  miniSeries?: {
    losses:	number,
    progress:	string,
    target:	number,
    wins:	number
  },
  positions?: {top1?: number,top2?: number,top3?: number,top4?: number,top5?: number,top6?: number,top7?: number,top8?: number,total?: number},
  count?: {top4: any, perGalaxie: any, total: any}
};

const summonersStatsModel = mongoose.model<ISummonerStats>('summonersStats', summonerStatsSchema);

export { summonersStatsModel }
