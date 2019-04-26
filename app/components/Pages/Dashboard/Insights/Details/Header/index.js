import React from 'react'
import Flex from 'styled-flex-component'

import Menu from './Menu'
import { H1 } from '../../../../../../views/components/Typography/headings'

Header.defaultProps = {
  title: ''
}
function Header(props) {
  return (
    <Flex justifyBetween style={{ padding: '1.5em 2.5em' }}>
      <Flex>
        <Flex column style={{ padding: '0.5em 1.5em' }}>
          <H1 style={{ lineHeight: 1.5 }}>
            {props.title.trim() || 'No Title'}
          </H1>
        </Flex>
      </Flex>
      <Menu backUrl={props.backUrl} closeButtonQuery={props.closeButtonQuery} />
    </Flex>
  )
}

export default Header
