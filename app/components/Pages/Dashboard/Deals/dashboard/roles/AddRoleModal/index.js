import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import RoleForm from '../form'
import { createRoles, updateRole } from '../../../../../../../store_actions/deals'
import { addContact } from '../../../../../../../store_actions/contact/add-contact'

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

  notifySuccess = message =>
    this.props.notify({
      message,
      status: 'success'
    })

  submit = async () => {
    const { form } = this.state
    const {
      deal, createRoles, updateRole, notify, addContact
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
        this.notifySuccess('Contact updated.')
      } else {
        if (!form.contactId) {
          const copyFormData = Object.assign({}, form)

          await addContact(nomilizedFormDataAsContact(copyFormData))
          this.notifySuccess('New contact created.')
        }

        await createRoles(deal.id, [form])
        this.notifySuccess('Contact added to the deal.')
      }

      this.handleCloseModal()
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
  addContact,
  updateRole,
  createRoles
})(AddRoleModal)

function nomilizedFormDataAsContact(formData = {}) {
  const { email, phone_number } = formData
  let emails
  let phone_numbers

  if (email) {
    emails = [email]
    delete formData.email
  }

  if (phone_number) {
    phone_numbers = [phone_number]
    delete formData.phone_number
  }

  return {
    ...formData,
    emails,
    phone_numbers
  }
}
