export const isAnswerCloseEnough = (userInput: string, answerArray: string[]): boolean => {
    const normalizedInput = userInput.trim().toLowerCase();
    for (let ans of answerArray) {
      const normalizedAnswer = ans.trim().toLowerCase();
      if (normalizedInput === normalizedAnswer) return true;
      if (normalizedAnswer.includes(normalizedInput)) return true;
      if (levenshtein(normalizedInput, normalizedAnswer) <= 2) return true;
    }
    return false;
  };
  
  // Levenshtein implementation
  const levenshtein = (a: string, b: string): number => {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    return dp[a.length][b.length];
  };
  