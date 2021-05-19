const sharp = require('sharp')

const resizeImage = async (image, style, size) => {
  const buffer = Buffer.from(image.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64')
  const [width = 1500, height = 1500] = size
  const svg = `<svg> <rect x='0' y='0' width='${width}' height='${height}'
     rx='${width}' ry='${height}'/></svg>`
  const roundedCorners = Buffer.from(svg)
  switch (style) {
    case 'circle':
      return sharp(buffer)
        .composite([
          {
            input: roundedCorners,
            blend: 'dest-in'
          }
        ])
        .png()
        .resize(width, height)
        .toBuffer({ resolveWithObject: true })
    default:
      return sharp(buffer)
        .resize(width, height)
        .toBuffer({ resolveWithObject: true })
  }
}
module.exports = resizeImage
