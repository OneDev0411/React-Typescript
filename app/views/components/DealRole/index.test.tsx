import React from 'react'
import { render } from 'enzyme'

import user from 'fixtures/users/agent'

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
})
