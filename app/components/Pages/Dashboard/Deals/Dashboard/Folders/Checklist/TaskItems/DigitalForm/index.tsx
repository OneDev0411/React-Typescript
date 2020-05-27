import React from 'react'
import Flex from 'styled-flex-component'

import ActionsButton from '../../../../../components/ActionsButton'

import { ItemContainer, ItemRow, ItemTitle, ItemLink } from '../styled'
import { LabelItem } from '../../../styled'

interface Props {
  deal: IDeal
  task: IDealTask
}

export function DigitalForm({ deal, task }: Props) {
  if (!task || !task.form) {
    return null
  }

  return (
    <ItemContainer>
      <ItemRow>
        <Flex alignCenter justifyBetween>
          <ItemTitle>
            <ItemLink
              className="file-link"
              to={`/dashboard/deals/${deal.id}/form-edit/${task.id}`}
            >
              {task.title}
            </ItemLink>
          </ItemTitle>

          <ActionsButton
            type="document"
            deal={deal}
            task={task}
            document={task}
          />
        </Flex>

        <Flex alignCenter>
          <LabelItem>Digital Form</LabelItem>
        </Flex>
      </ItemRow>
    </ItemContainer>
  )
}
