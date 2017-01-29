const expect = require('expect');
const {isRealString}= require('./validation');


describe('isRealString', () => {
  it('should reject non-string values', () => {
    let result = isRealString(111);
    expect(result).toBe(false);
  });

  it('should reject string with only spaces', () => {
    let result = isRealString('    ');
    expect(result).toBe(false);
  });

  it('should allow strings with non-space characters', () => {
    let result = isRealString('   Ann ');
    expect(result).toBe(true);
  });
});
