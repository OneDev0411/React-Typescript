const util = require('util')
const Readable = require('stream').Readable

function FakeStream(options) {
  Readable.call(this, options)
}

util.inherits(FakeStream, Readable)

FakeStream.prototype._read = function fake() {}

module.exports = FakeStream
