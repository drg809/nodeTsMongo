import * as mongoose from "mongoose";

const ParticipantsSchema = new mongoose.Schema({
    companion: Object,
    gold_left: Number,
    last_round: Number,
    level: Number,
    placement: Number,
    players_eliminated: Number,
    puuid: String,
    time_eliminated: Number,
    total_damage_to_players: Number,
    traits: Object,
    units: Object
});

const summonersMatchesSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    entrie: { type: String, unique : true, required : true, dropDups: true },
    data:  { metadata: Object, info: {
      game_datetime: Number,
      game_length: Number,
      game_variation: String,
      game_version: String,
      participants: ParticipantsSchema,
      queue_id: Number,
      tft_set_number: Number
    } }
});

export interface ISummonerEntries extends mongoose.Document {
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
};

const summonersMatchesModel = mongoose.model<ISummonerEntries>('summonersMatches', summonersMatchesSchema);

export { summonersMatchesModel }
