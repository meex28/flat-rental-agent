export const escapeTelegramMarkdownV2 = (text: string) => {
  // escape all special characters with \\
  return text.replace(/[_*[\]()~`>#\\+\-=|{}.!]/g, '\\$&');
};
