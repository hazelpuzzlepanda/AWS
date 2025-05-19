import { userModel } from './UserModel';
import * as mongoose from 'mongoose';
import IUserModel from './IUserModel';
import VersionRepository from '../versionRepositories/VersionRepository';

export default class UserRepository extends VersionRepository<IUserModel, mongoose.Model<IUserModel>> {
  constructor() {
    super(userModel);
  }

  static generateObjectId() {
    return String(new mongoose.Types.ObjectId());
  }
  
  async countDocuments(filter: object = {}, options: object = {}) {
     return super.countDocuments(filter, options);
  }
  async create(options: object) {
    const userId = UserRepository.generateObjectId();
    return super.create({...options, userId });
  }

  async list(query: any = {}, projection: any = {}, options: any = {}) {
    options.skip = Number(options.skip);
    options.limit = Number(options.limit);
    return super.list(query, projection, options);
  }

  async update(match: object, dataToUpdate: any = {}, filter: object = {}) {
    return super.update(match, dataToUpdate, filter);
  }

  async updateById(id: any, dataToUpdate: any = {}) : Promise<IUserModel | null> {
    return super.updateById(id, dataToUpdate);
  }

  async delete(id: string) {
    return super.delete(id);
  }

  async get(data: object, projection?: object, options?: object) {
    return super.get({ ...data }, projection, options);
  }
}