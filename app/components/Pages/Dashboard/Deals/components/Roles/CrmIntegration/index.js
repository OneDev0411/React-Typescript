import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { createRoles, updateRole } from 'actions/deals'
import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { createContacts } from 'models/contacts/create-contacts'
import { confirmation } from 'actions/confirmation'

import {
  convertRoleToContact,
  getLegalFullName,
  getContactDiff
} from '../../../utils/roles'
import RoleForm from '../Form'

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
    const isNewRecord = !this.props.role || !this.props.role.role

    try {
      this.setState({
        isSaving: true
      })

      if (isNewRecord) {
        if (form.contact) {
          const upsertedAttributes = getContactDiff(
            form,
            this.props.attributeDefs
          )

          if (upsertedAttributes.length > 0) {
            await upsertContactAttributes(form.contact.id, upsertedAttributes)

            this.showNotification(`${getLegalFullName(form)} Updated.`)
          }
        } else {
          this.askCreateContact(form, this.props.role)
        }

        if (this.props.deal) {
          const newRoles = await this.props.createRoles(this.props.deal.id, [
            form
          ])

          console.log('[ Role Created ] ', newRoles)
          this.props.onUpsertRole(newRoles[0])
        } else {
          this.props.onUpsertRole({
            id: new Date().getTime(),
            ...form
          })
        }
      }

      if (!isNewRecord) {
        const updatedRole = this.props.deal
          ? await this.props.updateRole(this.props.deal.id, form)
          : form

        console.log('[ Role Updated ] ', updatedRole)
        this.props.onUpsertRole(updatedRole)
      }

      this.props.onHide()
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
    await createContacts([
      convertRoleToContact(form, this.props.user.id, this.props.attributeDefs)
    ])

    this.showNotification(`New Contact Created: ${getLegalFullName(form)}`)
  }

  askCreateContact = form => {
    if (this.props.user.email === form.email) {
      return false
    }

    this.props.confirmation({
      message: `Should we add ${form.legal_first_name ||
        form.company_title} to your Contacts?`,
      cancelLabel: 'No',
      confirmLabel: 'Yes, Add',
      onConfirm: () => this.createCrmContact(form)
    })
  }

  render() {
    return (
      <RoleForm
        form={this.props.role}
        deal={this.props.deal}
        dealSide={this.props.dealSide}
        modalTitle={this.props.modalTitle}
        isSubmitting={this.state.isSaving}
        isEmailRequired={this.props.isEmailRequired}
        isCommissionRequired={this.props.isCommissionRequired}
        isOpen={this.props.isOpen}
        onHide={this.props.onHide}
        onFormSubmit={this.onSubmit}
        allowedRoles={this.props.allowedRoles}
      />
    )
  }
}

RoleFormWrapper.propTypes = {
  deal: PropTypes.object,
  role: PropTypes.object,
  onUpsertRole: PropTypes.func,
  onHide: PropTypes.func
}

RoleFormWrapper.defaultProps = {
  deal: null,
  role: null,
  onUpsertRole: () => null,
  onHide: () => null
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
    confirmation
  }
)(RoleFormWrapper)
