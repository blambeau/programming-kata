export const computeColumns = (cards) => {
  if (!cards.length) return [];

  const months = cards.map(c => c.publication_date.startOf('month')).sort();
  const min = months[0];
  const max = months[months.length-1];
  if (min.equals(max)) {
    return [min];
  } else {
    return [min, max];
  }
}
