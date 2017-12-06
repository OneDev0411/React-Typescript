import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import { addNotification as notify } from 'reapop'
import TaskStatus from '../tasks/status'
import CheckBox from '../../components/radio'
import { bulkSubmit } from '../../../../../../store_actions/deals'

class BulkSubmit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      saving: false,
      selectedTasks: []
    }
  }

  toggleShowModal() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  toggleSelectTask(task) {
    const { selectedTasks } = this.state

    if (selectedTasks.indexOf(task.id) > -1) {
      return this.setState({
        selectedTasks: _.without(selectedTasks, task.id)
      })
    }

    return this.setState({
      selectedTasks: [
        ...selectedTasks,
        task.id
      ]
    })
  }

  async submit() {
    const { selectedTasks } = this.state
    const { deal, bulkSubmit, notify } = this.props

    const tasks = selectedTasks.map(id => ({
      id,
      needs_attention: true
    }))

    this.setState({ saving: true })
    await bulkSubmit(deal.id, tasks)

    notify({
      title: 'Tasks have submitted',
      message: `${selectedTasks.length} tasks submitted for review`,
      status: 'success'
    })

    this.setState({
      showModal: false,
      selectedTasks: [],
      saving: false
    })
  }

  render() {
    const { deal, tasks, checklists } = this.props
    const { showModal, selectedTasks, saving } = this.state

    return (
      <div className="inline">
        <button
          className="btn-deal"
          onClick={() => this.toggleShowModal()}
        >
          Submit
        </button>

        <Modal
          show={showModal}
          backdrop="static"
          onHide={() => this.toggleShowModal()}
          dialogClassName="modal-deal-bulk-submit"
        >
          <Modal.Header closeButton>
            Bulk Submit
          </Modal.Header>

          <Modal.Body>
            {
              _
              .chain(deal.checklists)
              .filter(id => !checklists[id].is_terminated)
              .map(id => {
                const checklist = checklists[id]
                const checklistTasks = checklist.tasks && checklist
                  .tasks
                  .filter(tId => tasks[tId].needs_attention !== true)

                return (
                  <div
                    key={id}
                    className="checklist"
                  >
                    <div className="ch-title">
                      { checklist.title }
                    </div>

                    {
                      checklistTasks.length === 0 &&
                      <div className="empty-state">
                        There is no unnotified task in this checklist
                      </div>
                    }

                    {
                      checklistTasks
                      .map(tId => {
                        const task = tasks[tId]
                        const hasStatus = task.review !== null || task.needs_attention === true

                        return (
                          <div
                            key={tId}
                            className={cn('task', { 'no-status': !hasStatus })}
                            onClick={() => this.toggleSelectTask(task)}
                          >
                            <div className="icon">
                              <CheckBox
                                selected={selectedTasks.indexOf(task.id) > -1}
                              />
                            </div>

                            <div className="title">
                              { task.title }
                            </div>

                            {
                              hasStatus &&
                              <TaskStatus
                                task={task}
                                noTip
                              />
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
              .value()
            }
          </Modal.Body>

          <Modal.Footer>
            {
              selectedTasks.length > 0 &&
              <span>{selectedTasks.length} task selected</span>
            }

            <Button
              disabled={selectedTasks.length === 0 || saving}
              className="deal-button"
              onClick={() => this.submit()}
            >
              { saving ? 'Saving ...' : 'Notify Admin' }
            </Button>

          </Modal.Footer>

        </Modal>
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  tasks: deals.tasks,
  checklists: deals.checklists
}), { bulkSubmit, notify })(BulkSubmit)
