export const clickAndWait = async (page, selector) => {
  const navigation = page.waitForNavigation({ waitUnitl: 'networkidle0' })

  await page.click(selector)
  await navigation
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
