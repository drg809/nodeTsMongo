import * as mongoose from "mongoose";

const summonersMatchesDetailsSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    entrie: { type: String, required : true, dropDups: true },
    data:  {
        match_id: String,
        game_datetime: Number,
        game_length: Number,
        game_variation: String,
        game_version: String,
        name: String,
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
        units: Object,
        queue_id: Number,
        tft_set_number: Number
      }

});

summonersMatchesDetailsSchema.index({userId: 1, entrie: 1}, {unique: true});

export interface ISummonerMatches extends mongoose.Document {
    userId?: string,
    entrie?: string,
    data?: {
      match_id: string,
      game_datetime: number,
      game_length: number,
      game_variation: string,
      game_version: string,
      name?: string,
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
      units: object,
      queue_id: number,
      tft_set_number: number
    }
};

const summonersMatchesDetailsModel = mongoose.model<ISummonerMatches>('summonersMatchesDetails', summonersMatchesDetailsSchema);

export { summonersMatchesDetailsModel }
