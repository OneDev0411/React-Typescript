import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import RoleForm from '../form'
import { createRoles, updateRole } from '../../../../../../../store_actions/deals'

const initialState = {
  form: null,
  saving: false,
  isUpdateModal: false,
  isFormCompleted: false
}

class AddRoleModal extends React.Component {
  state = initialState

  componentWillUnmount = () => {
    this.setState(initialState)
  }

  isUpdateModal = () => {
    const { role } = this.props

    return role && role.role
  }

  onFormChange = ({ form, isFormCompleted }) => {
    this.setState({ form, isFormCompleted })
  }

  submit = async () => {
    let successMessage
    const { form } = this.state
    const {
      deal, createRoles, updateRole, notify
    } = this.props

    if (!deal) {
      return false
    }

    this.setState({
      saving: true
    })

    try {
      if (this.isUpdateModal()) {
        await updateRole(deal.id, _.omit(form, 'user'))
        successMessage = 'Contact updated.'
      } else {
        await createRoles(deal.id, [form])
        successMessage = 'Contact added.'
      }

      this.handleCloseModal()
      notify({
        status: 'success',
        message: successMessage
      })
    } catch (e) {
      if (!e.response) {
        return notify({
          message: `Error: ${e.message}`,
          status: 'error'
        })
      }

      const { attributes } = e.response.body
      const field = attributes && Object.keys(attributes)[0]

      notify({
        message: `${field || 'entered data'} is invalid`,
        status: 'error'
      })
    }

    this.setState({
      saving: false
    })
  }

  setSubmitButtonText = () => {
    const { saving } = this.state

    const isUpdate = this.isUpdateModal()

    let text = isUpdate ? 'Update' : 'Add'

    if (saving) {
      return isUpdate ? 'Updating...' : 'Adding...'
    }

    return text
  }

  handleCloseModal = () => {
    this.props.closeHandler()
    this.setState(initialState)
  }

  render() {
    const { form, saving, isFormCompleted } = this.state
    const {
      deal, allowedRoles, isOpen, role
    } = this.props
    const disabled = !isFormCompleted || saving === true
    const modalTitle = this.isUpdateModal() ? 'Update Contact' : 'Add to Deal'

    return (
      <Modal
        show={isOpen}
        backdrop="static"
        onHide={this.handleCloseModal}
        dialogClassName="modal-deal-add-role"
      >
        <Modal.Header closeButton>{modalTitle}</Modal.Header>

        <Modal.Body>
          <RoleForm
            deal={deal}
            form={form || role}
            allowedRoles={allowedRoles}
            onFormChange={this.onFormChange}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            disabled={disabled}
            onClick={this.submit}
            bsStyle={disabled ? 'link' : 'primary'}
            className={`btn-deal ${disabled ? 'disabled' : ''}`}
          >
            {this.setSubmitButtonText()}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connect(null, {
  notify,
  updateRole,
  createRoles
})(AddRoleModal)
