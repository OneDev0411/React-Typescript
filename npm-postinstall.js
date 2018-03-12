const fs = require('fs')

function patchPDFJS() {
  const path = 'node_modules/pdfjs-dist/build/pdf.combined.js'

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      throw new Error(err)
    }

    const result = data.replace(/'sig'/gi, '"rechat-foo-bar"')

    fs.writeFile(path, result, 'utf8', err => {
      if (err) {
        throw new Error(err)
      }
    })
  })
}

patchPDFJS()
