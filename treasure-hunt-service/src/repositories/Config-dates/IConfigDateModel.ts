import IVersionSchema from '../versionRepositories/IVersionSchema';

export default interface IConfigDatesModel extends IVersionSchema {
  userId: string;
  lockedDates: [string];
}