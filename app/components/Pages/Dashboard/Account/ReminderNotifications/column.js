import React from 'react'
import Flex, { FlexItem } from 'styled-flex-component'

import Item from './item'

export default function({ title, items, options, onChange }) {
  return (
    <Flex full column>
      <h3>{title}</h3>
      {items.map((item, index) => (
        <FlexItem key={index}>
          <Item {...item} options={options} onChange={onChange} />
        </FlexItem>
      ))}
    </Flex>
  )
}
