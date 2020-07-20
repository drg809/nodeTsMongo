import * as mongoose from "mongoose";

const databaseSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    tag: { type: String, required: false },
    setTft: { type: String, required: false },
    data: { type: String, required: false },
    deletedAt: { type: Date, required: false }
});

export interface IDatabase extends mongoose.Document {
  tag?: string,
  setTft?: string,
  data?: string,
  deletedAt?: Date
};

const databaseModel = mongoose.model<IDatabase>('database', databaseSchema);

export { databaseModel }
