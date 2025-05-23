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

})
