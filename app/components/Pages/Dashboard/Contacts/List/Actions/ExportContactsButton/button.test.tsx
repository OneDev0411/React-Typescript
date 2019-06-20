import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { DOWNLOAD_TYPES_DROPDOWN_ITEMS } from './constants'
import ExportButton from './button'

describe('ExportContactsButton inner button component', () => {
  it('renders', () => {
    const wrapper = shallow(
      <ExportButton disabled={false} onExportClick={() => null} />
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders with proper items prop', () => {
    const wrapper = shallow(
      <ExportButton disabled={false} onExportClick={() => null} />
    )

    expect(wrapper.prop('items')).toBe(DOWNLOAD_TYPES_DROPDOWN_ITEMS)
  })
})
