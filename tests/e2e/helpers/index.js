import puppeteer from 'puppeteer'

export const init = async (
  options = {
    headless: true,
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

export const testSelector = name => `[data-test="${name}"]`
