export const parseOlxPrice = (text: string): number => {
  return parseInt(text.replace(' zł', '').replace(' ', ''));
}

/**
 * Parse raw creation date from OLX.
 * @param text - raw text, can be in formats:
 * - "Dzisiaj o HH:mm"
 * - "DD month YYYY"
 * - "Odświeżono Dzisiaj o HH:mm"
 * - "Odświeżono dnia DD month YYYY"
 * @return - parsed date
 */
export const parseOlxCreationDate = (text: string): Date => {
  const months: { [key: string]: number } = {
    'stycznia': 0, 'lutego': 1, 'marca': 2, 'kwietnia': 3, 'maja': 4, 'czerwca': 5,
    'lipca': 6, 'sierpnia': 7, 'września': 8, 'października': 9, 'listopada': 10, 'grudnia': 11
  };

  const today = new Date();
  const cleanedText = text.replace('Odświeżono ', '').replace('dnia ', '');

  if (cleanedText.startsWith('Dzisiaj o ')) {
    const [hours, minutes] = cleanedText.slice(10).split(':').map(Number);
    today.setHours(hours, minutes, 0, 0);
    return today;
  } else {
    const [day, month, year] = cleanedText.split(' ');
    const parsedDate = new Date(
      parseInt(year),
      months[month.toLowerCase()],
      parseInt(day)
    );
    return parsedDate;
  }
};
