import Koa from 'koa'

const router = require('koa-router')()
const streams = require('memory-streams')
const agent = require('superagent')
const fileParser = require('async-busboy')
const _ = require('underscore')
const fs = require('fs')
const scissors = require('scissors')
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

async function downloadFiles(files) {
  return Promise.all(_.map(JSON.parse(files), async file => {
    const stream = new streams.ReadableStream()
    const { body } = await agent.get(file.object.url).buffer()

    stream.append(body)

    return {
      path: stream,
      filename: `${file.documentId}.pdf`
    }
  }))
}

async function getFiles(files) {
  _.each(files, file => {
    if (!fs.existsSync(file.path)) {
      throw new Error(`File ${file.filename} is not uploaded correctly, try again.`)
    }
  })

  return files
}

router.post('/deals/pdf-splitter', async ctx => {
  const parser = await fileParser(ctx.req)
  const pages = JSON.parse(parser.fields.pages)
  const { title, room_id, task_id } = parser.fields
  const { user } = ctx.session

  if (!user) {
    ctx.status = 401
    ctx.body = ''

    return false
  }

  try {
    const filepath = `/tmp/${uuid()}.pdf`

    let files

    if (parser.files.length > 0) {
      files = await getFiles(parser.files)
    } else {
      files = await downloadFiles(parser.fields.files)
    }

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
      if (typeof file.path === 'object') {
        return true
      }

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
