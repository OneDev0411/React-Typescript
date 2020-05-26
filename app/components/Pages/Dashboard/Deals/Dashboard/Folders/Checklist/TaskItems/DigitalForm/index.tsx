import React from 'react'
import { useSelector } from 'react-redux'

import Flex from 'styled-flex-component'

import { IAppState } from 'reducers'
import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { getDocumentEnvelopes } from 'views/utils/deal-files/get-document-envelopes'

import ActionsButton from '../../../../../components/ActionsButton'

import { ItemContainer, ItemRow, ItemTitle, ItemLink } from '../styled'
import { LabelItem } from '../../../styled'

interface Props {
  deal: IDeal
  task: IDealTask
}

export function DigitalForm({ deal, task }: Props) {
  const envelopes = useSelector<IAppState, IDealEnvelope[]>(({ deals }) =>
    selectDealEnvelopes(deal, deals.envelopes)
  )

  const hasActiveEnvelope = () => {
    const documentEnvelopes = getDocumentEnvelopes(envelopes, task)

    if (
      documentEnvelopes.length === 0 ||
      documentEnvelopes[0].status === 'Voided'
    ) {
      return false
    }

    return true
  }

  if (!task || !task.form || hasActiveEnvelope()) {
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
          <LabelItem>Base Form</LabelItem>
        </Flex>
      </ItemRow>
    </ItemContainer>
  )
}
