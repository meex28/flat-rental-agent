import {parseNumber} from "../../utils/parsing";

export const handleOptionalNumericInput = async (
  ctx: any, // TODO: use correct type
  field: string,
  min?: number
): Promise<number | undefined> => {
  if (!ctx.message || !ctx.message.text) {
    await ctx.reply("Please enter a valid number or type 'skip'.");
    return NaN;
  }
  const input = ctx.message.text.toLowerCase();
  if (input === 'skip') {
    await ctx.reply(`Okay, skipping the ${field}.`);
    return undefined;
  }
  const value = parseNumber(input);
  if (value === null) {
    await ctx.reply("Invalid input. Please enter a valid number or type 'skip'.");
    return NaN;
  }
  if (min !== undefined && value < min) {
    await ctx.reply(`The ${field} cannot be less than ${min}. Please enter a valid number or type 'skip'.`);
    return NaN;
  }
  return value;
};
