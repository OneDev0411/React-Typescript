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
})
