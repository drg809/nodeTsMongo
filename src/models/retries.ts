import * as mongoose from "mongoose";

const retriesSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, unique: true, required: true },
    retries: { type: Number, default: 0, required: true },
    first: { type: Date, required: false },
    last: { type: Date, required: false },
});

export interface IRetries extends mongoose.Document {
  userId?: string,
  action?: string,
  retries?: number,
  first?: Date,
  last?: Date
};

const retriesModel = mongoose.model<IRetries>('retries', retriesSchema);

export { retriesModel }
