import Koa from 'koa'
import agent from 'superagent'
import _ from 'underscore'

const router = require('koa-router')()
const app = new Koa()

const rawBaseUrl = 'https://rechat-forms.s3-us-west-2.amazonaws.com'

async function getDeal(request, id, user) {
  const response = await request(`/deals/${id}?associations[]=deal.checklists`).set({
    Authorization: `Bearer ${user.access_token}`
  })

  return response.body.data
}

function getTask(deal, taskId) {
  for (let checklist of deal.checklists) {
    for (let task of checklist.tasks) {
      if (task.id === taskId) {
        return task
      }
    }
  }
}

router.get('/deals/pdf/download/:dealId/:taskId/:type', async (ctx, next) => {
  const { dealId, taskId, type } = ctx.params

  try {
    const { user } = ctx.session

    if (!user) {
      ctx.status = 404

      return false
    }

    const deal = await getDeal(ctx.fetch, dealId, user)
    const task = getTask(deal, taskId)

    let url = null
    let filename = null

    if (type === 'raw') {
      filename = task.form
      url = `${rawBaseUrl}/${filename}.pdf`
    }

    if (type === 'submission') {
      filename = task.title
      url = task.submission ? task.submission.file.url : null
    }

    if (!url) {
      ctx.status = 404

      return false
    }

    // get file state
    const stat = await agent.head(url)

    if (stat.headers['content-type'] !== 'application/pdf') {
      ctx.status = 404

      return false
    }

    ctx.set('Content-Disposition', 'attachment')
    ctx.attachment(`${filename}.pdf`)

    ctx.body = agent.get(url)
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
