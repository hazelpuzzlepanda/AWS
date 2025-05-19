import { configDatesModel } from './ConfigDateModel';
import * as mongoose from 'mongoose';
import IConfigDatesModel from './IConfigDateModel';
import VersionRepository from '../versionRepositories/VersionRepository';

export default class ConfigDatesRepository extends VersionRepository<IConfigDatesModel, mongoose.Model<IConfigDatesModel>> {
  constructor() {
    super(configDatesModel);
  }

  static generateObjectId() {
    return String(new mongoose.Types.ObjectId());
  }
  
  async create(options: object) {
    return super.create(options);
  }

  async countDocuments(filter: object ={}, options: object = {}){
    return super.countDocuments(filter, options);
  }

  async list(query: any = {}, projection: any = {}, options: any = {}) {
    options.skip = Number(options.skip);
    options.limit = Number(options.limit);
    return super.list(query, projection, options);
  }

  async update(match: object = {}, dataToUpdate: any = {}, filters: object = {}) {
    return super.update(match, dataToUpdate, filters);
  }

  async delete(id: string) {
    return super.delete(id);
  }


  async get(data: object, projection: object = {}, options: object = {}) {
    return super.get({ ...data });
  }
}