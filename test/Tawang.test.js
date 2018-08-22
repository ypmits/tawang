const chai = require('chai');
const { expect } = chai;

describe('numberOfLines', () => {
  const numberOflines = require('../src/lib/numberOflines');
  const testString = 'test1\ntest2\ntest3';

  it('should return a number', () => {
    expect(numberOflines()).to.be.a('number');
  });

  it('should count the right number of lines', () => {
    expect(numberOflines(testString)).to.equal(3);
  });
});

process.stdin.resume();
