import * as mongoose from "mongoose";

const summonersEntriesSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    entrie: { type: String, unique : true, required : true, dropDups: true }
});

export interface ISummonerEntries extends mongoose.Document {
    userId?: string,
    entrie?: string
};

const summonersEntriesModel = mongoose.model<ISummonerEntries>('summonersEntries', summonersEntriesSchema);

export { summonersEntriesModel }
