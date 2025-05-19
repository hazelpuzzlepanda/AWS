import * as mongoose from 'mongoose';
import IConfigDatesModel from './IConfigDateModel';
import ConfigDateSchema from './ConfigDateSchema';

export const configDatesSchema = new ConfigDateSchema({
    collection: 'lockedDates'
});

export const configDatesModel: mongoose.Model<IConfigDatesModel> = mongoose.model<IConfigDatesModel>(
    'lockedDates', configDatesSchema, 'LockedDates');