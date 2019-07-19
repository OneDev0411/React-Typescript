import * as React from 'react'
import { render } from '@testing-library/react'

import { Menu } from './'

describe('MC Menu', () => {
  it('renders list of templates type', () => {
    const container = render(<Menu />)

    expect(container).toMatchSnapshot()
  })
})
