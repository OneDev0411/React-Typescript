import { render } from '@testing-library/react'

import * as React from 'react'

import { recipient } from 'fixtures/contacts/contact-item'

import ContactItem from '.'

describe('ContactItem', () => {
  it('should render', () => {
    render(<ContactItem recipient={recipient} />)
  })

  it('should render email as well as contact name', () => {
    const { container } = render(<ContactItem recipient={recipient} />)

    expect(container.textContent).toContain('alireza.mirian@gmail.com')
    expect(container.textContent).toContain('Nasser Hassani')
  })
})
