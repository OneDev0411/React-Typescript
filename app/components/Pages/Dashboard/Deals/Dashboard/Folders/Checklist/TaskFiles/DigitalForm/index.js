import React, { Fragment } from 'react'

import LinkButton from 'components/Button/LinkButton'

import ActionsButton from '../../../../../components/ActionsButton'

import GetSignature from '../../../../../Signature'

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

        <FileActions>
          <ActionsButton type="task" deal={props.deal} task={props.task} />
        </FileActions>
      </FileRow>
    </FileContainer>
  )
}
