import Koa from 'koa'

const router = require('koa-router')()
const fileParser = require('async-busboy')
const _ = require('underscore')
const fs = require('fs')
const scissors = require('scissors')
const PromisedStream = require('stream-to-promise')
const uuid = require('../../../app/utils/uuid').default
const app = new Koa()

function splitFiles(splits, filepath) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filepath).on('error', e => reject(e))

    return scissors
      .join(...splits)
      .pdfStream()
      .pipe(writeStream)
      .on('error', e => reject(e))
      .on('finish', resolve)
  })
}

router.post('/deals/pdf-splitter', async (ctx, next) => {
  const { files, fields } = await fileParser(ctx.req)
  const pages = JSON.parse(fields.pages)
  const { title, room_id, task_id } = fields
  const { user } = ctx.session

  if (!user) {
    ctx.status = 401
    ctx.body = ''

    return false
  }

  try {
    const filepath = `/tmp/${uuid()}.pdf`

    _.each(files, file => {
      if (!fs.existsSync(file.path)) {
        throw new Error(`File ${file.filename} is not uploaded correctly, try again.`)
      }
    })

    const splits = _.map(files, file => {
      const selectedPages = _.chain(pages)
        .filter(doc => `${doc.documentId}.pdf` === file.filename)
        .pluck('pageNumber')
        .value()

      return scissors(file.path).pages(...selectedPages)
    })

    if (splits.length === 0) {
      throw new Error('No pdf file selected to split')
    }

    // split files
    await splitFiles(splits, filepath)

    const response = await ctx
      .fetch(`/rooms/${room_id}/attachments`, 'POST')
      .set('Authorization', `Bearer ${user.access_token}`)
      .attach('attachment', filepath, `${title}.pdf`)

    // response is a file object
    const file = response.body.data

    await ctx
      .fetch(`/tasks/${task_id}/messages`, 'POST')
      .set('Authorization', `Bearer ${user.access_token}`)
      .send({
        author: user.id,
        room: room_id,
        attachments: [file.id]
      })

    // cleanup !
    fs.unlink(filepath, () => null)
    _.each(files, file => {
      fs.unlink(file.path, () => null)
    })

    ctx.body = {
      file
    }
  } catch (e) {
    console.log('[ Splitter Error ] ', e)
    ctx.status = 400
    ctx.body = e
  }
})

module.exports = app.use(router.routes())
