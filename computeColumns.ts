export const computeColumns = (cards) => {
  if (!cards.length) return [];

  return [cards[0].publication_date.startOf('month')]
}
