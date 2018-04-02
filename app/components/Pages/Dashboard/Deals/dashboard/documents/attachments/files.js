import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Dropdown, Button } from 'react-bootstrap'
import _ from 'underscore'
import { deleteFile } from '../../../../../../../store_actions/deals'
import VerticalDotsIcon from '../../../../Partials/Svgs/VerticalDots'

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
    const { deal, deleteFile } = this.props
    const { deleting } = this.state

    e.stopPropagation()

    if (deleting) {
      return false
    }

    this.setState({
      deleting: true
    })

    try {
      await deleteFile(deal.id, {
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
          <Link
            key={`PDF_FILE_${file.id}`}
            className="item attachment"
            style={{ cursor: 'pointer' }}
            to={`/dashboard/deals/${deal.id}/form-viewer/${
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
                <Button
                  onClick={e => e.stopPropagation()}
                  className="cta-btn btn-link"
                  bsRole="toggle"
                >
                  <VerticalDotsIcon fill="#D7DEE2" />
                </Button>

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
          </Link>
        ))}
      </div>
    )
  }
}

export default connect(null, { deleteFile })(FileAttachments)
