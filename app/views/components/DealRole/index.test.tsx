import React from 'react'
import { render } from 'enzyme'

import user from 'fixtures/users/agent'
import deal from 'fixtures/deal/seller-with-offer'

import { DealRole } from '.'

describe('Test Deal Roles component', () => {
  it('Should show legal_names when role is Title', () => {
    const wrapper = render(
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
    const wrapper = render(
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

  it('Should show Office form when showBrokerageFields is true', () => {
    const wrapper = render(
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

  it.only('Should pre-populate office fields', () => {
    const sellerAgentRole = deal.roles.find(
      role => role.id === '7e104e10-89f3-11e9-8b7c-0a95998482ac'
    )

    const wrapper = render(
      <DealRole
        isOpen
        form={sellerAgentRole}
        user={user}
        showBrokerageFields
        onClose={() => {}}
        onUpsertRole={() => {}}
      />
    )

    expect(wrapper.find('[name="office_name"]').val()).toEqual('Briggs Freeman')

    expect(wrapper.find('[name="office_license_number"]').val()).toEqual(
      '1234567'
    )

    expect(wrapper.find('[name="office_mls_id"]').val()).toEqual('12344321')

    expect(wrapper.find('[name="office_email"]').val()).toEqual(
      'briggs@freeman.com'
    )
    expect(wrapper.find('[name="office_phone"]').val()).toEqual(
      '(972) 989-9701'
    )
    expect(wrapper.find('[name="office_fax"]').val()).toEqual('(972) 989-9702')
  })
})
