import * as mongoose from 'mongoose';
export default class VersionSchema extends mongoose.Schema {
    constructor(schema: any, options: any){
        const versionSchema= {
            createdAt:{
                type: Date,
                default: Date.now
            },
            originalId: String,
            createdBy: String,
            updatedAt: Date,
            updatedBy: String,
            deletedAt: Date,
            deletedBy: String,
        }
        super({...schema,...versionSchema}, options);
    }
 
}