import * as mongoose from 'mongoose';

export default interface IVersionSchema extends mongoose.Document {
    createdAt: string;
    originalId: string;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt: Date;
    deletedBy: string;
}
