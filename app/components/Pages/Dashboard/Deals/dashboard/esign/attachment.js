import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import moment from 'moment'
import _ from 'underscore'
import cn from 'classnames'
import { closeEsign, updateAttachments } from '../../../../../../store_actions/deals'

class SelectDocumentModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      attachments: []
    }
  }

  componentWillReceiveProps(nextProps) {
    const { esign } = nextProps

    if (esign.show && esign.view === 'attachment') {
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
    }, this.props.closeEsign)
  }

  onDone(attachments) {
    this.props.updateAttachments(attachments)
  }

  shouldDisplay() {
    const { esign} = this.props

    if (esign.show && esign.view === 'attachment') {
      return true
    }

    return false
  }

  render() {
    const { attachments } = this.state
    const { tasks, dealId } = this.props

    return (
      <Modal
        show={this.shouldDisplay()}
        onHide={() => this.onClose()}
        dialogClassName="modal-deal-esign-documents"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Documents</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="documents">
            {
              _
              .chain(tasks)
              .filter(task => {
                return task.task_type === 'Form' &&
                  task.deal === dealId &&
                  task.submission
                  task.submission.state === 'Fair'
              })
              .map(task => {
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

                    <Col sm={11} xs={10} className="name vcenter">
                      <div>{ task.title }</div>
                      <div className="date">
                        Completed {moment.unix(task.submission.updated_at).format('MMMM DD, YYYY')}
                      </div>
                    </Col>
                  </Row>
                )
              })
              .value()
            }
          </div>
        </Modal.Body>

        <Modal.Footer>
          <span className="count">
            { attachments.length } doc selected
          </span>

          <Button
            className="deal-button"
            onClick={() => this.onDone(attachments)}
            disabled={attachments.length < 1}
          >
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connect(({ deals }) => ({
  tasks: deals.tasks,
  esign: deals.esign || {}
}), { closeEsign, updateAttachments })(SelectDocumentModal)
