const { Duplex } = require('stream')

const bufferToStream = buffer => {
  const tmp = new Duplex()
  tmp.push(buffer)
  tmp.push(null)
  return tmp
}
module.exports = bufferToStream
