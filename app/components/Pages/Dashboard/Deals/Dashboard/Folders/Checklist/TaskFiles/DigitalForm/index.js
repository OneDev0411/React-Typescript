import React from 'react'

import ActionsButton from '../../../../../components/ActionsButton'

import {
  FileContainer,
  FileRow,
  FileTitle,
  FileActions,
  DigitalFormIcon,
  FileLink
} from '../styled'

export function DigitalForm(props) {
  if (!props.task || !props.task.form) {
    return false
  }

  return (
    <FileContainer>
      <FileRow>
        <FileTitle>
          <FileLink
            size="small"
            className="file-link"
            to={`/dashboard/deals/${props.deal.id}/form-edit/${props.task.id}`}
          >
            <DigitalFormIcon />
            {props.task.title}
          </FileLink>
        </FileTitle>

        <ActionsButton
          type="document"
          deal={props.deal}
          task={props.task}
          document={props.task}
        />
      </FileRow>
    </FileContainer>
  )
}
