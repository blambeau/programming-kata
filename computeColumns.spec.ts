import { expect } from 'chai';
import { computeColumns } from './computeColumns';
import { DateTime } from 'luxon';

const date = (str: string) => DateTime.fromISO(str)

describe('computeColumns', () => {

  it('works on the empty case', () => {
    const result = computeColumns([]);
    expect(result).to.eql([]);
  })

  it('works on a singleton', () => {
    const result = computeColumns([
      { publication_date: date('2025-01-17') }
    ]);
    expect(result).to.eql([
      date('2025-01-01')
    ]);
  })

  it('works on a pair within same month', () => {
    const result = computeColumns([
      { publication_date: date('2025-01-17') },
      { publication_date: date('2025-01-22') },
    ]);
    expect(result).to.eql([
      date('2025-01-01')
    ]);
  })

  it('works on a pair on consecutive months', () => {
    const result = computeColumns([
      { publication_date: date('2025-01-17') },
      { publication_date: date('2025-02-22') },
    ]);
    expect(result).to.eql([
      date('2025-01-01'),
      date('2025-02-01')
    ]);
  })

  it('works on a pair on anti-consecutive months', () => {
    const result = computeColumns([
      { publication_date: date('2025-02-22') },
      { publication_date: date('2025-01-17') },
    ]);
    expect(result).to.eql([
      date('2025-01-01'),
      date('2025-02-01')
    ]);
  })

  it('works on a pair on non consecutive months, while hiding empty columns', () => {
    const result = computeColumns([
      { publication_date: date('2025-01-17') },
      { publication_date: date('2025-03-22') },
    ], true);
    expect(result).to.eql([
      date('2025-01-01'),
      date('2025-03-01'),
    ]);
  })

})
