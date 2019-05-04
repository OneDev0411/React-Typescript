import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { createRoles, updateRole } from 'actions/deals'
import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { createContacts } from 'models/contacts/create-contacts'
import { confirmation } from 'actions/confirmation'

import DealRole from 'components/DealRole'

import {
  convertRoleToContact,
  getLegalFullName,
  getContactDiff
} from '../../../utils/roles'

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

  onSubmit = async (form, saveRoleInContacts) => {
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
          this.createCrmContact(form, saveRoleInContacts)
        }

        if (this.props.deal) {
          const newRoles = await this.props.createRoles(this.props.deal.id, [
            form
          ])

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

  createCrmContact = async (form, saveRoleInContacts) => {
    if (!saveRoleInContacts || this.props.user.email === form.email) {
      return false
    }

    await createContacts([
      convertRoleToContact(form, this.props.user.id, this.props.attributeDefs)
    ])

    this.showNotification(`New Contact Created: ${getLegalFullName(form)}`)
  }

  render() {
    return (
      <DealRole
        form={this.props.role}
        deal={this.props.deal}
        dealSide={this.props.dealSide}
        isSubmitting={this.state.isSaving}
        isEmailRequired={this.props.isEmailRequired}
        formTitle={this.props.modalTitle}
        formOptions={this.props.formOptions}
        isCommissionRequired={this.props.isCommissionRequired}
        isRoleRemovable={this.props.isRoleRemovable}
        allowedRoles={this.props.allowedRoles}
        isOpen={this.props.isOpen}
        onFormSubmit={this.onSubmit}
        onClose={this.props.onHide}
      />
    )
  }
}

RoleFormWrapper.propTypes = {
  deal: PropTypes.object,
  role: PropTypes.object,
  formOptions: PropTypes.object,
  isRoleRemovable: PropTypes.bool,
  onUpsertRole: PropTypes.func,
  onHide: PropTypes.func
}

RoleFormWrapper.defaultProps = {
  deal: null,
  role: null,
  formOptions: {},
  isRoleRemovable: false,
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
