import * as mongoose from "mongoose";

const summonerStatsSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    leagueId: { type: String, required: false },
    summonerId: { type: String, unique: true, required: false },
    summonerName: { type: Number, required: false },
    queueType: { type: String, required: false },
    tier: { type: String, required: false },
    rank: { type: Number, required: false },
    leaguePoints: { type: Number, required: false },
    wins: { type: Number, required: false },
    losses: { type: Number, required: false },
    hotStreak: { type: Number, required: false },
    veteran: { type: Number, required: false },
    inactive: { type: Number, required: false },
    freshBlood: { type: Number, required: false },
    miniSeries: [{
      losses:	{ type: Number, required: false },
      progress:	{ type: String, required: false },
      target:	{ type: Number, required: false },
      wins:	{ type: Number, required: false }
    }]
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
  }
};

const summonerStatsModel = mongoose.model<ISummonerStats>('summonerStats', summonerStatsSchema);

export { summonerStatsModel }
