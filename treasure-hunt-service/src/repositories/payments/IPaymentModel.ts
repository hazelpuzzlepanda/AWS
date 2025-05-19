import IVersionSchema from '../versionRepositories/IVersionSchema';

export default interface IPaymentModel extends IVersionSchema {
  mobileNumber: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: string;
};