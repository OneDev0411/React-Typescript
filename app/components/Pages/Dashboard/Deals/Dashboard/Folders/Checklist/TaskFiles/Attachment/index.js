import React from 'react'
import Flex from 'styled-flex-component'
import fecha from 'fecha'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import EnvelopeView from '../../Envelope'
import ActionsButton from '../../../../../components/ActionsButton'

import FileLink from './FileLink'

import { FileContainer, FileRow, FileTitle, FileDate } from '../styled'

class Attachments extends React.Component {
  state = {
    isDeleting: false
  }

  render() {
    const { props, state } = this

    return (
      <FileContainer key={props.file.id} isBlur={state.isDeleting}>
        <FileRow>
          <Flex alignCenter justifyBetween>
            <Flex column>
              <FileTitle>
                <FileLink
                  file={props.file}
                  deal={props.deal}
                  taskId={props.task.id}
                  isBackOffice={props.isBackOffice}
                >
                  <TextMiddleTruncate text={props.file.name} maxLength={75} />
                </FileLink>
              </FileTitle>

              <FileDate>
                Uploaded at{' '}
                {fecha.format(
                  new Date(props.file.created_at * 1000),
                  'MMM DD YYYY, h:mm A'
                )}
              </FileDate>
            </Flex>

            <ActionsButton
              type="document"
              deal={this.props.deal}
              task={this.props.task}
              document={props.file}
            />
          </Flex>

          <Flex alignCenter>
            <EnvelopeView
              type="document"
              deal={props.deal}
              task={this.props.task}
              document={props.file}
            />
          </Flex>
        </FileRow>
      </FileContainer>
    )
  }
}

export default Attachments
