import VersionSchema from '../versionRepositories/VersionSchema';
import { Schema, Types } from 'mongoose';
export default class QuestionSchema extends VersionSchema {
  constructor(options: any) {
    const voucherSchema = new Schema(
      {
        voucherText: { type: String, required: true },
      },
      { _id: false }
    );
    const questionSchema = {
      clue: { type: String, required: true },
      hint: { type: String, required: true },
      trivia: { type: String, required: true },
      answer: { type: Schema.Types.Mixed },
      type: {
        type: String,
        enum: ["text", "image", "location"],
        required: true,
      },
      expectedLat: { type: Number },
      expectedLng: { type: Number },
      toleranceMeters: { type: Number, default: 100 },
      sequence: { type: Number, required: true },
      isStart: { type: Boolean, default: false },
      voucher: { type: voucherSchema, required: false }
    };
    super(questionSchema, options);
  };
};
