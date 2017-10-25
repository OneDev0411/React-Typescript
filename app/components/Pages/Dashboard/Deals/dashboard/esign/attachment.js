import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import moment from 'moment'
import _ from 'underscore'
import cn from 'classnames'
import extractDocumentOfTask from '../../utils/extract-document-of-task'
import { closeAttachments, setFormViewer, updateAttachments } from '../../../../../../store_actions/deals'

class SelectDocumentModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      attachments: []
    }
  }

  componentWillReceiveProps(nextProps) {
    const { esign } = nextProps

    if (esign.showAttachments) {
      this.setState({ attachments: esign.attachments })
    }
  }

  toggleSelectAttachment(task) {
    const { attachments } = this.state
    let newList = []
    const index = attachments.indexOf(task.id)

    if (index === -1) {
      newList = [
        ...attachments,
        task.id
      ]
    } else {
      newList = attachments.filter(doc => doc !== task.id)
    }

    this.setState({
      attachments: newList
    })
  }

  onClose() {
    this.setState({
      attachments: []
    }, this.props.closeAttachments)
  }

  onDone(attachments) {
    this.props.updateAttachments(attachments)
  }

  getCompletedDocuments() {
    const { tasks, deal } = this.props

    return _.filter(tasks, task =>
      task.task_type === 'Form' &&
      task.deal === deal.id &&
      task.submission &&
      task.submission.state === 'Fair'
    )
  }

  viewForm(e, task) {
    e.stopPropagation()

    const { deal, setFormViewer } = this.props
    const file = extractDocumentOfTask(deal, task)
    setFormViewer(task, file)
  }

  render() {
    const { attachments } = this.state
    const { tasks, esign } = this.props
    const documents = this.getCompletedDocuments()

    return (
      <Modal
        show={esign.showAttachments === true}
        onHide={() => this.onClose()}
        dialogClassName="modal-deal-esign-documents"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Documents</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="documents">
            {
              _.size(documents) === 0 &&
              <div className="empty-state">
                <div className="title">Whoops!</div>
                <div className="descr">You don't have any completed forms to send for signatures.</div>
              </div>
            }

            {
              _.map(documents, task => {
                const isSelected = attachments.indexOf(task.id) > -1

                return (
                  <Row
                    key={task.id}
                    className="item"
                    onClick={() => this.toggleSelectAttachment(task)}
                  >
                    <Col sm={1} xs={2} className="vcenter">
                      <span
                        className={cn('radio', { selected: isSelected })}
                      >
                        { isSelected && <i className="fa fa-check" /> }
                      </span>
                    </Col>

                    <Col sm={10} xs={9} className="name vcenter">
                      <div>{ task.title }</div>
                      <div className="date">
                        Completed {moment.unix(task.submission.updated_at).format('MMMM DD, YYYY')}
                      </div>
                    </Col>

                    <Col
                      sm={1}
                      xs={1}
                      className="vcenter"
                      onClick={(e) => this.viewForm(e, task)}
                    >
                      <i className="fa fa-eye" />
                    </Col>
                  </Row>
                )
              })
            }
          </div>
        </Modal.Body>

        {
          _.size(documents) > 0 &&
          <Modal.Footer>
            <span className="count">
              { attachments.length } doc selected
            </span>

            <Button
              className="deal-button"
              onClick={() => this.onDone(attachments)}
              disabled={attachments.length < 1}
            >
              {esign.showCompose ? 'Select' : 'Next'}
            </Button>
          </Modal.Footer>
        }
      </Modal>
    )
  }
}

export default connect(({ deals }) => ({
  tasks: deals.tasks,
  esign: deals.esign || {}
}), { closeAttachments, updateAttachments, setFormViewer })(SelectDocumentModal)
