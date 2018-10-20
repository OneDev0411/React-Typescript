import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { setUploadFiles } from '../../../../../store_actions/deals'
import Deal from '../../../../../models/Deal'
import DealEmail from '../dashboard/deal-email'
import PageHeader from '../../../../../views/components/PageHeader'
import ActionButton from '../../../../../views/components/Button/ActionButton'

export class Header extends React.Component {
  openUploadDialog = () => this.dropzone.open()
  onDrop = files => this.props.setUploadFiles(files, null)

  render() {
    const { deal } = this.props

    return (
      <PageHeader title="Files" backUrl={`/dashboard/deals/${deal.id}`}>
        <PageHeader.Menu>
          <DealEmail dealEmail={deal.email} />
          <ActionButton
            appearance="outline"
            onClick={() => this.openUploadDialog()}
            style={{ marginLeft: '10px' }}
          >
            Upload
          </ActionButton>
        </PageHeader.Menu>

        <Dropzone
          disableClick
          ref={node => (this.dropzone = node)}
          onDrop={files => this.onDrop(files)}
          multiple
          accept={Deal.upload.getAcceptedDocuments()}
          style={{ display: 'none' }}
        />
      </PageHeader>
    )
  }
}

export default connect(
  null,
  {
    setUploadFiles
  }
)(Header)
