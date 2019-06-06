import React from 'react'
import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'

import { IconCheck } from './styled'

interface Props {
  onDisconnect: () => Promise<void>
}

export default function Disconnect({ onDisconnect }: Props) {
  return (
    <>
      <Flex>
        <IconCheck size="64" />
      </Flex>
      <Flex>
        <h4>Your CSS account is connected!</h4>
      </Flex>
      <hr style={{ width: '100%' }} />
      <Flex rowReverse>
        <ActionButton onClick={onDisconnect}>Disconnect</ActionButton>
      </Flex>
    </>
  )
}
