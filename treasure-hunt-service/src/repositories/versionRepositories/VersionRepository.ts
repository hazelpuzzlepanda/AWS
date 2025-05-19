import * as mongoose from 'mongoose';
export default class VersionRepository<D extends mongoose.Document, M extends mongoose.Model<D>> {
    private modelType: M;

    constructor(modelType: M) {
        this.modelType = modelType;
    }
    static generateObjectId() {
        return String(new mongoose.Types.ObjectId());
    }
    async create(options: object) : Promise<D>{
        return this.modelType.create({
            ...options
        });
    }

    async countDocuments(filter: object = {}, options: object = {}): Promise<number> {
       return this.modelType.countDocuments(filter, options);
    }

    async insertMany(bulkInsert: any[] = []) : Promise<D[]> {
        return this.modelType.insertMany(bulkInsert);
    }

    async list(query: any = {}, projection: any = {}, options: any = {}) : Promise<D[] | any> {
        return this.modelType.find(query, projection, options);
    }

    async update(match: any, dataToUpdate: any = {}, filters: object = {}) : Promise<D | null> {
        return this.modelType.findOneAndUpdate({ ...match }, dataToUpdate, { ...filters });
    }

    async updateById(id: any, dataToUpdate: any = {}) : Promise<D | null> {
        return this.modelType.findByIdAndUpdate({ _id: id }, dataToUpdate);
    }

    async delete(id: any) {

        return this.modelType.findOneAndDelete({ _id: id })
    }

    async get(data: object, projection: object = {} , options: object = {}) {
        return this.modelType.findOne({ ...data }, projection, options).lean();
    }
}