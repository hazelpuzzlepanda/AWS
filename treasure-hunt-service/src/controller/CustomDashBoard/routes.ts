import { Router } from "express";
import CustomDashboardController from "./controller";

const customDashboardHandler = Router();

customDashboardHandler.post(
  "/broadcast",
  CustomDashboardController.sendLatestQuestionToParticipant
);
customDashboardHandler.post(
    "/hunt/answer",
    CustomDashboardController.evaluateAnswerAndReply
  );
export default customDashboardHandler;
