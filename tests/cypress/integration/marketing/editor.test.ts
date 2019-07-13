import { chooseListing } from 'helpers/listing-drawer'

import { skipOnBoarding, customizeTemplate, cropAsset } from './helpers'

describe('Marketing center editor', () => {
  beforeEach(() => {
    cy.signin()
    cy.visit('/dashboard/marketing/JustListed/Email')
    skipOnBoarding()
  })

  it('User should be able to crop images', () => {
    customizeTemplate()
    chooseListing()
    cropAsset()
  })
})
