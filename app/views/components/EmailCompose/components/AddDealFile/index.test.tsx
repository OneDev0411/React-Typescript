import { render } from '@testing-library/react'
import * as React from 'react'

import { AddDealFile } from '.'

describe('AddDealFile component', () => {
  // https://gitlab.com/rechat/web/issues/2963
  it('renders', () => {
    const container = render(<AddDealFile />)

    expect(container).toMatchSnapshot()
  })
})
