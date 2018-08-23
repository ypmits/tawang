const chai = require('chai');
const path = require('path');
const { expect } = chai;

describe('numberOfLines', () => {
  const numberOflines = require(path.join(__dirname, '../src/lib/numberOflines'));

  describe('with a string of three lines', () => {
    const testString = 'test1\ntest2\ntest3';

    it('should return 3', () => {
      expect(numberOflines(testString)).to.equal(3);
    });
  });

  describe('with a string of five lines', () => {
    const testString = 'test1\ntest2\ntest3\ntest4\ntest5';

    it('should return 5', () => {
      expect(numberOflines(testString)).to.equal(5);
    });
  });

  describe('with null', () => {
    const testString = null;

    it('should throw an error', () => {
      expect(numberOflines.bind(numberOflines, testString)).to.throw();
    });
  });

  describe('with NaN', () => {
    const testString = NaN;

    it('should throw an error', () => {
      expect(numberOflines.bind(numberOflines, testString)).to.throw();
    });
  });
});
