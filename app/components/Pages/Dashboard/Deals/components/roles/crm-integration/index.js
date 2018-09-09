import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import {
  createRoles,
  updateRole
} from '../../../../../../../store_actions/deals'
import {
  createContacts,
  upsertContactAttributes
} from '../../../../../../../store_actions/contacts'
import { confirmation } from '../../../../../../../store_actions/confirmation'

import { convertRoleToContact, getContactDiff } from '../../../utils/roles'
import RoleForm from '../form'

const initialState = {
  isSaving: false
}

class RoleFormWrapper extends React.Component {
  state = initialState

  showNotification = (message, status = 'success') =>
    this.props.notify({
      message,
      status
    })

  onSubmit = async form => {
    const {
      deal,
      user,
      attributeDefs,
      upsertContactAttributes,
      updateRole,
      createRoles,
      onUpsertRole = () => null,
      onHide = () => null
    } = this.props
    const isNewRecord = !user || !user.role

    try {
      this.setState({
        isSaving: true
      })

      if (isNewRecord) {
        if (form.contact) {
          const upsertedAttributes = getContactDiff(form, attributeDefs)

          if (upsertedAttributes.length > 0) {
            await upsertContactAttributes(form.contact.id, upsertedAttributes)

            this.showNotification(`${this.getFullName(form)} Updated.`)
          }
        } else {
          this.props.confirmation({
            message: `Should we add ${form.legal_first_name} to your Contacts?`,
            cancelLabel: 'No',
            confirmLabel: 'Yes, Add',
            onConfirm: () => this.createCrmContact(form)
          })
        }

        if (deal) {
          await createRoles(deal.id, [form])
        }
      } else if (deal) {
        await updateRole(deal.id, form)
      }

      onUpsertRole({
        id: new Date().getTime(),
        ...form
      })

      onHide()
    } catch (e) {
      console.log(e)

      if (!e.response) {
        return this.showNotification(`Error: ${e.message}`, 'error')
      }

      const { attributes } = e.response.body
      const field = attributes && Object.keys(attributes)[0]

      this.showNotification(`${field || 'Entered data'} is invalid`, 'error')
    } finally {
      this.setState({
        isSaving: false
      })
    }
  }

  getFullName = form => `${form.legal_first_name} ${form.legal_last_name}`

  createCrmContact = async form => {
    await this.props.createContacts(
      convertRoleToContact(form, this.props.attributeDefs)
    )

    this.showNotification(`New Contact Created: ${this.getFullName(form)}`)
  }

  render() {
    const { isSaving } = this.state
    const {
      deal,
      dealSide,
      user,
      modalTitle,
      allowedRoles,
      onHide,
      isOpen,
      isCommissionRequired
    } = this.props

    return (
      <RoleForm
        form={user}
        deal={deal}
        dealSide={dealSide}
        modalTitle={modalTitle}
        isSubmitting={isSaving}
        isCommissionRequired={isCommissionRequired}
        isOpen={isOpen}
        onHide={onHide}
        onFormSubmit={this.onSubmit}
        allowedRoles={allowedRoles}
      />
    )
  }
}

function mapStateToProps({ contacts }) {
  return {
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(
  mapStateToProps,
  {
    notify,
    updateRole,
    createRoles,
    confirmation,
    createContacts,
    upsertContactAttributes
  }
)(RoleFormWrapper)
