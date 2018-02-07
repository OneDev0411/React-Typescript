import React from 'react'
import { connect } from 'react-redux'
import pick from 'lodash/pick'
import { Button, Modal } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import RoleForm from '../form'
import { createRoles, updateRole } from '../../../../../../../store_actions/deals'
import { addContact } from '../../../../../../../store_actions/contact/add-contact'
import { upsertAttributes } from '../../../../../../../store_actions/contact/index'

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
      deal,
      createRoles,
      updateRole,
      notify,
      addContact,
      upsertAttributes
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
        if (!form.contact) {
          const copyFormData = Object.assign({}, form)

          await addContact(nomilizedFormDataAsContact(copyFormData))
        } else {
          const newAttributes = await this.getNewAttributes(form)
          const nameAttribute = await this.getUpdatedNameAttribute(form)

          if (nameAttribute && !nameAttribute.id) {
            newAttributes.push(nameAttribute)
          }

          if (nameAttribute || newAttributes.length > 0) {
            if (nameAttribute && nameAttribute.id) {
              await upsertAttributes(form.contact.id, 'name', [nameAttribute], true)
            }

            if (newAttributes.length > 0) {
              await upsertAttributes(form.contact.id, '', newAttributes, true)
            }

            this.notifySuccess('Contact updated.')
          }
        }

        await createRoles(deal.id, [form])
        this.notifySuccess('Contact added to the deal.')
      }

      this.handleCloseModal()
    } catch (e) {
      // console.log(e)

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

  async getUpdatedNameAttribute(formData = {}) {
    const { contact } = formData
    const { summary, sub_contacts } = contact
    const updateList = [
      'legal_prefix',
      'legal_first_name',
      'legal_middle_name',
      'legal_last_name'
    ]

    const { names } = sub_contacts[0].attributes
    const namesId = Array.isArray(names) ? names[0].id : undefined

    const nameFields = [
      'title',
      'nickname',
      'first_name',
      'middle_name',
      'last_name',
      'legal_prefix',
      'legal_first_name',
      'legal_middle_name',
      'legal_last_name'
    ]

    const nameAttribute = pick(summary, nameFields)

    const updatedNamesList = Object.keys(formData)
      .filter(attr => updateList.includes(attr))
      .filter(attr => {
        if (formData[attr]) {
          return !nameAttribute[attr] || formData[attr] !== nameAttribute[attr]
        }
      })

    const updatedNames = {}

    updatedNamesList.forEach(name => {
      updatedNames[name] = formData[name]
    })

    if (Object.keys(updatedNames).length > 0) {
      return {
        ...nameAttribute,
        ...updatedNames,
        id: namesId,
        type: 'name'
      }
    }

    return null
  }

  async getNewAttributes(formData = {}) {
    const {
      email, phone_number, emails, phones
    } = formData
    const newAttributes = []

    const isNewEmail = email && !emails.map(item => item.email).includes(email)
    const isNewPhoneNumber =
      phone_number && !phones.map(item => item.phone_number).includes(phone_number)

    if (isNewEmail) {
      newAttributes.push({
        email,
        type: 'email',
        is_primary: emails.length === 0
      })
    }

    if (isNewPhoneNumber) {
      newAttributes.push({
        phone_number,
        type: 'phone_number',
        is_primary: phones.length === 0
      })
    }

    return newAttributes
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
  createRoles,
  upsertAttributes
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
