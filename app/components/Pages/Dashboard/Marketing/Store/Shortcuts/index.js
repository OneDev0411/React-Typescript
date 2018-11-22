import React from 'react'
import Flex from 'styled-flex-component'

import { H3 } from 'components/Typography/headings'

import { items } from './data'
import { Shortcut } from './Shortcut'

export function Shortcuts() {
  return (
    <div>
      <H3 style={{ padding: '1rem 0' }}>Select a Design</H3>
      <Flex justifyBetween>
        {items.map((item, index) => (
          <Shortcut key={index} item={item} />
        ))}
      </Flex>
    </div>
  )
}
