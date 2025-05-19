import { Request, Response, NextFunction } from "express";
import IConfig from "../../config/IConfig";
import config from '../../config/configuration';
import QuestionRepository from "../../repositories/questions/QuestionRepositories";

class QuestionController {
  protected config: IConfig;
  static instance: QuestionController;
  private questionRepository: QuestionRepository = new QuestionRepository();
  constructor(config: IConfig) {
    this.config = config;
  }
  static getInstance = (): QuestionController => {
    if (!QuestionController.instance) {
      return (QuestionController.instance = new QuestionController(config));
    }
    return QuestionController.instance;
  };
  insertQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sampleQuestions = [
        {
          title: "Start of the Hunt",
          clue: "Type 'start' to begin your treasure hunt adventure!",
          hint: "Start the journey to find hidden knowledge.",
          trivia: "This marks the beginning of your epic quest.",
          answer: ["start"],
          type: "text",
          sequence: 0,
          isStart: true,
        },
        {
          title: "Soundless Bark",
          clue: "I'm full of leaves, but I’m not a tree. You can find me in schools but not in forests.",
          hint: "I'm filled with stories and wisdom.",
          trivia: "The oldest library was in Nineveh, 700 BC.",
          answer: ["library", "the library"],
          type: "text",
          sequence: 1,
          isStart: false,
        },
        {
          title: "Silent Timekeeper",
          clue: "I stand tall in London, known for my chime.",
          hint: "I'm not a watch, but I tell time.",
          trivia: "The bell is actually called Big Ben.",
          answer: ["big ben", "clock tower"],
          type: "text",
          sequence: 2,
          isStart: false,
        },
        {
          title: "Center of the City",
          clue: "In Delhi, all roads lead here. Surrounded by flags and buildings of power.",
          hint: "A ceremonial axis of the capital.",
          trivia: "India Gate and Rashtrapati Bhavan are nearby.",
          answer: ["india gate", "rajpath", "central delhi"],
          type: "text",
          sequence: 3,
          isStart: false,
        },
        {
          title: "Cold but Sweet",
          clue: "I’m cold and come in a cone, kids love me when the sun is shown.",
          hint: "Vanilla, chocolate, or strawberry?",
          trivia: "Marco Polo brought this treat from the East to Italy.",
          answer: ["ice cream", "icecream", "gelato"],
          type: "text",
          sequence: 4,
          isStart: false,
        },
        {
          title: "What Comes After Victory?",
          clue: "It comes after winning, sounds like a prize.",
          hint: "Used in games or rewards.",
          trivia: "It’s also used in software versioning.",
          answer: ["trophy", "reward", "badge"],
          type: "text",
          sequence: 5,
          isStart: false,
        },
      ];
      const { question = sampleQuestions } =req.body;
      const questionApiResponse = await this.questionRepository.insertMany(
        question
      );
      if(!questionApiResponse){
        throw new Error('Question are not inserted successfully')
      }
      res.status(200).json(questionApiResponse);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  };
}

export default QuestionController.getInstance();