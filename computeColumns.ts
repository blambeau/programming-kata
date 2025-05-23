import { DateTime } from 'luxon';

export type Card = { publication_date: DateTime }

export const computeColumns = (cards: Card[]) => {
  if (!cards.length) return [];

  const months = cards.map(c => c.publication_date.startOf('month')).sort();
  const min = months[0];
  const max = months[months.length - 1];

  const result = [];
  let current = min;
  while (current <= max) {
    result.push(current);
    current = current.plus({month: 1})
  }

  return result;
}
