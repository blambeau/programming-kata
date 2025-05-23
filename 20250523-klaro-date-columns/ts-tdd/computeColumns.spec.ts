import { expect } from 'chai';
import { Card, computeColumns } from './computeColumns';
import { DateTime } from 'luxon';

const date = (str: string) => DateTime.fromISO(str)

const isComplete = (cards: Card[], result: DateTime[]) => {
  return cards.every(card => {
    const d = card.publication_date;
    return result.some(month => {
      return month <= d && d <= month.plus({month: 1})
    })
  })
}

const isContinuous = (cards: Card[], result: DateTime[]) => {
  return result.reduce((pair, month) => {
    const oldTruth = pair[0];
    const prevMonth = pair[1];
    return [
      oldTruth && (prevMonth === null || month.equals(prevMonth.plus({month: 1}))),
      month,
    ]
  }, [true, null])[0];
}

const isMinimal = (cards: Card[], result: DateTime[]) => {
  if (cards.length === 0) return result.length === 0;

  const first = result[0];
  const last = result[result.length - 1];
  return [first, last].every(month => {
    return cards.some(card => {
      const d = card.publication_date;
      return first <= d && d <= first.plus({month: 1})
    });
  });
}

const isCompact = (cards: Card[], result: DateTime[]) => {
  return result.every(month => {
    return cards.some(card => {
      const d = card.publication_date;
      return month <= d && d <= month.plus({month: 1})
    })
  })
}

const randomDateTime = (start: DateTime = DateTime.fromISO('2024-01-01'), end: DateTime = DateTime.fromISO('2026-01-01')): DateTime => {
  const startMillis = start.toMillis();
  const endMillis = end.toMillis();
  const randomMillis = startMillis + Math.random() * (endMillis - startMillis);
  return DateTime.fromMillis(randomMillis);
}

const randomDateTimesArray = (count: number): DateTime[] => {
  const dates: DateTime[] = [];
  for (let i = 0; i < count; i++) {
    dates.push(randomDateTime());
  }
  return dates;
}

describe('computeColumns', () => {

  it('works on the empty case', () => {
    const cards: Card[] = [];
    const result = computeColumns(cards);
    expect(result).to.eql([]);
    expect(isComplete(cards, result)).to.eql(true);
    expect(isContinuous(cards, result)).to.eql(true);
    expect(isMinimal(cards, result)).to.eql(true);
  })

  it('works on a singleton', () => {
    const cards = [
      { publication_date: date('2025-01-17') }
    ];
    const result = computeColumns(cards);
    expect(result).to.eql([
      date('2025-01-01')
    ]);
    expect(isComplete(cards, result)).to.eql(true);
    expect(isContinuous(cards, result)).to.eql(true);
    expect(isMinimal(cards, result)).to.eql(true);
  })

  it('works on a pair within same month', () => {
    const cards = [
      { publication_date: date('2025-01-17') },
      { publication_date: date('2025-01-22') },
    ];
    const result = computeColumns(cards);
    expect(result).to.eql([
      date('2025-01-01')
    ]);
    expect(isComplete(cards, result)).to.eql(true);
    expect(isContinuous(cards, result)).to.eql(true);
    expect(isMinimal(cards, result)).to.eql(true);
  })

  it('works on a pair on consecutive months', () => {
    const cards = [
      { publication_date: date('2025-01-17') },
      { publication_date: date('2025-02-22') },
    ];
    const result = computeColumns(cards);
    expect(result).to.eql([
      date('2025-01-01'),
      date('2025-02-01')
    ]);
    expect(isComplete(cards, result)).to.eql(true);
    expect(isContinuous(cards, result)).to.eql(true);
    expect(isMinimal(cards, result)).to.eql(true);
  })

  it('works on a pair on anti-consecutive months', () => {
    const cards = [
      { publication_date: date('2025-02-22') },
      { publication_date: date('2025-01-17') },
    ];
    const result = computeColumns(cards);
    expect(result).to.eql([
      date('2025-01-01'),
      date('2025-02-01')
    ]);
    expect(isComplete(cards, result)).to.eql(true);
    expect(isContinuous(cards, result)).to.eql(true);
    expect(isMinimal(cards, result)).to.eql(true);
  })

  it('works on a triple on consecutive months', () => {
    const cards = [
      { publication_date: date('2025-01-17') },
      { publication_date: date('2025-02-22') },
      { publication_date: date('2025-03-12') },
    ];
    const result = computeColumns(cards);
    expect(result).to.eql([
      date('2025-01-01'),
      date('2025-02-01'),
      date('2025-03-01'),
    ]);
    expect(isComplete(cards, result)).to.eql(true);
    expect(isContinuous(cards, result)).to.eql(true);
    expect(isMinimal(cards, result)).to.eql(true);
  })

  it('works on a triple on consecutive months in any order', () => {
    const cards = [
      { publication_date: date('2025-02-22') },
      { publication_date: date('2025-01-17') },
      { publication_date: date('2025-03-12') },
    ];
    const result = computeColumns(cards);
    expect(result).to.eql([
      date('2025-01-01'),
      date('2025-02-01'),
      date('2025-03-01'),
    ]);
    expect(isComplete(cards, result)).to.eql(true);
    expect(isContinuous(cards, result)).to.eql(true);
    expect(isMinimal(cards, result)).to.eql(true);
  })

  it('works on a triple on non consecutive months', () => {
    const cards = [
      { publication_date: date('2025-01-17') },
      { publication_date: date('2025-02-22') },
      { publication_date: date('2025-04-12') },
    ];
    const result = computeColumns(cards);
    expect(result).to.eql([
      date('2025-01-01'),
      date('2025-02-01'),
      date('2025-03-01'),
      date('2025-04-01'),
    ]);
    expect(isComplete(cards, result)).to.eql(true);
    expect(isContinuous(cards, result)).to.eql(true);
    expect(isMinimal(cards, result)).to.eql(true);
    expect(!isCompact(cards, result)).to.eql(true);
  })

  it('works on a triple on non consecutive months, while hiding empty columns', () => {
    const cards = [
      { publication_date: date('2025-01-17') },
      { publication_date: date('2025-02-22') },
      { publication_date: date('2025-04-12') },
    ];
    const result = computeColumns(cards, true);
    expect(result).to.eql([
      date('2025-01-01'),
      date('2025-02-01'),
      date('2025-04-01'),
    ]);
    expect(isComplete(cards, result)).to.eql(true);
    expect(!isContinuous(cards, result)).to.eql(true);
    expect(isMinimal(cards, result)).to.eql(true);
    expect(isCompact(cards, result)).to.eql(true);
  })

  it('works on random data, while showing all columns', () => {
    [0, 1, 5, 10, 20, 40].every(size => {
      const cards: Card[] = randomDateTimesArray(size).map(date => {
        return { publication_date: date };
      });
      const result = computeColumns(cards);
      expect(isComplete(cards, result)).to.eql(true);
      expect(isContinuous(cards, result)).to.eql(true);
      expect(isMinimal(cards, result)).to.eql(true);
    })
  })

  it('works on random data, while hiding empty columns', () => {
    [0, 1, 5, 10, 20, 40].every(size => {
      const cards: Card[] = randomDateTimesArray(size).map(date => {
        return { publication_date: date };
      });
      const result = computeColumns(cards, true);
      expect(isComplete(cards, result)).to.eql(true);
      expect(isMinimal(cards, result)).to.eql(true);
    })
  })

})
