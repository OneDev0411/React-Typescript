import puppeteer, { ElementHandle } from 'puppeteer'

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

  await page.goto((global as any).host)

  return { browser, page }
}

export const getTestSelector = (name: string | string[]) => {
  return ([] as string[])
    .concat(name)
    .map(item => `[data-test="${item}"]`)
    .join(' ')
}

export const getElementText = async (element: ElementHandle) =>
  (await element.getProperty('textContent')).jsonValue()

export const getFirstChildOfTestSelector = name =>
  `${getTestSelector(name)} *:first-child`
