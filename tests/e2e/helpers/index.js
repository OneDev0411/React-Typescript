import puppeteer from 'puppeteer'

export const init = async (options = {headless: true, slowMo: 0}) => {
    const browser = await puppeteer.launch(options)
    const page = await browser.newPage()
    await page.goto(global.host)
    return {browser, page}
}