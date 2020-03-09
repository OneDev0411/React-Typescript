import React from 'react'
import Flex from 'styled-flex-component'

import { CloseButton } from 'components/Button/CloseButton'

function Menu(props) {
  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      <CloseButton
        isFit
        inverse
        defaultBackUrl="/dashboard/contacts"
        backUrl={props.backUrl}
        query={props.closeButtonQuery}
      />
    </Flex>
  )
}

export default Menu
