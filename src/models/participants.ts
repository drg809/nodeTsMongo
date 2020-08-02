import * as mongoose from "mongoose";

const participantsSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    puuid: { type: String, unique: true, required: false },
    summonerName: { type: String, unique: true, required: false },
    summonerLevel: { type: Number, required: false },
    accountId: { type: String, required: false },
    region: { type: String, required: false },
    profileIconId: { type: Number, required: false }

});

export interface IParticipant extends mongoose.Document {
  puuid?: string,
  summonerName?: string,
  summonerLevel?: number,
  region?: string,
  profileIconId?: number,
  accountId?: string
};

const participantsModel = mongoose.model<IParticipant>('participants', participantsSchema);

export { participantsModel }
