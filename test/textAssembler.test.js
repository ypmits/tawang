const chai = require('chai');
const fs = require('fs');
const path = require('path');
const { expect } = chai;
chai.use(require('chai-string'));

describe('textAssembler', () => {
  const textAssembler = require('./../src/lib/textAssembler');

  describe('without arguments', () => {
    const textAssembler = require('./../src/lib/textAssembler');

    it('should throw an error', () => {
      expect(textAssembler).to.throw();
    });
  });

  describe('with invalid id {id: 5}', () => {
    const textAssembler = require('./../src/lib/textAssembler');

    it('should throw an error', () => {
      expect(
        textAssembler.bind(textAssembler, {
          id: 5,
          fullParseEndpointAddress: 'https://example.com/source-map',
        }),
      ).to.throw();
    });
  });

  describe('with invalid parse endpoint {id: "13p23fg", fullParseEndpointAddress: 5}', () => {
    const textAssembler = require('./../src/lib/textAssembler');

    it('should throw an error', () => {
      expect(
        textAssembler.bind(textAssembler, {
          id: '13p23fg',
          fullParseEndpointAddress: 5,
        }),
      ).to.throw();
    });
  });

  describe('with valid arguments {id: "13p23fg", fullParseEndpointAddress: "https://example.com/source-map"}', () => {
    const textAssembler = require('./../src/lib/textAssembler');

    const id = '13p23fg';
    const fullParseEndpointAddress = 'https://example.com/source-map';
    const clientErrorHandlingCode = fs.readFileSync(
      path.join(__dirname, '..', 'src', 'lib', 'clientErrorHandling.js'),
    );

    it('should not throw an error', () => {
      expect(
        textAssembler.bind(textAssembler, {
          id,
          fullParseEndpointAddress,
        }),
      ).not.to.throw();
    });

    it('should return an object', () => {
      expect(
        textAssembler({
          id,
          fullParseEndpointAddress,
        }),
      ).to.be.an('object');
    });

    it('should return a prepend string', () => {
      expect(
        textAssembler({
          id,
          fullParseEndpointAddress,
        }),
      )
        .to.have.property('prepend')
        .that.is.a('string');
    });

    it('should return a append string', () => {
      expect(
        textAssembler({
          id,
          fullParseEndpointAddress,
        }),
      )
        .to.have.property('append')
        .that.is.a('string');
    });
    it('should not return anything apart from that', () => {
      expect(
        textAssembler({
          id,
          fullParseEndpointAddress,
        }),
      )
        .to.have.property('append')
        .that.is.a('string');
    });
    describe('prependString', () => {
      it('should include the id', () => {
        let result = textAssembler({
          id,
          fullParseEndpointAddress,
        });
        expect(result.prepend).to.include(id);
      });
      it('should include the endpoint address', () => {
        let result = textAssembler({
          id,
          fullParseEndpointAddress,
        });
        expect(result.prepend).to.include(fullParseEndpointAddress);
      });
    });

    describe('appendString', () => {
      let result = textAssembler({
        id,
        fullParseEndpointAddress,
      });
      it('should include the error handling code', () => {
        expect(result.append).to.include(clientErrorHandlingCode);
      });
    });
  });
});

process.stdin.resume();
