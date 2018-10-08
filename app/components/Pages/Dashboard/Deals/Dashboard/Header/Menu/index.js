import React from 'react'
import Flex from 'styled-flex-component'

import { CloseButton } from 'components/Button/CloseButton'
import { Divider } from '../../styled'

export function Menu() {
  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      <Divider />
      <CloseButton isFit iconSize="large" inverse />
    </Flex>
  )
}
