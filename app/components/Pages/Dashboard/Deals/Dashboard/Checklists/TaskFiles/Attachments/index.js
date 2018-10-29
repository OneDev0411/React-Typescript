import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { syncDeleteFile } from 'actions/deals'
import FileLink from './FileLink'

import { BasicDropdown } from 'components/BasicDropdown'
import VerticalDotsIcon from 'components/SvgIcons/MoreVert/IconMoreVert'

import {
  FileContainer,
  FileRow,
  FileTitle,
  FileActions,
  FileIcon
} from '../styled'

class Attachments extends React.Component {
  state = {
    isDeleting: false
  }

  menuItems = [
    {
      label: 'Delete',
      onClick: file => this.deleteFile(file)
    }
  ]

  isPdf = file => file.mime === 'application/pdf'
  isImage = file => file.mime.includes('image/')

  getFileType = file => {
    if (this.isPdf(file)) {
      return 'pdf'
    } else if (this.isImage(file)) {
      return 'image'
    }

    return 'unknown'
  }

  deleteFile = async file => {
    const { deal, syncDeleteFile } = this.props

    if (this.state.isDeleting) {
      return false
    }

    this.setState({
      isDeleting: true
    })

    try {
      await syncDeleteFile(deal.id, {
        [file.id]: this.props.task
      })
    } catch (e) {}

    this.setState({
      isDeleting: false
    })
  }

  get Files() {
    return this.props.attachments.map(file => ({
      id: file.id,
      name: file.name,
      type: this.getFileType(file),
      preview_url: file.preview_url,
      src: file.url
    }))
  }

  render() {
    const { deal, task, attachments } = this.props

    if (attachments.length === 0) {
      return false
    }

    return (
      <Fragment>
        {this.Files.map(file => (
          <FileContainer key={file.id} isBlur={this.state.isDeleting}>
            <FileRow>
              <FileTitle>
                <FileLink
                  isBackOffice={this.props.isBackOffice}
                  fileType={file.type}
                  externalUrl={file.src}
                  internalUrl={`/dashboard/deals/${deal.id}/view/${
                    task.id
                  }/attachment/${file.id}`}
                >
                  <FileIcon />
                  {file.name}
                </FileLink>
              </FileTitle>

              <FileActions>
                <BasicDropdown
                  pullTo="right"
                  style={{ marginRight: '-0.2rem' }}
                  buttonRenderer={props => <VerticalDotsIcon {...props} />}
                  items={this.menuItems}
                  onChange={item => item.onClick(file)}
                  buttonText="..."
                />
              </FileActions>
            </FileRow>
          </FileContainer>
        ))}
      </Fragment>
    )
  }
}

export default connect(
  null,
  { syncDeleteFile }
)(Attachments)
