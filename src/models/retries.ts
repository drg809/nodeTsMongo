import * as mongoose from "mongoose";

const retriesSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    retries: { type: Number, required: false }
});

export interface IRetries extends mongoose.Document {
  userId?: string,
  action?: string,
  retries?: number
};

const retriesModel = mongoose.model<IRetries>('database', retriesSchema);

export { retriesModel }
