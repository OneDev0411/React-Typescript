import React from 'react'
import { Button, FormControl, Modal } from 'react-bootstrap'
import RoleForm from '../dashboard/roles/form'
import RoleItem from './role-item'

class CrudRole extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      form: null
    }
  }

  showModal() {
    this.setState({ show: true })
  }

  closeModal() {
    this.setState({ show: false, form: null })
  }

  addRole() {
    const { form } = this.state

    this.props.onUpsertRole(form)
    this.closeModal()
  }

  render() {
    const { show, form } = this.state
    const { role, allowedRoles, onRemoveRole, modalTitle, ctaTitle } = this.props
    const buttonDisabled = (form === null)

    return (
      <div>
        {
          role ?
          <RoleItem
            person={role}
            onRemove={onRemoveRole}
            onClick={() => this.showModal()}
          /> :
          <div className="entity-item people new">
            <span className="add-item"
              onClick={() => this.showModal()}
            >
              <span className="icon">+</span>
              <span className="text">{ctaTitle}</span>
            </span>
          </div>
        }

        <Modal
          show={show}
          onHide={() => this.closeModal()}
          dialogClassName="modal-deal-add-role"
          backdrop="static"
        >
          <Modal.Header closeButton>
            {modalTitle}
          </Modal.Header>

          <Modal.Body>
            <RoleForm
              form={role}
              onFormCompleted={form => this.setState({ form })}
              allowedRoles={allowedRoles}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              className={`btn-deal ${buttonDisabled ? 'disabled': ''}`}
              bsStyle={buttonDisabled ? "link" : "primary"}
              disabled={buttonDisabled}
              onClick={() => this.addRole()}
            >
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default CrudRole
