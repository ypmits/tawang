const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-string'));

describe('Validator', () => {
  const Validator = require('../src/lib/Validator');
  let validator = new Validator();
  describe('#sourceMapEndpoint', () => {
    describe('with no arguments', () => {
      it('should return a string', () => {
        expect(validator.sourceMapEndpoint()).to.be.a('string');
      });
    });

    describe('with "souce-map/"', () => {
      it('should return a path starting with /', () => {
        expect(validator.sourceMapEndpoint('source-map/')).to.startWith('/');
      });
    });
  });

  describe('#parseEndpoint', () => {
    describe('with no arguments', () => {
      it('should return a string', () => {
        expect(validator.parseEndpoint()).to.be.a('string');
      });
    });

    describe('with source-map/[id]', () => {
      it('should return a path starting with /', () => {
        expect(validator.parseEndpoint('source-map/[id]')).to.startWith('/');
      });

      it('should include the placeholder', () => {
        expect(validator.parseEndpoint('source-map/[id]')).to.include('[id]');
      });
    });

    describe('with https://example.com/source-map/[id]', () => {
      it('should throw an error', () => {
        expect(
          validator.parseEndpoint.bind(validator, 'https://example.com/source-map/[id]'),
        ).to.throw(
          'Tawang: getEndPoint must not be a full address. Please provide only the relative address to the serverHost (e.g. /sourcemap)',
        );
      });
    });
  });
});
