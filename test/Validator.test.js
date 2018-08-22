const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-string'));

describe('Validator', () => {
  const Validator = require('../src/lib/Validator');
  let validator = new Validator();
  describe('#sourceMapEndpoint', () => {
    it('should return a string when no string is supplied', () => {
      expect(validator.sourceMapEndpoint()).to.be.a('string');
    });

    it('should return a path starting with /', () => {
      expect(validator.sourceMapEndpoint('source-map/')).to.startWith('/');
    });
  });

  describe('#parseEndpoint', () => {
    it('should return a string when no string is supplied', () => {
      expect(validator.parseEndpoint()).to.be.a('string');
    });

    it('should return a path starting with /', () => {
      expect(validator.parseEndpoint('source-map/[id]')).to.startWith('/');
    });

    it('should include the placeholder', () => {
      expect(validator.parseEndpoint('source-map/[id]')).to.include('[id]');
    });

    it('should throw an error when there is https in the url', () => {
      expect(
        validator.parseEndpoint.bind(validator, 'https://example.com/source-map/[id]'),
      ).to.throw(
        'Tawang: getEndPoint must not be a full address. Please provide only the relative address to the serverHost (e.g. /sourcemap)',
      );
    });
  });
});

process.stdin.resume();
