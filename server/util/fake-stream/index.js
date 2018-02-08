const util = require('util')
const Readable = require('stream').Readable

function FakeStream(options) { 
  Readable.call(this, options)
}

util.inherits(FakeStream, Readable)

FakeStream.prototype._read = function() {
  // it's just a fake :P
}

module.exports = FakeStream