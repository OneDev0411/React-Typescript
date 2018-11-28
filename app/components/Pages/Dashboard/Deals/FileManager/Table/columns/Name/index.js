import React, { Fragment } from 'react'
import moment from 'moment'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { FileNameLink, Details } from './styled'

function getEnvelopeStatus(envelope) {
  const areSigned = envelope.recipients.filter(r => r.status === 'Completed')

  return `${areSigned.length} of ${envelope.recipients.length} signed`
}

export function FileName(props) {
  const { envelope } = props.file

  return (
    <Fragment>
      <FileNameLink to={props.link}>
        <TextMiddleTruncate text={props.file.name} maxLength={60} />
      </FileNameLink>

      <Details>
        <div>
          {props.file.created_at &&
            moment.unix(props.file.created_at).format('MMM DD, YY hh:mm A')}
        </div>

        {envelope && (
          <Fragment>
            <div>
              <TextMiddleTruncate
                text={envelope.title}
                maxLength={20}
                style={{
                  display: 'inline-block',
                  margin: '0 0.5rem'
                }}
              />
            </div>

            <div>{getEnvelopeStatus(envelope)}</div>
          </Fragment>
        )}
      </Details>
    </Fragment>
  )
}
