import React from 'react'
import Flex from 'styled-flex-component'

import { Menu } from './Menu'
import { Catalog } from './Catalog'

export function Header(props) {
  return (
    <Flex justifyBetween style={{ height: '88px', marginBottom: '2.5em' }}>
      <Catalog contact={props.contact} />
      <Menu contact={props.contact} />
    </Flex>
  )
}
