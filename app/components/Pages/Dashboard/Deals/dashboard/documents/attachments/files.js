import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Row, Col, Dropdown, Button } from 'react-bootstrap'
import Lightbox from 'react-images'
import moment from 'moment'
import _ from 'underscore'
import { deleteAttachment } from '../../../../../../../store_actions/deals'
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

  openDoc(fileId) {
    const { deal, task } = this.props

    browserHistory.push(`/dashboard/deals/${deal.id}/form-viewer/${task.id}/attachment/${fileId}`)
  }

  async deleteFile(e, task, file) {
    const { deleteAttachment } = this.props
    const { deleting } = this.state

    e.stopPropagation()

    if (deleting) {
      return false
    }

    this.setState({
      deleting: true
    })

    try {
      await deleteAttachment(task, file.id)
    } catch (e) {}

    this.setState({
      deleting: false
    })
  }

  render() {
    const { attachments, deal, task } = this.props
    const { deleting } = this.state

    const files = attachments
      .filter(file => this.isPdf(file) || this.isImage(file))
      .map(file => ({
        id: file.id,
        name: file.name,
        type: this.isPdf(file) ? 'pdf' : 'image',
        preview_url: file.preview_url,
        src: file.url
      }))

    return (
      <div>
        {
          files.map((file, key) =>
            <div
              key={`PDF_FILE_${file.id}`}
              className="item attachment"
              style={{ cursor: 'pointer' }}
              onClick={() => this.openDoc(file.id)}
            >
              <div className="image">
                <img src={file.preview_url} />
              </div>
              <div className="name">
                <span className="link">
                  { file.name }
                </span>
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
                    <li
                      onClick={(e) => this.deleteFile(e, task, file)}
                    >
                      {
                        deleting ?
                          <span>
                            <i className="fa fa-spinner fa-spin" /> Deleting ...
                          </span> :
                          <span>Delete file</span>
                      }
                    </li>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

export default connect(null, { deleteAttachment })(FileAttachments)
