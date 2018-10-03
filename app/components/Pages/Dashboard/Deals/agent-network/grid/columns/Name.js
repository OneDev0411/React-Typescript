import React from 'react'
import Flex from 'styled-flex-component'

import Avatar from '../../../../../../../views/components/Avatar'

export const Name = ({ name }) => (
  <Flex nowrap>
    <Avatar title={name} />
    <div
      style={{
        padding: 0,
        marginLeft: '1em',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      {name}
    </div>
  </Flex>
)
