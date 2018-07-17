import React from 'react'

import { Container, Title } from '../../styled-components/field'
import { Dropdown } from '../../../../../../../../views/components/Dropdown'

export function Select({ input, title, defaultOptions, defaultSelectedItem }) {
  return (
    <Container>
      <Title>{title}</Title>
      <Dropdown
        defaultSelectedItem={defaultSelectedItem}
        fullWidth
        input={input}
        items={defaultOptions.map(item => ({ title: item, value: item }))}
        itemToString={({ title }) => title}
        style={{ width: '100%' }}
      />
    </Container>
  )
}
