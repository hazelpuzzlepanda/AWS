import { Request, Response, NextFunction } from "express";
import pLimit from "p-limit";
import QuestionRepository from "../../repositories/questions/QuestionRepositories";
import IConfig from "../../config/IConfig";
import config from "../../config/configuration";
import sendWhatsAppMessage from "../../libs/twilio-client";
import UserRepository from "../../repositories/user/UserRepositories";
import { isAnswerCloseEnough } from "../../utils/isAnswerCloseEnough";
import {
  DEFAULT_ATTEMPT,
  DEFAULT_SEQUENCE,
  MAX_SEQUENCE,
  MIN_SEQUENCE,
  NO_BOOKING_TODAY,
  QUIZ_COMPLETED,
  QUIZ_START_KEYWORD,
  TOTAL_SEQUENCE,
} from "../../utils/constant";
import { parsePhoneNumberWithError } from "libphonenumber-js";

class MessengerController {
  protected questionRepository: QuestionRepository = new QuestionRepository();
  protected config: IConfig;
  private userRepository: UserRepository = new UserRepository();
  private concurrencyLimiter: ReturnType<typeof pLimit>;
  static instance: MessengerController;
  constructor(config: IConfig) {
    this.config = config;
    this.concurrencyLimiter = pLimit(this.config.CONCURRENCY_LIMIT || 5);
  }
  static getInstance = (): MessengerController => {
    if (!MessengerController.instance) {
      return (MessengerController.instance = new MessengerController(config));
    }
    return MessengerController.instance;
  };
  sendLatestQuestionToParticipant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { phone } = req.body;
      const question = await this.questionRepository.get({ isStart: true });
      if (!question) return;
      await this.userRepository.update(
        { mobileNumber: phone },
        { currentSequence: question.sequence },
        {
          sort: { createdAt: -1 },
        }
      );
      const response = await sendWhatsAppMessage(phone, question?.clue);
      res.status(200).json(response);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  };
  private async safeSend(phoneCode: string, phone: string, message: string): Promise<void> {
    try {
      await sendWhatsAppMessage(phoneCode, phone, message);
    } catch (err) {
      const timestamp = new Date().toISOString();
      console.error(
        `[${timestamp}] [Twilio Error] Failed to send to ${phone}:`,
        message
      );
    }
  }
  private async processWhatsAppReply(
    phone: string,
    phoneCode: string,
    latestMessage: string
  ): Promise<void> {
    try {
      const todaysDate = new Date();
      const todayDateIsoString = new Date(
        Date.UTC(
          todaysDate.getUTCFullYear(),
          todaysDate.getUTCMonth(),
          todaysDate.getUTCDate()
        )
      ).toISOString();
      const userData = await this.userRepository.get({
        mobileNumber: phone,
        registrationDate: { $eq: todayDateIsoString },
        isPaymentSuccessful: true,
        hasVoucher: false,
        userType: { $eq: "user" },
      });
      if (!userData) {
        await this.safeSend(phoneCode, phone, NO_BOOKING_TODAY);
        return;
      } else {
        let currentSequence = userData?.currentSequence;
        const currentAttempts = userData?.currentAttempts ?? 0;
        const hasVoucher = userData?.hasVoucher;
        if (
          latestMessage?.toLowerCase() === QUIZ_START_KEYWORD?.toLowerCase() &&
          currentSequence === MIN_SEQUENCE &&
          !userData.hasVoucher &&
          !userData?.isBroadcasted
        ) {
          const question: any = await this.questionRepository.get({
            isStart: true,
          });
          if (!question) {
            const error = new Error("No Question found") as any;
            error.statusCode = 404;
            throw error;
          }
          await this.userRepository.updateById(userData._id, {
            currentSequence: question?.sequence,
            isBroadcasted: true,
          });
          currentSequence = question?.sequence;
        }
        if (currentSequence === MIN_SEQUENCE && userData?.hasVoucher) {
          if (
            latestMessage?.toLowerCase() === QUIZ_START_KEYWORD?.toLowerCase()
          ) {
            return await this.safeSend(phoneCode, phone, NO_BOOKING_TODAY);
          } else {
            return;
          }
        }
        if (
          currentSequence > MIN_SEQUENCE &&
          currentSequence <= MAX_SEQUENCE &&
          !hasVoucher
        ) {
          const question = await this.questionRepository.get({
            sequence: currentSequence,
          });
          if (!question) throw new Error("Question not found");
          if (latestMessage && question?.answer?.length) {
            const isCorrect = isAnswerCloseEnough(
              latestMessage,
              question.answer
            );
            if (isCorrect) {
              if (currentSequence !== DEFAULT_SEQUENCE) {
                await this.safeSend(
                  phoneCode,
                  phone,
                  `✅ Great job — that's the correct answer! 🎯🎉`
                );
                await new Promise((resolve) => setTimeout(resolve, 300));
              }
              if (currentSequence === 3 || currentSequence === 6) {
                await this.safeSend(
                  phoneCode,
                  phone,
                  `🎁 You've unlocked a voucher! 🪙 Voucher: ${question?.voucher?.voucherText}`
                );
                await new Promise((resolve) => setTimeout(resolve, 300));
              }
              const nextSequence = currentSequence + 1;
              if (nextSequence < TOTAL_SEQUENCE) {
                const nextQuestion = await this.questionRepository.get({
                  sequence: nextSequence,
                });
                await this.userRepository.updateById(userData._id, {
                  currentSequence: nextSequence,
                  currentAttempts: DEFAULT_ATTEMPT,
                });
                const prefixText =
                  currentSequence === DEFAULT_SEQUENCE
                    ? "👉 Question"
                    : "👉 Next question";
                await this.safeSend(
                  phoneCode,
                  phone,
                  `${prefixText}: ${nextQuestion?.clue}`
                );
                await new Promise((resolve) => setTimeout(resolve, 300));
              } else {
                await this.userRepository.updateById(userData._id, {
                  hasVoucher: true,
                  voucherUnlockedAt: new Date(),
                  currentSequence: MIN_SEQUENCE,
                  currentAttempts: DEFAULT_ATTEMPT,
                });
                await this.safeSend(
                  phoneCode,
                  phone,
                  `Thank you for participating in the quiz! 🎉 We appreciate your enthusiasm and hope you had fun.`
                );
              }
            } else if (currentAttempts === DEFAULT_ATTEMPT) {
              await this.userRepository.updateById(userData._id, {
                currentAttempts: 1,
              });
              const hint = `❌ That's not the correct answer.💡 Here's a hint: ${question.hint}`;
              await this.safeSend(phoneCode, phone, hint);
              await new Promise((resolve) => setTimeout(resolve, 300));
            } else {
              const nextSequence = currentSequence + 1;

              if (nextSequence < TOTAL_SEQUENCE) {
                const nextQuestion = await this.questionRepository.get({
                  sequence: nextSequence,
                });
                await this.userRepository.updateById(userData._id, {
                  currentSequence: nextSequence,
                  currentAttempts: DEFAULT_ATTEMPT,
                });
                const correctAnswers =
                  question?.answer?.length === 1
                    ? question?.answer[0]
                    : question?.answer.join(",");
                await sendWhatsAppMessage(
                  phoneCode,
                  phone,
                  `❌ Oops! That’s not correct. The right answer was: ${correctAnswers}.`
                );
                await new Promise((resolve) => setTimeout(resolve, 300));
                if (currentSequence === 3 || currentSequence === 6) {
                  await this.safeSend(
                    phoneCode,
                    phone,
                    `🎁 You've unlocked a voucher! 🪙 Voucher: ${question?.voucher?.voucherText}`
                  );
                }
                await new Promise((resolve) => setTimeout(resolve, 300));
                await this.safeSend(
                  phoneCode,
                  phone,
                  `👉 Next question: ${nextQuestion?.clue}`
                );
              } else {
                const correctAnswers =
                  question?.answer?.length === 1
                    ? question?.answer[0]
                    : question?.answer.join(",");
                await this.safeSend(
                  phoneCode,
                  phone,
                  `❌ Oops! That’s not correct. The right answer was: ${correctAnswers}.`
                );
                await new Promise((resolve) => setTimeout(resolve, 300));
                if (currentSequence === 3 || currentSequence === 6) {
                  await this.safeSend(
                    phoneCode,
                    phone,
                    `🎁 You've unlocked a voucher! 🪙 Voucher: ${question?.voucher?.voucherText}`
                  );
                }
                await new Promise((resolve) => setTimeout(resolve, 300));
                await this.userRepository.updateById(userData._id, {
                  hasVoucher: true,
                  voucherUnlockedAt: new Date(),
                  currentSequence: MIN_SEQUENCE,
                  currentAttempts: DEFAULT_ATTEMPT,
                });
                await this.safeSend(
                  phoneCode,
                  phone,
                  `Thank you for participating in the quiz! 🎉 We appreciate your enthusiasm and hope you had fun.`
                );
              }
            }
          }
        } else {
          await this.safeSend(phoneCode, phone, QUIZ_COMPLETED);
        }
      }
    } catch (error) {
      console.error("evaluateAnswerAndReply error:", error);
      throw error;
    }
  }

  evaluateAnswerAndReply = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { Body = "", From = "" } = req.body;
      const latestMessage = Body;
      const phoneNumberRaw = From?.split(":")[1];

      const phone = parsePhoneNumberWithError(phoneNumberRaw).nationalNumber;
      const phoneCode =
        parsePhoneNumberWithError(phoneNumberRaw).countryCallingCode;
      res.status(200).end();
      this.concurrencyLimiter(() =>
        this.processWhatsAppReply(phone, phoneCode, latestMessage)
      ).catch((err) => {
        console.error(`Error processing message from ${phone}:`, err);
        next(err);
      });
    } catch (error) {
      console.error("Webhook parse error:", error);
      next(error);
    }
  };
}

export default MessengerController.getInstance();
