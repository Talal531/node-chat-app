var expect = require('expect');

// load module that we are testing
var { generateMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message', () => {
        var from = 'Jen';
        var text = 'Some Message';
        var message = generateMessage(from, text);

        expect(message.createdAt).toBe('number');
        expect(message).toInclude({ from, text });
    });
});