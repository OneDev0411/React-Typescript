import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { syncDeleteFile } from 'actions/deals'

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
      <Fragment>
        <FileContainer key={props.file.id} isBlur={state.isDeleting}>
          <FileRow>
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

            <div>
              <ActionsButton
                type="document"
                deal={this.props.deal}
                task={this.props.task}
                document={props.file}
              />
            </div>
          </FileRow>
        </FileContainer>
      </Fragment>
    )
  }
}

export default connect(
  null,
  { syncDeleteFile }
)(Attachments)
