import { acceptConfirmationModal } from 'helpers/modal'

describe('Profile settings', () => {
  beforeEach(() => {
    cy.sandbox()
    cy.signin()
    cy.visit('/dashboard/account')
  })

  it('Should load profile settings page', () => {
    cy.waitForPage('/dashboard/account')
    cy.get('.c-account__form').should('exist')
  })

  it('User is able to upload avatar', () => {
    cy.getByTestSelector('profile-avatar-upload-button').click()

    const fileName = 'avatar.png'

    cy.fixture(fileName).then(fileContent => {
      cy.getByTestSelector('image-uploader-modal-dropzone').upload(
        { fileContent, fileName, mimeType: 'image/png' },
        { subjectType: 'drag-n-drop' }
      )
    })
    cy.getByTestSelector('image-uploader-modal-save-button').click()

    cy.getByTestSelector('profile-avatar-delete-button').should('exist')
    cy.getByTestSelector('profile-avatar-image').should('exist')
  })

  it('User is able to delete avatar', () => {
    cy.getByTestSelector('profile-avatar-delete-button').click()
    acceptConfirmationModal()
    cy.waitForRemove('profile-avatar-delete-button')
  })

  it('User is able to update personal info', () => {
    const firstName = `Test_${new Date().getTime()}`
    const lastName = `Agent_${new Date().getTime()}`

    cy.get('#first_name').type(firstName)
    cy.get('#last_name').type(lastName)

    cy.getByTestSelector('personal-info-form-submit-button').click()
    cy.getByTestSelector('personal-info-form-submit-button').should(
      'be.disabled'
    )
    cy.pageShouldContain('Your Information updated.')
    cy.get('#first_name').should('have.value', firstName)
    cy.get('#last_name').should('have.value', lastName)
  })

  it('User is able to update time zone', () => {
    cy.get('[name="time_zone"]').click()

    cy.getByTestSelector('timezone-dropdown').within(() => {
      cy.get('input')
        .clear()
        .type('GMT{downarrow}{enter}')
    })

    cy.getByTestSelector('timezone-form-submit-button').click()
    cy.get('[name="time_zone"]').should('have.text', 'GMT')
    cy.pageShouldContain('Timezone updated to GMT.')
  })
})
