import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal } from 'react-bootstrap'
import { batchActions } from 'redux-batched-actions'
import { browserHistory } from 'react-router'
import moment from 'moment'
import _ from 'underscore'
import cn from 'classnames'
import {
  showCompose,
  showAttachments,
  updateAttachments
} from '../../../../../../store_actions/deals'

class SelectDocumentModal extends React.Component {
  constructor(props) {
    super(props)
  }

  toggleSelectAttachment(task) {
    let newList = []
    const { esign, updateAttachments } = this.props
    const { attachments } = esign
    const index = attachments.indexOf(task.id)

    if (index === -1) {
      newList = [...attachments, task.id]
    } else {
      newList = attachments.filter(doc => doc !== task.id)
    }

    updateAttachments(newList)
  }

  onClose() {
    const { showAttachments } = this.props

    showAttachments(false)
  }

  onDone() {
    const { showAttachments, showCompose } = this.props

    batchActions([showCompose(true), showAttachments(false)])
  }

  getDocuments() {
    const { tasks, deal } = this.props

    return _.filter(
      tasks,
      task =>
        task.task_type === 'Form' &&
        task.deal === deal.id &&
        task.submission
    )
  }

  viewForm(e, task) {
    e.stopPropagation()

    const { deal } = this.props

    browserHistory.push(`/dashboard/deals/${deal.id}/form-viewer/${task.id}`)
  }

  render() {
    const { esign } = this.props
    const { attachments } = esign
    const documents = this.getDocuments()

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
            {_.size(documents) === 0 && (
              <div className="empty-state">
                <div className="title">Whoops!</div>
                <div className="descr">
                  You don't have any forms to collect signatures for
                </div>
              </div>
            )}

            {_.map(documents, task => {
              const isSelected = attachments.indexOf(task.id) > -1
              const isCompleted = task.submission.state === 'Fair'

              return (
                <Row
                  key={task.id}
                  className="item"
                  onClick={() => this.toggleSelectAttachment(task)}
                >
                  <Col sm={1} xs={2} className="vcenter">
                    <span className={cn('radio', { selected: isSelected })}>
                      {isSelected && <i className="fa fa-check" />}
                    </span>
                  </Col>

                  <Col sm={11} xs={10} className="name vcenter">
                    <div>
                      <span
                        className="file-name"
                        onClick={e => this.viewForm(e, task)}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="date">
                      {isCompleted && (
                        <span className="text-success">
                          Completed &nbsp;
                        </span>
                      )}

                      {!isCompleted && (
                        <span  className="text-danger">
                          May have incomplete fields &nbsp;
                        </span>
                      )}

                      {moment
                        .unix(task.submission.updated_at)
                        .format('MMMM DD, YYYY')}
                    </div>
                  </Col>
                </Row>
              )
            })}
          </div>
        </Modal.Body>

        {_.size(documents) > 0 && (
          <Modal.Footer>
            <span className="count">{attachments.length} doc selected</span>

            <button
              className={cn(
                'c-button--shadow modal-deal-esign-documents--submit',
                {
                  active: attachments.length >= 1
                }
              )}
              onClick={() => this.onDone()}
              disabled={attachments.length < 1}
            >
              {esign.showCompose ? 'Select' : 'Next'}
            </button>
          </Modal.Footer>
        )}
      </Modal>
    )
  }
}

export default connect(
  ({ deals }) => ({
    tasks: deals.tasks,
    esign: deals.esign || {}
  }),
  { showAttachments, showCompose, updateAttachments }
)(SelectDocumentModal)
