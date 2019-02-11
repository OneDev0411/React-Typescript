import React from 'react'

import Flex from 'styled-flex-component'

import ActionsButton from '../../../../../components/ActionsButton'

import { LabelItem } from '../../../styled'
import { FileContainer, FileRow, FileTitle, FileLink } from '../styled'

export function DigitalForm(props) {
  if (!props.task || !props.task.form) {
    return false
  }

  return (
    <FileContainer>
      <FileRow>
        <Flex alignCenter justifyBetween>
          <FileTitle>
            <FileLink
              size="small"
              className="file-link"
              to={`/dashboard/deals/${props.deal.id}/form-edit/${
                props.task.id
              }`}
            >
              {props.task.title}
            </FileLink>
          </FileTitle>

          <ActionsButton
            type="document"
            deal={props.deal}
            task={props.task}
            document={props.task}
          />
        </Flex>

        <Flex alignCenter>
          <LabelItem>Base Form</LabelItem>
        </Flex>
      </FileRow>
    </FileContainer>
  )
}
