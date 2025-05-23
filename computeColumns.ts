import { DateTime } from 'luxon';

export type Card = { publication_date: DateTime }

export const computeColumns = (cards: Card[]) => {
  if (!cards.length) return [];

  const months = cards.map(c => c.publication_date.startOf('month'));
  const uniqueMonths = months.filter(
    (date, index, self) =>
      index === self.findIndex(d => d.toISO() === date.toISO())
  ).sort();

  return uniqueMonths;
}
