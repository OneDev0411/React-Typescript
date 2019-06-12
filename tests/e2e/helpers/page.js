export const clickAndWait = async (page, selector, fullWait = true) => {
  const navigation = page.waitForNavigation({
    waitUntil: fullWait ? 'networkidle0' : 'networkidle2'
  })

  await page.waitForSelector(selector)
  await page.click(selector)
  await navigation
}

export const clickAndType = async (page, selector, value) => {
  await page.click(selector)
  await page.type(selector, value)
}

export const clearAndType = async (page, selector, value) => {
  await page.click(selector, { clickCount: 3 })
  await page.type(selector, value)
}

export const getElProp = async (page, selector, prop) => {
  const element = await page.$(selector)
  const handle = await element.getProperty(prop)

  return handle.jsonValue()
}

export const skipPhoneNagScreen = async page => {
  try {
    await page.waitForSelector('.c-verify-phone-modal', { timeout: 5000 })
    await page.keyboard.press('Escape')
  } catch (e) {
    // All is good, nothing to handle.
  }
}
export const navigateRelative = async (page, relativeUrl, fullWait = true) =>
  page.goto(
    `${global.host}${relativeUrl}`
      // Remove possible extra slashes
      .split('/')
      .filter(i => i)
      .join('/'),
    { waitUntil: fullWait ? 'networkidle0' : 'networkidle2' }
  )
