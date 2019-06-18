import puppeteer from 'puppeteer'

const __CI__ = process.env.NODE_ENV === 'ci'
const args = __CI__ ? ['--no-sandbox'] : ['--window-size=1100,800']

export const init = async (
  options = {
    headless: __CI__ || process.env.HEADLESS !== 'false',
    slowMo: 0,
    args,
    defaultViewport: null
  }
) => {
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()

  await page.goto(global.host)

  return { browser, page }
}

export const getTestSelector = name => `[data-test="${name}"]`

export const getFirstChildOfTestSelector = name =>
  `${getTestSelector(name)} *:first-child`
