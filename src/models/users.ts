import * as mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    email: { type: String, unique : true, required : true, dropDups: true },
    password: { type: String, required: true },
    token:  { type: String, required: false },
    status: { type: Number, enum: [0, 1], default: 0, required: false },
    role:  { type: String, required: false },
    puuid:  { type: String, required: false },
    main: { type: String, required: false },
    deletedAt: { type: Date, required: false }
});

export interface IUser extends mongoose.Document {
    email?: string,
    password?: string,
    token?: string,
    status?: number,
    role?: string,
    puuid?: any,
    main?: any,
    deletedAt?: Date
};

const usersModel = mongoose.model<IUser>('users', usersSchema);

export { usersModel }
