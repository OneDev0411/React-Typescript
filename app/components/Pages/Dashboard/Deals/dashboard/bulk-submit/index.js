import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import { addNotification as notify } from 'reapop'
import TaskStatus from '../tasks/status'
import CheckBox from '../../components/radio'
import Alert from '../../../Partials/Alert'
import { bulkSubmit, updatesTasks } from '../../../../../../store_actions/deals'

class BulkSubmit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      saving: false,
      isFailed: false,
      selectedTasks: []
    }

    this.toggleShowModal = this.toggleShowModal.bind(this)
  }

  toggleShowModal() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  toggleSelectTask(task) {
    const { selectedTasks } = this.state

    if (task.needs_attention === true) {
      return false
    }

    if (selectedTasks.indexOf(task.id) > -1) {
      return this.setState({
        selectedTasks: _.without(selectedTasks, task.id)
      })
    }

    return this.setState({
      selectedTasks: [...selectedTasks, task.id]
    })
  }

  async submit() {
    const { selectedTasks } = this.state
    const {
      deal, bulkSubmit, notify, updatesTasks
    } = this.props

    const tasks = selectedTasks.map(id => ({
      id,
      needs_attention: true
    }))

    this.setState({ saving: true, isFailed: false })

    const updatedTasks = await bulkSubmit(deal.id, tasks)

    if (updatedTasks) {
      updatesTasks(updatedTasks)

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
    } else {
      this.setState({
        isFailed: true,
        saving: false
      })
    }
  }

  render() {
    const { deal, tasks, checklists } = this.props
    const {
      showModal, selectedTasks, saving, isFailed
    } = this.state

    return (
      <div className="inline">
        <button className="navbar-button btn-deal" onClick={this.toggleShowModal}>
          Submit
        </button>

        <Modal
          show={showModal}
          backdrop="static"
          onHide={this.toggleShowModal}
          dialogClassName="c-deal-bulk-submit-modal"
        >
          <Modal.Header closeButton>Bulk Submit</Modal.Header>

          <Modal.Body>
            {_.chain(deal.checklists)
              .filter(id => !checklists[id].is_terminated && !checklists[id].is_deactivated)
              .map(id => {
                const checklist = checklists[id]

                return (
                  <div key={id} className="checklist">
                    <div className="ch-title">{checklist.title}</div>

                    {(checklist.tasks || []).map(tId => {
                      const task = tasks[tId]
                      const hasStatus =
                        task.review !== null || task.needs_attention === true

                      return (
                        <div
                          key={tId}
                          className={cn('task', {
                            disabled: task.needs_attention === true
                          })}
                          onClick={() => this.toggleSelectTask(task)}
                        >
                          <div className="icon">
                            {task.needs_attention !== true && (
                              <CheckBox
                                selected={selectedTasks.indexOf(task.id) > -1}
                              />
                            )}
                          </div>

                          <div className="title">{task.title}</div>

                          {hasStatus && <TaskStatus task={task} noTip />}
                        </div>
                      )
                    })}
                  </div>
                )
              })
              .value()}
          </Modal.Body>

          <Modal.Footer>
            {isFailed && (
              <Alert
                code={500}
                type="error"
                style={{
                  color: '#d0011b',
                  textAlign: 'left',
                  margin: '0 0 1rem'
                }}
                supportHandler={this.toggleShowModal}
              />
            )}

            <div>
              {selectedTasks.length > 0 && (
                <span className="c-deal-bulk-submit-modal__counter">
                  {selectedTasks.length} task selected
                </span>
              )}

              <button
                disabled={selectedTasks.length === 0 || saving}
                className="c-deal-bulk-submit-modal__submit-btn"
                onClick={() => this.submit()}
              >
                {saving ? 'Saving ...' : 'Notify Admin'}
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default connect(
  ({ deals }) => ({
    tasks: deals.tasks,
    checklists: deals.checklists
  }),
  { bulkSubmit, notify, updatesTasks }
)(BulkSubmit)
