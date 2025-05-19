export interface IQuestion extends Document {
    clue: string;
    hint: string;
    trivia: string;
    answer?: string;
    type: 'text' | 'image' | 'location';
    expectedLat?: number;
    expectedLng?: number;
    toleranceMeters?: number;
    sequence: number;
    isStart: boolean;
    voucher?: {
      voucherText: string;
    }
  }
  