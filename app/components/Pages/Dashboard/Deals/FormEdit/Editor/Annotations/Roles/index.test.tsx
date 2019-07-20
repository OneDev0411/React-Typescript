import React from 'react'
import { render } from 'enzyme'
import toJson from 'enzyme-to-json'

// eslint-disable-next-line import/no-unresolved
import deal from 'fixtures/deal/live-seller'

// eslint-disable-next-line import/no-unresolved
import form from 'fixtures/deal/forms/listing-agreement'

import { Roles } from '.'

describe('Deal Form: Roles Container', () => {
  it('renders the component', () => {
    const wrapper = render(
      <Roles
        deal={deal}
        roles={deal.roles}
        pageIndex={form.pageIndex}
        annotations={form.annotations}
        values={form.values}
      />
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
