import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import RoleForm from '../form'
import {
  createRoles,
  updateRole
} from '../../../../../../../store_actions/deals'
import {
  createContacts,
  upsertContactAttributes
} from '../../../../../../../store_actions/contacts'
import {
  getNewAttributes,
  getUpdatedNameAttribute,
  normalizeNewRoleFormDataAsContact
} from '../../../utils/roles'

const initialState = {
  form: null,
  isSaving: false,
  isUpdateModal: false
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

  onFormChange = form => {
    this.setState({ form })
  }

  notifySuccess = message =>
    this.props.notify({
      message,
      status: 'success'
    })

  submit = async () => {
    const {
      deal,
      createRoles,
      updateRole,
      notify,
      createContacts,
      upsertContactAttributes
    } = this.props
    const { form } = this.state
    const { contact, legal_first_name, legal_last_name, company_title } = form
    let fullName

    if (legal_first_name || legal_last_name) {
      fullName = `${legal_first_name} ${legal_last_name}`
    } else if (company_title) {
      fullName = company_title
    }

    if (!deal) {
      return false
    }

    this.setState({
      isSaving: true
    })

    try {
      if (this.isUpdateModal()) {
        await updateRole(deal.id, _.omit(form, 'user'))
      } else {
        if (!contact) {
          const copyFormData = Object.assign({}, form)

          await createContacts([
            normalizeNewRoleFormDataAsContact(copyFormData)
          ])
          this.notifySuccess(`${fullName} has been added to your Contacts.`)
        } else {
          const newAttributes = await getNewAttributes(form)
          const nameAttribute = await getUpdatedNameAttribute(form)

          if (nameAttribute && !nameAttribute.id) {
            newAttributes.push(nameAttribute)
          }

          if (nameAttribute || newAttributes.length > 0) {
            const contactId = form.contact.id

            if (nameAttribute && nameAttribute.id) {
              await upsertContactAttributes(contactId, [nameAttribute])
            }

            if (newAttributes.length > 0) {
              await upsertContactAttributes(contactId, newAttributes)
            }

            this.notifySuccess(
              `${fullName}'s contact profile has been updated.`
            )
          }
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
      isSaving: false
    })
  }

  setSubmitButtonText = () => {
    const { isSaving } = this.state

    const isUpdate = this.isUpdateModal()

    let text = isUpdate ? 'Update' : 'Add'

    if (isSaving) {
      return isUpdate ? 'Updating...' : 'Adding...'
    }

    return text
  }

  handleCloseModal = () => {
    this.props.closeHandler()
    this.setState(initialState)
  }

  render() {
    const { form, isSaving } = this.state
    const { deal, allowedRoles, isOpen, role } = this.props
    const modalTitle = this.isUpdateModal() ? 'Update Contact' : 'Add to Deal'

    return (
      <RoleForm
        showFormModal={isOpen}
        handlOnHide={this.handleCloseModal}
        modalTitle={modalTitle}
        onSubmit={this.submit}
        isSaving={isSaving}
        deal={deal}
        form={form || role}
        formNotChanged={!form}
        allowedRoles={allowedRoles}
        onFormChange={this.onFormChange}
        submitButtonText={this.setSubmitButtonText()}
      />
    )
  }
}

export default connect(null, {
  notify,
  updateRole,
  createRoles,
  createContacts,
  upsertContactAttributes
})(AddRoleModal)
