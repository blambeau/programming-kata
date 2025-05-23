import { DateTime } from 'luxon';

export type Card = { publication_date: DateTime }

export const monthOf = (card: Card): DateTime => card.publication_date.startOf('month')

export const computeColumns = (cards: Card[], hide_empty_columns: boolean = false) => {
  if (!cards.length) return [];

  const months = cards.map(card => monthOf(card)).sort();
  const min = months[0];
  const max = months[months.length - 1];

  const result = [];
  let current = min;
  while (current <= max) {
    if (!hide_empty_columns || cards.some(card => monthOf(card).equals(current))) {
      result.push(current);
    }
    current = current.plus({month: 1})
  }

  return result;
}
