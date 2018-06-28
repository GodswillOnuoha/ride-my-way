var assert = require('assert');
require('../app.js');
// import server from '../app';

describe('Basic Mocha String Test', function () {
 it('should return number of charachters in a string', function () {
        assert.equal("Hello".length, 5);
    });

 it('should return first charachter of the string', function () {
        assert.equal("Hello".charAt(0), 'H');
    });
});
