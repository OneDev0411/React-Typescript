import puppeteer from 'puppeteer'

export const init = async (
  options = {
    headless: process.env.HEADLESS !== 'false',
    slowMo: 0,
    args: ['--window-size=1100,800'],
    defaultViewport: null
  }
) => {
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()

  await page.goto(global.host)

  return { browser, page }
}

export const getTestSelector = name => `[data-test="${name}"]`
