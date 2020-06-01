import React from 'react'
import Flex from 'styled-flex-component'

import ActionsButton from '../../../../../components/ActionsButton'

import { ItemContainer, ItemRow, ItemTitle, ItemLink } from '../styled'
import { LabelItem } from '../../../styled'

import getFormActions from './get-form-actions'

interface Props {
  deal: IDeal
  task: IDealTask
}

export function DigitalForm({ deal, task }: Props) {
  if (!task || !task.form) {
    return null
  }

  const actions: ActionButtonId[] = getFormActions(task)

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

          <ActionsButton deal={deal} task={task} actions={actions} />
        </Flex>

        <Flex alignCenter>
          <LabelItem>Digital Form</LabelItem>
        </Flex>
      </ItemRow>
    </ItemContainer>
  )
}
