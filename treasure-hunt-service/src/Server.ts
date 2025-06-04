import express, { Response, Request } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mainRoute from "./routes";
import DataBaseServer from "./libs/DataBase";
import IConfig from "./config/IConfig";
import { verifyPaymentWebhook } from "./controller/payments/routes";
import { startBroadcastJob } from "./cron/broadcast";
import { seedQuestionsIfEmpty } from "./seed/questions";
import { errorHandler } from "./middlewares/error-handler";


export default class Server {
  private app: express.Express;

  constructor(private config: IConfig) {
    this.app = express();
  }

  bootstrap = (): Server => {
    this.setUpWebhookRoute();
    this.initBodyParser();
    this.setUpRoutes();
    return this;
  };

  setUpWebhookRoute = (): Server => {
      const { app } = this;
      app.post('/api/payment/verify', express.raw({ type: 'application/json' }), verifyPaymentWebhook); // mount it before bodyParser
      return this;
  };
  
  initBodyParser = (): Server => {
    const { app } = this;
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    return this;
  };

  setUpRoutes = (): Server => {
    const { app } = this;
    // app.use(cors());
    app.use(cors({
      origin: [
        "http://localhost:3000",         // for local dev
        "https://puzzlepanda.co"       // for production
      ],
      methods: ["GET", "POST", "OPTIONS","PATCH","DELETE"],
      credentials: true
    }));
    app.get("/health", (req: Request, res: Response) => {
      res.send(":::SERVER IS WORKING:::");
    });
    app.use("/api", mainRoute);
    app.use(errorHandler);
    return this;
  };

  run = (): Server => {
    const {
      app,
      config: { PORT: port, MONGO_URL: mongoUrl },
    } = this;
    DataBaseServer.open(mongoUrl)
      .then(() => {
        app.listen(port, () => {
          console.log(`:::App is running successfully at port number: ${port}:::::::`);
          seedQuestionsIfEmpty();
          // startBroadcastJob();
        });
      })
      .catch((err) => {
        console.error("ERROR", err);
      });
    return this;
  };
}
