import React from 'react'

import user from 'fixtures/users/agent.json'
import deal from 'fixtures/deal/seller-with-offer.json'

import { renderWithThemeEnzyme } from '../../../../tests/unit/utils/render-with-theme'

import { DealRole } from '.'

describe('Test Deal Roles component', () => {
  it('Should show legal_names when role is Title', () => {
    const wrapper = renderWithThemeEnzyme(
      <DealRole
        isOpen
        form={{}}
        user={user}
        dealSide="Buyer"
        allowedRoles={['Title']}
        onClose={() => {}}
        onUpsertRole={() => {}}
      />
    )

    expect(wrapper.find('[name="legal_first_name"]')).toHaveLength(1)
    expect(wrapper.find('[name="legal_last_name"]')).toHaveLength(1)
  })

  it('Should render Office form', () => {
    const wrapper = renderWithThemeEnzyme(
      <DealRole
        isOpen
        form={{}}
        user={user}
        showBrokerageFields
        onClose={() => {}}
        onUpsertRole={() => {}}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('Should render Agent form', () => {
    const wrapper = renderWithThemeEnzyme(
      <DealRole
        isOpen
        form={{}}
        user={user}
        onClose={() => {}}
        onUpsertRole={() => {}}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('Should render Agent form with searchable company field', () => {
    const wrapper = renderWithThemeEnzyme(
      <DealRole
        isOpen
        allowedRoles={['Seller']}
        form={{}}
        user={user}
        onClose={() => {}}
        onUpsertRole={() => {}}
      />
    )

    expect(wrapper.find('[name="company_title"]')).toHaveLength(1)
    expect(
      wrapper.find('[name="company_title"]').prop('autocomplete')
    ).toBeDefined()
  })

  it('Should show Office form when showBrokerageFields is true', () => {
    const wrapper = renderWithThemeEnzyme(
      <DealRole
        isOpen
        form={{}}
        user={user}
        showBrokerageFields
        onClose={() => {}}
        onUpsertRole={() => {}}
      />
    )

    expect(wrapper.find('[name="office_name"]')).toHaveLength(1)
    expect(wrapper.find('[name="office_license_number"]')).toHaveLength(1)
    expect(wrapper.find('[name="office_mls_id"]')).toHaveLength(1)
    expect(wrapper.find('[name="office_email"]')).toHaveLength(1)
    expect(wrapper.find('[name="office_phone"]')).toHaveLength(1)
    expect(wrapper.find('[name="office_fax"]')).toHaveLength(1)
    expect(wrapper.find('[name="office_address"]')).toHaveLength(1)
  })

  it('Should pre-populate office fields', () => {
    const sellerAgentRole = deal.roles.find(
      role => role.id === '7e104e10-89f3-11e9-8b7c-0a95998482ac'
    ) as IDealRole

    const office = sellerAgentRole.agent!.office

    const wrapper = renderWithThemeEnzyme(
      <DealRole
        isOpen
        form={sellerAgentRole}
        user={user}
        showBrokerageFields
        onClose={() => {}}
        onUpsertRole={() => {}}
      />
    )

    expect(wrapper.find('[name="office_name"]').val()).toEqual(office!.name)
    expect(wrapper.find('[name="office_mls_id"]').val()).toEqual(office!.mls_id)
    expect(wrapper.find('[name="office_email"]').val()).toEqual(office!.email)
    expect(wrapper.find('[name="office_phone"]').val()).toEqual(office!.phone)
    expect(wrapper.find('[name="office_fax"]').val()).toEqual(office!.fax)
    expect(wrapper.find('[name="office_license_number"]').val()).toEqual(
      office!.license_number
    )
  })
})
