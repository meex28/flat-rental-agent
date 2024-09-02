export const parseOtodomPrice = (text: string): number => {
  return parseInt(text.replace(' zł', '').replace(' ', ''));
}