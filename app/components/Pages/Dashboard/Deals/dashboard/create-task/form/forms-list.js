import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import cn from 'classnames'
import Upload from '../../upload'

class Forms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: ''
    }
  }

  onSelectFile(files) {
    const { creatingForm, onNewTask } = this.props

    if (creatingForm !== null || files.length === 0) {
      return false
    }

    onNewTask(files)
  }

  render() {
    const { creatingForm, forms, deal, show, onClose, onSelectForm } = this.props
    const { filter } = this.state

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
              .filter(form => {
                return form.name.toLowerCase().includes(filter.toLowerCase())
              })
              .map((form, key) => (
                <li
                  key={`FORM_ITEM_${form.id}_${key}`}
                  onClick={() => onSelectForm(form)}
                  onDoubleClick={() => null}
                  className={cn({ disabled: creatingForm !== null })}
                >
                  { form.name }

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
              <Upload
                task={{}}
                deal={deal}
                onDrop={files => this.onSelectFile(files)}
              >
                <i className="fa fa-plus" /> Other
              </Upload>
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

export default connect(mapStateToProps)(Forms)
