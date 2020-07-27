import * as mongoose from "mongoose";

const summonersEntriesSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    entrie: { type: String, unique : true, required : true, dropDups: true }
});

export interface ISummonerEntries extends mongoose.Document {
    userId?: string,
    entrie?: {
        userId?: string,
        entrie?: string,
        data?: { metadata: object, info: {
            game_datetime: number,
            game_length: number,
            game_variation: string,
            game_version: string,
            participants: {
                companion: object,
                gold_left: number,
                last_round: number,
                level: number,
                placement: number,
                players_eliminated: number,
                puuid: string,
                time_eliminated: number,
                total_damage_to_players: number,
                traits: object,
                units: object
            },
            queue_id: number,
            tft_set_number: number
        } }
    }
};

const summonersEntriesModel = mongoose.model<ISummonerEntries>('summonersEntries', summonersEntriesSchema);

export { summonersEntriesModel }
