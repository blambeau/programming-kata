import { expect } from 'chai';
import { computeColumns } from './computeColumns';

describe('compute_columns', () => {

  it('works on the empty case', () => {
    const result = computeColumns([]);
    expect(result).to.eql([]);
  })

})
