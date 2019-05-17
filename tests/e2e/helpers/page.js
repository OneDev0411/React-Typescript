export const clickAndWait = async (page, selector) => {
  const navigattion = page.waitForNavigation({waitUnitl: 'networkidle0'})
  await page.click(selector),
  await navigattion
}