import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'

import Modal from '../../../../../../../views/components/BasicModal'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'

import Documents from './documents'
import {
  showCompose,
  showAttachments,
  addAttachment,
  removeAttachment
} from '../../../../../../../store_actions/deals'

class Attachments extends React.Component {
  onClose = () => this.props.showAttachments(false)

  onDone = () =>
    batchActions([
      this.props.showCompose(true),
      this.props.showAttachments(false)
    ])

  getTasks = () => {
    const list = []
    const { deal, checklists, tasks } = this.props

    if (!deal.checklists) {
      return list
    }

    deal.checklists.forEach(chId => {
      const checklist = checklists[chId]

      if (!checklist.tasks || checklist.is_terminated) {
        return false
      }

      checklist.tasks.forEach(tId => list.push(tasks[tId]))
    })

    return list
  }

  render() {
    const { esign, addAttachment, removeAttachment } = this.props
    const { attachments } = esign
    const tasks = this.getTasks()

    return (
      <Modal
        isOpen={esign.showAttachments === true}
        shouldCloseOnOverlayClick={false}
        handleOnClose={this.onClose}
        className="deal__esign-documents--modal"
      >
        <Modal.Header
          title="Select Documents"
          showClose
          handleOnClose={this.onClose}
        />

        <Modal.Body className="modal-body">
          <div className="documents">
            {tasks.map(task => (
              <Documents
                key={task.id}
                task={task}
                esign={esign}
                onAddAttachment={addAttachment}
                onRemoveAttachment={removeAttachment}
              />
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer>
          {tasks.length > 0 && (
            <Fragment>
              <span className="count">{attachments.length} doc selected</span>

              <ActionButton
                onClick={this.onDone}
                disabled={attachments.length < 1}
              >
                {esign.showCompose ? 'Select' : 'Next'}
              </ActionButton>
            </Fragment>
          )}
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connect(
  ({ deals }) => ({
    tasks: deals.tasks,
    checklists: deals.checklists,
    esign: deals.esign
  }),
  { showAttachments, showCompose, addAttachment, removeAttachment }
)(Attachments)
