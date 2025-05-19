export const MAX_SEQUENCE = 6;
export const TOTAL_SEQUENCE = 7;
export const MIN_SEQUENCE = -1;
export const DEFAULT_ATTEMPT = 0;
export const DEFAULT_SEQUENCE = 0;
export enum UserType {
    ADMIN = 'admin',
    USER = 'user',
    MODERATOR = 'moderator',
  };
  
  export enum Permission {
    CREATE = 'c',
    READ = 'r',
    UPDATE = 'u',
    DELETE = 'd',
  };
  
export const NO_BOOKING_TODAY = `🚫 No bookings available today! 🧭 Please re-register to begin a new adventure. 🔄✨`;

export const QUIZ_COMPLETED = `✅ You’ve already completed your treasure hunt quiz!
Want to play again? 🧭 Please re-register to begin a new adventure. 🔄✨`;

export const WELCOME_MESSAGE = `🎉 Welcome to the Ultimate Treasure Hunt! 🗺️
Solve clues, unlock secrets, and race your way to victory. 🧩🏁
Good luck, adventurer — your journey begins now! 🚀🪙`;

export const FUTURE_ONBOARD_WELCOME_MESSAGE = (registrationDate: any) => (`🎉 Welcome to the Ultimate Treasure Hunt! 🗺️
Solve clues, unlock secrets, and race your way to victory. 🧩🏁
Good luck, adventurer — your journey begins now! 🚀🪙

🕒 Registration opens on ${registrationDate}.  
⌨️ You'll need to type 'start' on this day to begin your quiz — be ready!`);

export const QUIZ_START_KEYWORD = 'start';