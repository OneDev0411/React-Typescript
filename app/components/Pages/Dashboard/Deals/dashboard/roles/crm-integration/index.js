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
import {
  getLegalFullName,
  convertRoleToContact,
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
      createContacts,
      updateRole,
      createRoles,
      onUpsertRole = () => null,
      onHide = () => null
    } = this.props
    const fullName = getLegalFullName(form)
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

            this.showNotification(`${fullName} Updated.`)
          }
        } else {
          await createContacts(convertRoleToContact(form, attributeDefs))
          this.showNotification(`New Contact Created: ${fullName}`)
        }

        if (deal) {
          await createRoles(deal.id, [form])
          this.showNotification('Contact added to the deal.')
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

  render() {
    const { isSaving } = this.state
    const {
      deal,
      dealSide,
      user,
      modalTitle,
      allowedRoles,
      onHide,
      isOpen
    } = this.props

    return (
      <RoleForm
        form={user}
        deal={deal}
        dealSide={dealSide}
        modalTitle={modalTitle}
        isSubmitting={isSaving}
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

export default connect(mapStateToProps, {
  notify,
  updateRole,
  createRoles,
  createContacts,
  upsertContactAttributes
})(RoleFormWrapper)
