import { questionModel } from './QuestionModel';
import * as mongoose from 'mongoose';
import IQuestionModel from './IQuestionModel';
import VersionRepository from '../versionRepositories/VersionRepository';

export default class QuestionRepository extends VersionRepository<IQuestionModel, mongoose.Model<IQuestionModel>> {
  constructor() {
    super(questionModel);
  }

  static generateObjectId() {
    return String(new mongoose.Types.ObjectId());
  }

  async countDocuments () {
    return super.countDocuments();
  }

  async create(options: object) {
    return super.create(options);
  }

  async bulkInsert(bulkInsert: any[] = []) {
    return super.insertMany(bulkInsert);
  }

  async list(query: any = {}, options: any = {}) {
    options.skip = Number(options.skip);
    options.limit = Number(options.limit);
    return super.list(query, options);
  }

  async update(id: string, dataToUpdate: any = {}) {
    return super.update(id, dataToUpdate);
  }

  async delete(id: string) {
    return super.delete(id);
  }

  async get(data: object, projection: object = {} , options: object = {}) {
    return super.get({ ...data }, projection, options);
  }
}