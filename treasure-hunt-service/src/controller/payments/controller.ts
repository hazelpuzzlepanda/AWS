import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import IConfig from "../../config/IConfig";
import config from '../../config/configuration';
import PaymentRepository from '../../repositories/payments/PaymentRepositories';
import UserRepository from "../../repositories/user/UserRepositories";
import IUserModel from "../../repositories/user/IUserModel";
import { FUTURE_ONBOARD_WELCOME_MESSAGE, Permission, UserType, WELCOME_MESSAGE } from "../../utils/constant";
import sendWhatsAppMessage from "../../libs/twilio-client";
import QuestionRepository from "../../repositories/questions/QuestionRepositories";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import dayjs from "dayjs";

class PaymentController {
  private config: IConfig;
  private stripe: Stripe;
  static instance: PaymentController;
  private userRepository: UserRepository = new UserRepository();
  private paymentRepository: PaymentRepository = new PaymentRepository();
  private questionRepository: QuestionRepository = new QuestionRepository();
  constructor(config: IConfig) {
    this.config = config;
    this.stripe = new Stripe(this.config.STRIPE_SECRET_KEY);
  }
  static getInstance = (): PaymentController => {
    if (!PaymentController.instance) {
      return (PaymentController.instance = new PaymentController(config));
    }
    return PaymentController.instance;
  };
  initiatePayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const {
        amount = 100,
        registrationDate,
        mobileNumber,
        teamMemberCount,
        fullName,
      } = req.body;
      if (!amount || !mobileNumber) {
        const error = new Error("Missing required fields") as any;
        error.statusCode = 400;
        throw error;
      }
      const refinedMobileNumber = parsePhoneNumberWithError(
        mobileNumber || ""
      )?.nationalNumber;
      const userPresented = await this.userRepository.list(
        { mobileNumber: refinedMobileNumber, hasVoucher: false },
        {},
        { sort: { createdAt: -1 } }
      );
      if (userPresented && userPresented?.length) {
        const requestedDate = new Date(registrationDate);
        const requestedDateUTC = new Date(
          Date.UTC(
            requestedDate.getUTCFullYear(),
            requestedDate.getUTCMonth(),
            requestedDate.getUTCDate()
          )
        );
        const duplicateBooking = userPresented.some((user: any) => {
          const regDate = new Date(user?.registrationDate);
          const regDateOnly = new Date(
            Date.UTC(
              regDate.getUTCFullYear(),
              regDate.getUTCMonth(),
              regDate.getUTCDate()
            )
          );
          return regDateOnly.getTime() === requestedDateUTC.getTime();
        });
        if (duplicateBooking) {
          const error = new Error(
            "You already have a booking for this date. Please complete the existing quiz or choose another date."
          ) as any;
          error.statusCode = 409;
          throw error;
        }
      }
      const amountInPaiseOrCents = Math.round(parseFloat(amount) * 100);
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"], // provide all payments methods
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: { name: "Treasure Hunt Entry" },
              unit_amount: amountInPaiseOrCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${this.config.FE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.config.FE_URL}/failed`,
        metadata: {
          mobileNumber,
          registrationDate,
          teamMemberCount,
          fullName,
        },
      });
      const checkoutUrl = session.url;
      return res.status(200).json({ checkoutUrl });
    } catch (error) {
      return next(error);
    }
  };
  webhook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const sig = req.headers["stripe-signature"]!;
    const rawBody = req.body;
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        this.config.WEB_HOOK_SECRET!
      );
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(event.type, session.payment_status);
      if (
        event.type === "checkout.session.completed" &&
        session.payment_status === "paid"
      ) {
        const metadata = session?.metadata as {
          mobileNumber?: string;
          registrationDate?: string;
          teamMemberCount?: string;
          fullName?: string;
        };
        console.log(`:::METADATA::::${JSON.stringify(metadata)}`);
        const mobileNumber = parsePhoneNumberWithError(
          metadata?.mobileNumber || ""
        )?.nationalNumber;
        const phoneCode = parsePhoneNumberWithError(
          metadata?.mobileNumber || ""
        )?.countryCallingCode;
        const registrationDate = metadata?.registrationDate
          ? metadata.registrationDate
          : new Date();
        const teamMemberCount = metadata?.teamMemberCount
          ? parseInt(metadata.teamMemberCount, 10)
          : 2;
        const fullName = metadata?.fullName;
        const payment = await this.paymentRepository.create({
          mobileNumber,
          stripeSessionId: session.id,
          amount: session.amount_total,
          currency: session.currency,
          status: session.status,
        });
        if (payment._id) {
          const regDate = new Date(registrationDate);
          const regDateOnly = new Date(
            Date.UTC(
              regDate.getUTCFullYear(),
              regDate.getUTCMonth(),
              regDate.getUTCDate()
            )
          );
          const userResponse: IUserModel = await this.userRepository.create({
            mobileNumber,
            paymentId: payment._id,
            isPaymentSuccessful: true,
            isPaymentPending: false,
            isPaymentError: false,
            registrationDate: regDateOnly?.toISOString(),
            teamMemberCount,
            fullName,
            phoneCountryCode: phoneCode,
            userType: UserType.USER,
            permissions: [Permission.CREATE, Permission.READ],
          });
          if (!userResponse._id) {
            const error = new Error("User is not added succesfully") as any;
            error.statusCode = 500;
            throw error;
          }
          const todaysDate = new Date();
          const todayDateOnIsoString = new Date(
          Date.UTC(
            todaysDate.getUTCFullYear(),
            todaysDate.getUTCMonth(),
            todaysDate.getUTCDate()
          )
        ).toISOString();
          if(todayDateOnIsoString === regDateOnly?.toISOString()) {
            const question: any = await this.questionRepository.get({
              isStart: true,
            });
            if (!question) {
              const error = new Error("No Question found") as any;
              error.statusCode = 404;
              throw error;
            }
            await sendWhatsAppMessage(
              phoneCode,
              userResponse?.mobileNumber,
              WELCOME_MESSAGE
            );
            await new Promise(resolve => setTimeout(resolve, 500));
            await sendWhatsAppMessage(
              phoneCode,
              userResponse?.mobileNumber,
              `${question?.clue}`
            );
            await this.userRepository.updateById(userResponse._id, {
              currentSequence: question.sequence,
              isBroadcasted: true,
            });
          } else {
            await sendWhatsAppMessage(
              phoneCode,
              userResponse?.mobileNumber,
              FUTURE_ONBOARD_WELCOME_MESSAGE(dayjs(userResponse?.registrationDate).format("dddd, MMMM D, YYYY"))
            );
          }
        }
        return res.status(200).json({ success: true, payment });
      } else {
        const error = new Error("Payment not completed") as any;
        error.statusCode = 400;
        throw error;
      }
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return next(err);
    }
  };
  verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.query;
      if (!sessionId) {
        const error = new Error("Missing sessionId") as any;
        error.statusCode = 400;
        throw error;
      }
      const session: Stripe.Response<Stripe.Checkout.Session> =
        await this.stripe.checkout.sessions.retrieve(sessionId.toString());
      if (session.payment_status === "paid") {
        return res.json({ valid: true, session });
      } else {
        return res.json({ valid: false, status: session.payment_status });
      }
    } catch (err) {
      return next(err);
    }
  };
}

export default PaymentController.getInstance();