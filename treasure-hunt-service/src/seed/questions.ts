import QuestionRepository from "../repositories/questions/QuestionRepositories";

export const seedQuestionsIfEmpty = async (): Promise<void> => {
  try {
    const questionRepository = new QuestionRepository();
    const questionCount = await questionRepository.countDocuments();
    if (questionCount > 0) {
      console.log('Questions already seeded, skipping.');
      return;
    }
    const sampleQuestions = [
      {
        clue: "Type 'start' to begin your treasure hunt adventure!",
        hint: "Start the journey to find hidden knowledge.",
        trivia: "This marks the beginning of your epic quest.",
        answer: ["start"],
        type: "text",
        sequence: 0,
        isStart: true,
      },
      {
        clue: "She’s long, wooden, and full of wild rides. 🎡📸 Text me the name of this Brighton landmark and send a selfie of you next to it!",
        hint: "She stretches out into the sea",
        trivia: "19% of Brighton residents say they have had sex on the beach",
        answer: ["Brighton Pier"],
        type: "text",
        sequence: 1,
        isStart: false,
      },
      {
        clue: "George IV wasn’t just into crowns—he built a pleasure palace for his private pursuits. Go to this regal and rauchy place. Send me the name and your location when you are there!",
        hint: "A grand building with many domes",
        trivia:
          "There’s a secret underground tunnel that connects the Royal Pavilion to Brighton Dome, allegedly used by King George IV to sneak his mistresses in and out of the palace without being seen",
        answer: ["Brighton Pavillion"],
        type: "text",
        sequence: 2,
        isStart: false,
      },
      {
        clue: "The name of this shop is what you'll feel browsing Brighton's best for adult toys.... head there and then text me the name!",
        hint: "The name of the shop rhymes with Bust 🍒",
        trivia:
          "Brighton is the UK city with the most Google searches for love eggs and butt plugs",
        answer: ["Lust!"],
        type: "text",
        sequence: 3,
        isStart: false,
        voucher: {
          voucherText: 'Go inside and show this voucher, tour the shop, and claim your free raunchy gift!'
        }
      },
      {
        clue: "She may have ruled with a stiff upper lip, but Queen Victoria's private diaries have been described as the Victorian 50 Shades of Grey - detailing her lust for Prince Albert. Find her statue and tell me: is she alone or with her royal consort?",
        hint: "You can find the statue in Victoria Gardens",
        trivia:
          "58% of Brighton residents claim to have sex >once a week, making the city one of the UK’s top ten most sexually active",
        answer: ["Alone"],
        type: "text",
        sequence: 4,
        isStart: false,
      },
      {
        clue: "Standing tall and proud by the sea, this towering shaft takes you up with ease. It’s smooth, it’s long, and it rises with might—what’s the name of Brighton’s tallest delight? ",
        hint: "I am Europe's tallest moving viewing platform",
        trivia:
          "In 1979 Brighton opened its first official nudist beach, which was one of the first in the UK (its near the Marina)",
        answer: ["Brighton i360"],
        type: "text",
        sequence: 5,
        isStart: false,
      },
      {
        clue: "This pub is named after a prince, but also refers to a rather cheeky piercing below the belt. Find this pub and text me its name—where royal and raunchy are both in the same game!",
        hint: "I am a male genital piercing",
        trivia:
          "In 1979 Brighton opened its first official nudist beach, which was one of the first in the UK (its near the Marina)",
        answer: ["The Prince Albert pub"],
        type: "text",
        sequence: 6,
        isStart: false,
        voucher: {
          voucherText: 'Head inside, flash this voucher, and claim your victory drink—you earned it!'
        }
      },
    ];

    await questionRepository.insertMany(sampleQuestions);
    console.log('Questions seeded successfully.');
  } catch (error: any) {
    console.error('Error seeding questions:', error.message);
  }
};
