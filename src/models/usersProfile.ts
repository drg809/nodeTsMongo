import * as mongoose from "mongoose";

const usersProfileSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: { type: String, unique: true, required: false },
    name:  { type: String, required: false },
    lastname:  { type: String, required: false },
    phone:  { type: String, required: false },
    country:  { type: String, required: false },
    about:  { type: String, required: false },
    deletedAt: { type: Date, required: false }
});

export interface IUserProfile extends mongoose.Document {
    userId?:  string,
    name?:  string,
    lastname?: string,
    phone?: string,
    country?: string,
    about: string,
    deletedAt?: Date
};

const usersProfileModel = mongoose.model<IUserProfile>('usersProfile', usersProfileSchema);

export { usersProfileModel }
