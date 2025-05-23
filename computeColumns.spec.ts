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

describe('computeColumns', () => {

  it('works on the empty case', () => {
    const cards: Card[] = [];
    const result = computeColumns(cards);
    expect(result).to.eql([]);
    expect(isComplete(cards, result)).to.eql(true);
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
  })

})
