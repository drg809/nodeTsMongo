import * as mongoose from "mongoose";

const retriesSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    retries: { type: Number, required: true },
    first: { type: Date, required: true },
    last: { type: Date, required: true },
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
