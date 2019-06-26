import { getTestSelector } from 'helpers/page'
import { waitForModalToClose } from 'helpers/modal'

export function skipOnBoarding() {
  if (Cypress.$(getTestSelector('finish-skip-onboarding')).length > 0) {
    return cy.getByTestSelector('finish-skip-onboarding').click()
  }
}

export function customizeTemplate(index: number = 0) {
  return cy
    .getByTestSelector('marketing-customize-button')
    .eq(index)
    .click({ force: true })
}

export function cropAsset(index: number = 0) {
  // GrapesJS throws an error complaining about an error during appendChild fn call
  cy.on('uncaught:exception', () => false)
  cy.getByTestSelector('crop-button', { timeout: 10000 })
    .eq(index)
    .click({ force: true })
  cy.getByTestSelector('crop-zoom-slider').click('center')

  // TODO: Fix issue of not passing templateId to Grapesjs storage and AssetImage
  // cy.getByTestSelector('image-uploader-modal-save-button').click()

  cy.getByTestSelector('close-modal').click()

  return waitForModalToClose()
}
