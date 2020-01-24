import urlParser from 'url'

import bodyParser from 'koa-bodyparser'

import { isEmpty, template_path, isLoggedIn } from './helpers'
import config from '../../config/private'
import { getBrandByHostname } from '../../app/models/brand/get-brand-by-hostname'

let mailgun = require('mailgun-js')({
  apiKey: config.mailgun.api_key,
  domain: config.mailgun.domain_url
})

const router = require('koa-router')()

router.get('/', async ctx => {
  ctx.log('Website-Routes:::Start')

  // TODO: This is quickfix for claystapp,
  // because we need to define a middleware and redirect the users automaticly
  // for all the website routes, not only home page
  const { hostname } = urlParser.parse(ctx.request.origin)

  try {
    ctx.log('Website-Routes:::getBrandByHostname:::Start')

    const brand = await getBrandByHostname(hostname)

    if (brand) {
      return ctx.redirect('/dashboard/mls')
    }
  } catch (e) {
    ctx.log('Website-Routes:::getBrandByHostname:::Error')
    console.log(e)
    // Ignore error it's ok not to find a brand here.
  } finally {
    ctx.log('Website-Routes:::getBrandByHostname:::End')
  }

  // After discussing we decided to revert back the previous experience
  // and redirect users to dashboard automatically for now.
  if (isLoggedIn(ctx)) {
    ctx.log('Website-Routes:::End')
    ctx.redirect('/dashboard')
  }

  ctx.log('Website-Routes:::End')

  return ctx.render(template_path('index.ejs'), {
    title: 'Rechat',
    isLoggedIn: isLoggedIn(ctx)
  })
})

router.get('/faq', async ctx =>
  ctx.render(template_path('faq.ejs'), {
    title: 'FAQ | Rechat',
    isLoggedIn: isLoggedIn(ctx)
  })
)

router.get('/contact', async ctx =>
  ctx.render(template_path('contact.ejs'), {
    title: 'Learn More | Rechat',
    isLoggedIn: isLoggedIn(ctx)
  })
)

router.get('/about', async ctx =>
  ctx.render(template_path('about.ejs'), {
    title: 'About | Rechat',
    isLoggedIn: isLoggedIn(ctx)
  })
)

router.get('/terms', async ctx =>
  ctx.render(template_path('terms.ejs'), {
    title: 'Terms of Use | Rechat',
    isLoggedIn: isLoggedIn(ctx)
  })
)

router.get('/terms/mls', async ctx =>
  ctx.render(template_path('mlsTerms.ejs'), {
    title: 'MLS® Terms | Rechat',
    isLoggedIn: isLoggedIn(ctx)
  })
)

router.get('/privacy', async ctx =>
  ctx.render(template_path('privacy.ejs'), {
    title: 'Privacy Policy | Rechat',
    isLoggedIn: isLoggedIn(ctx)
  })
)

router.get('/vulnerability', async ctx =>
  ctx.render(template_path('vulnerability.ejs'), {
    title: 'Vulnerability Disclosure Program | Rechat',
    isLoggedIn: isLoggedIn(ctx)
  })
)

// TODO: creating routing dynamically for job board.
// We only have one open position so it works for now.
router.get('/about/outbound-sales-development-representative', async ctx =>
  ctx.render(
    template_path('jobs-outbound-sales-development-representative.ejs'),
    {
      title: 'Outbound Sales Development Representative',
      isLoggedIn: isLoggedIn(ctx)
    }
  )
)

router.get('/jobs/director-of-sales', async ctx =>
  ctx.render(template_path('jobs-director-of-sales.ejs'), {
    title: 'Director of Sales',
    isLoggedIn: isLoggedIn(ctx)
  })
)

router.post('/contact', bodyParser(), async ctx => {
  const {
    first_name,
    last_name,
    email,
    phone,
    brokerage_name
  } = ctx.request.body

  ctx.response.type = 'json'

  // Validation
  if (isEmpty([first_name, last_name, email, phone, brokerage_name])) {
    ctx.response.status = 422
    ctx.response.body = JSON.stringify({
      message: 'Please fill all the required fields.'
    })

    return false
  }

  // Preparing the email
  // I'm using noreply@rechat.com instead of the actual user email because of https://help.yahoo.com/kb/SLN24050.html?guccounter=1&guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&guce_referrer_sig=AQAAADZ1zbTaQn5aLtqqCv4N2sFNmJmSHyHqRUqMfHuMgfht5-W2UR9Fq6vuCG8vjlSig4dbwfHK2iyRyxaAWSKqh0Fv9wQ4Dh4A-45wFbXQfCkGb3dKJvILoIqGO3tCagxmNvcxVUlZ2xoCRTGkCg4XW9cpFiQWyEbdIR0U4vdn90DV
  let data = {
    from: `${first_name} ${last_name}<noreply@rechat.com>`,
    to: 'support@rechat.com',
    bcc: 'seth@rechat.com',
    subject: 'Get in touch request - Rechat Website',
    text: `
      First Name: ${first_name}
      Last Name: ${last_name}
      Email: ${email}
      Phone: ${phone}
      Brokerage Name: ${brokerage_name}
    `
  }

  // Let's send it. it will be queue.
  // TODO: We should handle Mailgun errors here
  await mailgun.messages().send(data)

  // Successful reponse
  ctx.response.body = JSON.stringify({
    message: 'Thanks. We will get in touch with you soon.'
  })
})

const routes = router.routes()

export default routes
