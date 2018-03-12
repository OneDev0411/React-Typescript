const fs = require('fs')
const colors = require('colors')

function patchPDFJS() {
  const path = 'node_modules/pdfjs-dist/build/pdf.combined.js'

  fs.readFile(path, 'utf8', (err, fileData) => {
    if (err) {
      throw new Error(err)
    }

    const patchCode = `if (data.fieldType === 'Sig') {
      _this2.setFlags(_util.AnnotationFlag.HIDDEN);
    }`

    if (fileData.includes(`/*${patchCode}*/`)) {
      console.log(colors.green('The PDF.js is patched already'))

      return false
    }

    if (!fileData.includes(patchCode)) {
      console.log(colors.red.bold('Can not find patch code in PDF.js project'))
      // console.log(`file data: ${fileData}`)
      console.log(colors.red(`Code: ${patchCode}`))
      // throw new Error('Can not find the code to patch')
    }

    const result = fileData.replace(patchCode, `/*${patchCode}*/`)

    fs.writeFile(path, result, 'utf8', err => {
      if (err) {
        throw new Error(err)
      }
    })
  })
}

patchPDFJS()
