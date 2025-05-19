import * as mongoose from 'mongoose';
import IUserModel from './IQuestionModel';
import QuestionScehma from './QuestionSchema';

export const questionScehma = new QuestionScehma({
    collection: 'Questions'
});

export const questionModel: mongoose.Model<IUserModel> = mongoose.model<IUserModel>(
    'questions', questionScehma, 'Questions');