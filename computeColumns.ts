export const computeColumns = (cards, hide_empty_columns = false) => {
  if (!cards.length) return [];

  const months = cards.map(c => c.publication_date.startOf('month')).sort();
  const min = months[0];
  const max = months[months.length-1];

  if (hide_empty_columns) {
    if (min.equals(max)) {
      return [min];
    } else {
      return [min, max];
    }
  } else {
    const result = [];
    let current = min;
    while (current <= max) {
      result.push(current);
      current = current.plus({ month: 1 })
    }
    return result;
  }
}
