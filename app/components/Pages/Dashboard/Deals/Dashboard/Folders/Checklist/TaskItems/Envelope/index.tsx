import React from 'react'
import Flex from 'styled-flex-component'

import ActionsButton from '../../../../../components/ActionsButton'

import { ItemContainer, ItemRow, ItemTitle } from '../styled'

interface Props {
  deal: IDeal
  task: IDealTask
  envelope: IDealEnvelope
}

export function Envelope({ deal, task, envelope }: Props) {
  return (
    <ItemContainer>
      <ItemRow>
        <Flex alignCenter justifyBetween>
          <ItemTitle>{envelope.title}</ItemTitle>

          <ActionsButton
            type="document"
            deal={deal}
            task={task}
            document={task}
          />
        </Flex>

        <Flex alignCenter>
          --
          {/* <EnvelopeView type="task" deal={deal} task={task} /> */}
        </Flex>
      </ItemRow>
    </ItemContainer>
  )
}
