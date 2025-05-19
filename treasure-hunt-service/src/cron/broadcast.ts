import cron from "node-cron";
import pLimit from 'p-limit';
import dotenv from 'dotenv';
import IUserCreate from "../repositories/user/IUserCreate";
import UserRepository from "../repositories/user/UserRepositories";
import sendWhatsAppMessage from "../libs/twilio-client";
import QuestionRepository from "../repositories/questions/QuestionRepositories";
import { WELCOME_MESSAGE } from "../utils/constant";
dotenv.config();

export const startBroadcastJob = (): void => {
  cron.schedule(
    "*/5 10-11 * * *",
    async (): Promise<void> => {
      try {
        const todaysDate = new Date();
        const todayDateIsoString = new Date(
          Date.UTC(
            todaysDate.getUTCFullYear(),
            todaysDate.getUTCMonth(),
            todaysDate.getUTCDate()
          )
        ).toISOString();
        console.log(
          "Checking for today’s registrations at:",
          todayDateIsoString
        );
        const userRepository = new UserRepository();
        const questionRepository = new QuestionRepository();
        const users: IUserCreate[] | any = await userRepository.list({
          registrationDate: { $eq: todayDateIsoString },
          isPaymentSuccessful: { $eq: true },
          hasVoucher: { $eq: false },
          isBroadcasted: { $eq: false },
        });
        if (!users.length) {
          console.log("No users to broadcast currently.");
          return;
        }
        const question = await questionRepository.get({ isStart: true });
        if (!question) {
          console.error("No starting question found.");
          return;
        }
        const concurrencyLimit = Number(process.env.CONCURRENCY_LIMIT) || 5;
        const limit = pLimit(concurrencyLimit);
        await Promise.allSettled(
          users?.map((user: IUserCreate) => limit(async () => {
            try {
              console.log(`Broadcasting to user: ${user.mobileNumber}`);
              await sendWhatsAppMessage(
                user.phoneCountryCode,
                user.mobileNumber,
                WELCOME_MESSAGE
              );
              await sendWhatsAppMessage(
                user.phoneCountryCode,
                user.mobileNumber,
                question.clue
              );
              await userRepository.update(
                { mobileNumber: user.mobileNumber },
                {
                  currentSequence: question.sequence,
                  isBroadcasted: true,
                }
              );
              console.log(`Broadcasted to ${user.mobileNumber}`);
            } catch (err) {
              console.error(
                `Failed to broadcast to ${user.mobileNumber}`,
                err
              );
            }
          }))
        );
      } catch (error: any) {
        console.error("Broadcast job error:", error.message);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
  console.log("Broadcast cron job scheduled.");
};

