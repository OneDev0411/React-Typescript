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

import {
  convertRoleToContact,
  getLegalFullName,
  getContactDiff
} from '../../../utils/roles'
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

            this.showNotification(`${getLegalFullName(form)} Updated.`)
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

  createCrmContact = async form => {
    await this.props.createContacts(
      convertRoleToContact(form, this.props.user.id, this.props.attributeDefs)
    )

    this.showNotification(`New Contact Created: ${getLegalFullName(form)}`)
  }

  render() {
    return (
      <RoleForm
        form={this.props.role}
        deal={this.props.deal}
        dealSide={this.props.dealSide}
        modalTitle={this.props.modalTitle}
        isSubmitting={this.state.isSaving}
        isCommissionRequired={this.props.isCommissionRequired}
        isOpen={this.props.isOpen}
        onHide={this.props.onHide}
        onFormSubmit={this.onSubmit}
        allowedRoles={this.props.allowedRoles}
      />
    )
  }
}

function mapStateToProps({ user, contacts }) {
  return {
    user,
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
