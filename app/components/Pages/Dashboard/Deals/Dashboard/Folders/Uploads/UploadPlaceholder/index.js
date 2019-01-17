import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import copy from 'utils/copy-text-to-clipboard'

import UploadManager from '../../../../UploadManager'
import { Container, ItemLink } from './styled'

export class UploadPlaceholder extends React.Component {
  handleCopyEmail = () => {
    copy(this.props.deal.email)
    this.props.notify({
      message: 'Link Copied',
      status: 'success'
    })
  }

  handleSelectFile = () => {
    this.dropzone && this.dropzone.open()
  }

  handleDropzoneRef = ref => {
    this.dropzone = ref
  }

  render() {
    return (
      <UploadManager
        deal={this.props.deal}
        disableClick
        onRef={this.handleDropzoneRef}
      >
        <Container>
          Drag & drop,
          <ItemLink onClick={this.handleSelectFile}>Upload</ItemLink>
          or email files to
          <ItemLink onClick={this.handleCopyEmail}>
            {this.props.deal.email}
          </ItemLink>
        </Container>
      </UploadManager>
    )
  }
}

export default connect(
  null,
  { notify }
)(UploadPlaceholder)
