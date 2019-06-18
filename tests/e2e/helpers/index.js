import puppeteer from 'puppeteer'

export const init = async (
  options = {
    headless: process.env.HEADLESS !== 'false',
    slowMo: 0,
    args: ['--window-size=1100,800', '--no-sandbox'],
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
