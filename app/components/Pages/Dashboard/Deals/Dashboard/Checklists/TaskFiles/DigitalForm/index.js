import React, { Fragment } from 'react'

import LinkButton from 'components/Button/LinkButton'

import GetSignature from '../../../../Signature'

import {
  FileContainer,
  FileRow,
  FileTitle,
  FileActions,
  DigitalFormIcon,
  FileLink
} from '../styled'

export default function DigitalForm({ deal, task, isBackOffice }) {
  if (!task || !task.form) {
    return false
  }

  return (
    <FileContainer>
      <FileRow>
        <FileTitle>
          <FileLink
            size="small"
            className="file-link"
            to={`/dashboard/deals/${deal.id}/form-edit/${task.id}`}
          >
            <DigitalFormIcon />
            {task.title}
          </FileLink>
        </FileTitle>

        <FileActions>
          {task.submission && (
            <Fragment>
              {isBackOffice ? (
                <LinkButton
                  appearance="outline"
                  size="small"
                  to={`/dashboard/deals/${deal.id}/view/${task.id}`}
                >
                  View
                </LinkButton>
              ) : (
                <LinkButton
                  appearance="outline"
                  size="small"
                  href={task.submission.file.url}
                  target="_blank"
                >
                  View
                </LinkButton>
              )}
            </Fragment>
          )}

          <LinkButton
            appearance="outline"
            size="small"
            to={`/dashboard/deals/${deal.id}/form-edit/${task.id}`}
            style={{ marginLeft: '0.5rem' }}
          >
            Edit
          </LinkButton>

          {task.submission && (
            <GetSignature
              deal={deal}
              defaultAttachments={[
                {
                  type: 'form',
                  task
                }
              ]}
            />
          )}
        </FileActions>
      </FileRow>
    </FileContainer>
  )
}
