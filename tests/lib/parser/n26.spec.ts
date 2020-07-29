import parse from '../../../src/lib/parsers/n26';

describe('n26 parser', () => {
  it('returns null when parsing empty lines', () => {
    const result = parse('')
    expect(result).toBeNull();
  });

  it('parses payment notifications', () => {
    const line = '2020-07-27;Your payment of €123.93 to PAYEE NAME has been successfully processed.';
    const result = parse(line)
    expect(result).toEqual({
      amount: -123930,
      date: '2020-07-27',
      payee_name: 'PAYEE NAME'
    });
  });

  it('parses a transfer notification (using a dot as a decimal separator)', () => {
    const line = '2020-07-22;You\'ve received a transfer of € 4,924.34 from Foo, Bar.';
    const result = parse(line)
    expect(result).toEqual({
      amount: 4924340,
      date: '2020-07-22',
      payee_name: 'Foo, Bar'
    })
  });

  it('parses a transfer notification (using a comma as a decimal separator)', () => {
    const line = '2020-07-16;You received a transfer of € 40,00 from Steven Seagal.';
    const result = parse(line)
    expect(result).toEqual({
      amount: 40000,
      date: '2020-07-16',
      payee_name: 'Steven Seagal'
    })
  });

  it('parses a refund notification', () => {
    const line = '2020-07-22;Your refund of €0.87 from COMPANY NAME has been successfully processed.';
    const result = parse(line)
    expect(result).toEqual({
      amount: 870,
      date: '2020-07-22',
      payee_name: 'COMPANY NAME'
    })
  });
})

