export const parseNumber = (input: string): number | null => {
  const num = parseInt(input.trim());
  return isNaN(num) ? null : num;
};
