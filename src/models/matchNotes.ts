import * as mongoose from "mongoose";

const matchNotesSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    entrieId: { type: String, required : true, dropDups: true },
    text: { type: String, required : true, dropDups: true },
    visible: { type: Boolean, required : true, dropDups: true }
});

export interface IMatchNotes extends mongoose.Document {
    userId?: string,
    entrieId?: string,
    text?: string,
    visible?: boolean
};

const matchNotesModel = mongoose.model<IMatchNotes>('matchNotes', matchNotesSchema);

export { matchNotesModel }
