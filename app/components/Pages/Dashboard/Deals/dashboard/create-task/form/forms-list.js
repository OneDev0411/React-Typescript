import React from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import { addNotification as notify } from 'reapop'
import {
  createFormTask,
  setSelectedTask,
  setUploadFiles
} from '../../../../../../../store_actions/deals'

class Forms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      creatingForm: null
    }
    this.createNewTask = _.debounce(this.createNewTask, 100)
  }

  async createNewTask(form) {
    if (this.state.creatingForm !== null) {
      return false
    }

    this.setState({
      creatingForm: form
    })

    const {
      deal,
      createFormTask,
      setSelectedTask,
      listId
    } = this.props

    // create form
    const task = await createFormTask(deal.id, form.id, form.name, listId)

    // make this task active
    setSelectedTask(task)

    this.setState({ creatingForm: null })
    this.displayForm(false)
  }

  render() {
    const {
      forms,
      show,
      onClose,
      displayTaskName
    } = this.props
    const {
      filter,
      creatingForm
    } = this.state

    return (
      <Modal
        show={show}
        onHide={onClose}
        backdrop="static"
        dialogClassName="modal-deal-create-form"
      >
        <Modal.Header
          closeButton={creatingForm === null}
        >
          {creatingForm ? 'Creating Task ...' : 'Add Task'}
        </Modal.Header>

        <Modal.Body>
          {
            _.size(forms) > 5 &&
            <input
              placeholder="Type in to search ..."
              onChange={e => this.setState({ filter: e.target.value })}
            />
          }

          <ul>
            {
              _
                .chain(forms)
                .filter(form => form.name.toLowerCase().includes(filter.toLowerCase()))
                .map((form, key) => (
                  <li
                    key={`FORM_ITEM_${form.id}_${key}`}
                    onClick={() => this.createNewTask(form)}
                    onDoubleClick={() => null}
                    className={cn({ disabled: creatingForm !== null })}
                  >
                    {form.name}

                    {
                      creatingForm && creatingForm.id === form.id &&
                      <i className="fa fa-spinner fa-spin" />
                    }
                  </li>
                ))
                .value()
            }
          </ul>
        </Modal.Body>

        <Modal.Footer>
          <ul>
            <li className="upload">
              <div onClick={displayTaskName}>
                <i className="fa fa-plus" /> Other
              </div>
            </li>
          </ul>
        </Modal.Footer>
      </Modal>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    forms: deals.checklists[props.listId].allowed_forms
  }
}

export default connect(mapStateToProps,
  {
    createFormTask,
    setSelectedTask,
    notify
  }
)(Forms)
