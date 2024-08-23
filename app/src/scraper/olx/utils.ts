export const parseOlxPrice = (text: string): number => {
  return parseInt(text.replace(' zł', '').replace(' ', ''));
}