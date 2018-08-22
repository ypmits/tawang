const chai = require('chai');
const { expect } = chai;

const MemoryFileSystem = require('memory-fs'); // eslint-disable-line import/no-extraneous-dependencies
const webpack = require('webpack');

describe('Tawang', () => {
  describe('with valid options in production mode', () => {
    it('should run successfully', done => {
      const path = require('path');
      const Tawang = require('./../');

      const compiler = webpack({
        entry: path.resolve(__dirname, './mock-data/Tawang/src/script.js'),
        output: {
          path: '/build',
          filename: 'main.bundle.js',
        },
        plugins: [
          new Tawang({
            serverHost: 'example.com',
          }),
        ],
        mode: 'production',
      });
      let files = new MemoryFileSystem();
      compiler.outputFileSystem = files;

      compiler.run((err, stats) => {
        if (err) {
          throw err;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
          info.errors.forEach(error => {
            console.error(error);
          });
          throw new Error('Webpack build failed! There are probably some errors above.');
        }

        if (stats.hasWarnings()) {
          info.warnings.forEach(error => {
            console.error(error);
          });
        }
        if (!Array.isArray(files.readdirSync('/'))) {
          throw new Error('Build failed: No files generated!');
        }

        if (files.readdirSync('/build')[0] !== 'main.bundle.js') {
          throw new Error('Build failed: No output file generated!');
        }
        // console.log(stats);
        done();
      });
    });
  });
  describe('with valid options in development mode', () => {
    it('should run successfully', done => {
      const path = require('path');
      const Tawang = require('./../');

      const compiler = webpack({
        entry: path.resolve(__dirname, './mock-data/Tawang/src/script.js'),
        output: {
          path: '/build',
          filename: 'main.bundle.js',
        },
        plugins: [
          new Tawang({
            serverHost: 'tawang.eu.dev.monkapps.com',
          }),
        ],
        mode: 'development',
        devtool: 'source-map',
      });
      let files = new MemoryFileSystem();
      compiler.outputFileSystem = files;

      compiler.run((err, stats) => {
        if (err) {
          throw err;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
          info.errors.forEach(error => {
            console.error(error);
          });
          throw new Error('Webpack build failed! There are probably some errors above.');
        }

        if (stats.hasWarnings()) {
          info.warnings.forEach(error => {
            console.error(error);
          });
        }
        if (!Array.isArray(files.readdirSync('/'))) {
          throw new Error('Build failed: No files generated!');
        }

        if (files.readdirSync('/build')[0] !== 'main.bundle.js') {
          throw new Error('Build failed: No output file generated!');
        }
        // console.log(stats);
        done();
      });
    });
  });
});
