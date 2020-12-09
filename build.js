const path = require('path')

const fs = require('fs-extra')
const webpack = require('webpack')

const config = require('./webpack')

async function run() {
  console.log('[ + ] Start compiling')

  const stats = await compile()

  console.log(
    `[ + ] Webpack compile is complete in ${stats.time / 1000} seconds`.magenta
  )

  fs.copySync(
    path.join(path.resolve(__dirname, './app'), 'static'),
    path.join(path.resolve(__dirname, './dist'), 'static')
  )

  console.log('[ + ] Static assets are copied'.magenta)
}

function compile() {
  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      const jsonStats = stats.toJson(true)

      if (jsonStats.errors.length > 0) {
        console.log('[ * ] Webpack compiler encountered errors.'.red)
        jsonStats.errors.forEach(err => {
          console.log(err)
        })

        return reject(new Error('Webpack compiler encountered errors'))
      }

      if (jsonStats.warnings.length > 0) {
        console.log('[ ! ] Webpack compiler encountered warnings.'.yellow)
        jsonStats.warnings.forEach(warning => {
          console.log(warning.message)
        })
      }

      return resolve(jsonStats)
    })
  })
}

run().catch(e => {
  console.error('error in build:', e)
  process.exit(1)
})
