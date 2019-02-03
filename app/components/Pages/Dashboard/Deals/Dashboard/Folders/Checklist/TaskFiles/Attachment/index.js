import React from 'react'
import { connect } from 'react-redux'

import Flex from 'styled-flex-component'

import { syncDeleteFile } from 'actions/deals'

import EnvelopeView from '../../Envelope'
import ActionsButton from '../../../../../components/ActionsButton'

import FileLink from './FileLink'

import { FileContainer, FileRow, FileTitle } from '../styled'

class Attachments extends React.Component {
  state = {
    isDeleting: false
  }

  getFileType = file => {
    if (file.mime === 'application/pdf') {
      return 'pdf'
    }

    if (file.mime.includes('image/')) {
      return 'image'
    }

    return 'unknown'
  }

  render() {
    const { props, state } = this

    return (
      <FileContainer key={props.file.id} isBlur={state.isDeleting}>
        <FileRow>
          <Flex alignCenter justifyBetween>
            <FileTitle>
              <FileLink
                isBackOffice={props.isBackOffice}
                fileType={this.getFileType(props.file)}
                externalUrl={props.file.url}
                internalUrl={`/dashboard/deals/${props.deal.id}/view/${
                  props.task.id
                }/attachment/${props.file.id}`}
              >
                {props.file.name}
              </FileLink>
            </FileTitle>

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
              document={props.file}
            />
          </Flex>
        </FileRow>
      </FileContainer>
    )
  }
}

export default connect(
  null,
  { syncDeleteFile }
)(Attachments)
