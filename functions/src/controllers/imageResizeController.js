const admin = require('firebase-admin')
const bucket = admin.storage().bucket()
const resizeImage = require('../utils/resizeImage')
const bufferToStream = require('../utils/bufferToStream')

module.exports = {
  store: async (req, res) => {
    const { store, name, sizes, data } = req.body
    const urlImages = []

    try {
      for (let i = 0; i < sizes.length; i++) {
        const { data: imageBuffer, info } = await resizeImage(
          data,
          sizes[i].style,
          sizes[i].size
        )

        const style = sizes[i].style.trim()
        const imageStyle = style.toLowerCase() === 'circle' ? `_${style}` : ''
        const imageSize = `${info.width}x${info.height}`
        const format = `.${info.format}`
        const imageName = `${name}_${imageSize}${imageStyle}${format}`
        const file = bucket.file(imageName, { public: true })
        const stream = bufferToStream(imageBuffer)
        stream
          .pipe(file.createWriteStream({ gzip: true, resumable: true }))
          .on('finish', () => file.makePublic())
        const publicUrl = file.publicUrl()
        urlImages.push(publicUrl)
      }

      res.status(201).json({
        store,
        urlImages
      })
    } catch (error) {
      res.status(500).json({
        Error: error.message
      })
    }
  }
}
