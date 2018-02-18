import Koa from 'koa'
import config from '../../../config/private'
import Promise from 'bluebird'
import memoryStream from 'memory-streams'
import agent from 'superagent'
import request from 'request'
import bodyParser from 'koa-bodyparser'
import _ from 'underscore'
import scissors from 'scissors'
import { PassThrough } from 'stream'
import FakeStream from '../../util/fake-stream'

const promisifiedRequest = Promise.promisifyAll(request)
const router = require('koa-router')()
const app = new Koa()

function splitFiles(splits) {
  return new Promise((resolve, reject) => {
    const stream = new memoryStream.WritableStream()

    return scissors
      .join(...splits)
      .pdfStream()
      .pipe(stream)
      .on('error', e => {
        console.log(e)
        reject(e)
      })
      .on('finish', () => resolve(stream))
  })
}

async function downloadFiles(files) {
  return Promise.all(
    _.map(files, async file => {
      const stream = new memoryStream.ReadableStream()
      const { body } = await agent.get(file.url).buffer()

      stream.append(body)

      return {
        path: stream,
        filename: `${file.documentId}.pdf`
      }
    })
  )
}

router.post('/deals/pdf-splitter', bodyParser(), async ctx => {
  const { pages, files, title, room_id, task_id } = ctx.request.body
  const { user } = ctx.session

  if (!user) {
    ctx.status = 401
    ctx.body = ''

    return false
  }

  const fakeStream = new FakeStream()

  const fakeInterval = setInterval(() => fakeStream.push('\n'), 1500)

  ctx.body = fakeStream.pipe(PassThrough())

  const finishStream = data => {
    clearInterval(fakeInterval)
    fakeStream.push(JSON.stringify(data))
    fakeStream.emit('end')
  }

  try {
    const downloadedFiles = await downloadFiles(files)

    const splits = _.map(downloadedFiles, file => {
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
    const splittedFileStream = await splitFiles(splits)

    const response = await promisifiedRequest.postAsync({
      url: `${config.api.url}/rooms/${room_id}/attachments`,
      json: true,
      headers: {
        // 'Content-Type': 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${user.access_token}`
      },
      formData: {
        file: {
          value: splittedFileStream.toBuffer(),
          options: {
            filename: `${title}.pdf`,
            contentType: 'application/pdf'
          }
        }
      }
    })

    // response is a file object
    if (response.statusCode !== 200) {
      throw new Error('Server Error, Try Again.')
    }

    const file = response.body.data

    await ctx
      .fetch(`/tasks/${task_id}/messages`, 'POST')
      .set('Authorization', `Bearer ${user.access_token}`)
      .send({
        author: user.id,
        room: room_id,
        attachments: [file.id]
      })

    finishStream({ success: true, file })
  } catch (e) {
    console.log('[ Splitter Error ] ', e)
    finishStream({ success: false, error: e.message })
  }
})

module.exports = app.use(router.routes())
