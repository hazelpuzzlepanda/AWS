import VersionSchema from '../versionRepositories/VersionSchema';
export default class ConfigDateSchema extends VersionSchema {
  constructor(options: any) {
    const configDateSchema = {
      userId: { type: String, required: true },
      lockedDates: {
        type: [String],
        default: [],
        required: true
      }
    };
    super(configDateSchema, options);
  }
}