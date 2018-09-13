import React from 'react'
import { connect } from 'react-redux'
import { Dropdown } from 'react-bootstrap'
import { syncDeleteFile } from '../../../../../../../store_actions/deals'
import VerticalDotsIcon from '../../../../Partials/Svgs/VerticalDots'
import FileLink from './link'
import IconButton from 'components/Button/IconButton'

/**
 * render pdf attachments
 */
class FileAttachments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deleting: false
    }
  }

  isPdf(file) {
    return file.mime === 'application/pdf'
  }

  isImage(file) {
    return file.mime.includes('image/')
  }

  getFileType(file) {
    if (this.isPdf(file)) {
      return 'pdf'
    } else if (this.isImage(file)) {
      return 'image'
    }

    return 'unknown'
  }

  async deleteFile(e, task, file) {
    const { deal, syncDeleteFile } = this.props
    const { deleting } = this.state

    e.preventDefault()

    if (deleting) {
      return false
    }

    this.setState({
      deleting: true
    })

    try {
      await syncDeleteFile(deal.id, {
        [file.id]: task
      })
    } catch (e) {}

    this.setState({
      deleting: false
    })
  }

  render() {
    const { attachments, deal, task } = this.props
    const { deleting } = this.state

    const files = attachments.map(file => ({
      id: file.id,
      name: file.name,
      type: this.getFileType(file),
      preview_url: file.preview_url,
      src: file.url
    }))

    return (
      <div>
        {files.map(file => (
          <FileLink
            key={`PDF_FILE_${file.id}`}
            fileType={file.type}
            externalUrl={file.src}
            internalUrl={`/dashboard/deals/${deal.id}/form-viewer/${
              task.id
            }/attachment/${file.id}`}
          >
            <div className="image">
              <img src={file.preview_url} alt="" />
            </div>
            <div className="name">
              <span className="link">{file.name}</span>
            </div>

            <div className="actions">
              <Dropdown
                id={`ATTACHMENTS_CTA_${file.id}`}
                className="deal-file-cta-menu"
                pullRight
              >
                <IconButton
                  onClick={e => e.preventDefault()}
                  inverse
                  bsRole="toggle"
                >
                  <VerticalDotsIcon fill="#D7DEE2" />
                </IconButton>

                <Dropdown.Menu>
                  <li onClick={e => this.deleteFile(e, task, file)}>
                    {deleting ? (
                      <span>
                        <i className="fa fa-spinner fa-spin" /> Deleting ...
                      </span>
                    ) : (
                      <span>Delete file</span>
                    )}
                  </li>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </FileLink>
        ))}
      </div>
    )
  }
}

export default connect(
  null,
  { syncDeleteFile }
)(FileAttachments)
