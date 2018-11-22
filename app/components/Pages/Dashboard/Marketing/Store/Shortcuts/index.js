import React from 'react'
import Flex from 'styled-flex-component'

import { H3 } from 'components/Typography/headings'

import { items } from './data'
import { Shortcut } from './Shortcut'

export function Shortcuts() {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <H3 style={{ padding: '1rem 0' }}>Select a Design</H3>
      <Flex wrap>
        {items.map((item, index) => (
          <Shortcut key={index} item={item} />
        ))}
      </Flex>
    </div>
  )
}
