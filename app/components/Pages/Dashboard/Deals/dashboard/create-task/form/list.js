import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'

class Forms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: ''
    }
  }

  onSelectFile(files) {
    if (files.length === 0) {
      return false
    }

    this.props.onRequestUpload(files[0])
  }

  render() {
    const { forms, show, onClose, onSelectForm } = this.props
    const { filter } = this.state

    return (
      <Modal
        show={show}
        onHide={onClose}
        dialogClassName="modal-deal-create-form"
      >
        <Modal.Header closeButton>
          Add Task
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
              .map(form => (
                <li
                  key={`FORM_ITEM_${form.id}`}
                  onClick={() => onSelectForm(form)}
                >
                  { form.name }
                </li>
              ))
              .value()
            }
          </ul>
        </Modal.Body>

        <Modal.Footer>
          <ul>
            <li className="upload">
              <Dropzone
                disableClick={false}
                multiple={false}
                accept="application/pdf,image/*"
                onDrop={files => this.onSelectFile(files)}
                style={{ width: '100%' }}
              >
                <i className="fa fa-plus" /> Other
              </Dropzone>
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
