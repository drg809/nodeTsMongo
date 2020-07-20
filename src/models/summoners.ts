import * as mongoose from "mongoose";

const summonersSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    summonerName: { type: String, required: false },
    puuid: { type: String, required: false },
    region: { type: String, required: false },
    summonerLevel: { type: Number, required: false },
    accountId: { type: String, required: false },
    profileIconId: { type: Number, required: false },
    deletedAt: { type: Date, required: false }
});

export interface ISummoner extends mongoose.Document {
  userId?: string,
  summonerName?: string,
  puuid?: string,
  region?:  string,
  summonerLevel?: number,
  accountId?: string,
  profileIconId?: number,
  deletedAt?: Date
};

const summonersModel = mongoose.model<ISummoner>('summoners', summonersSchema);

export { summonersModel }
