import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import RoleForm from '../dashboard/roles/form'
import RoleItem from './role-item'
import TeamAgents from './deal-team-agents'
import {
  getNewAttributes,
  normalizeContactAsRole,
  getUpdatedNameAttribute,
  normalizeNewRoleFormDataAsContact
} from '../utils/roles'
import SelectContactModal from '../../../../../views/components/SelectContactModal'
import {
  createNewContact,
  upsertContactAttributes
} from '../../../../../store_actions/contacts'

const initialState = {
  form: null,
  isSaving: false,
  showFormModal: false,
  showAgentsModal: false,
  showSelectContactModal: false
}

class CrudRole extends React.Component {
  state = initialState

  handlOnHide = () => {
    this.setState(initialState)
  }

  handleShowModal = () => {
    const { shouldPrepopulateAgent, role } = this.props

    if (shouldPrepopulateAgent) {
      return this.setState({ showAgentsModal: true })
    }

    if (role) {
      return this.setState({ showFormModal: true })
    }

    return this.setState({ showSelectContactModal: true })
  }

  isUpdateModal = () => {
    const { role } = this.props

    return role && role.role
  }

  notifySuccess = message =>
    this.props.notify({
      message,
      status: 'success'
    })

  addRole = async () => {
    const { form } = this.state
    const { notify, createNewContact, upsertContactAttributes } = this.props
    const {
      contact,
      legal_first_name,
      legal_last_name,
      isAgent,
      company_title
    } = form
    let fullName

    if (legal_first_name || legal_last_name) {
      fullName = `${legal_first_name} ${legal_last_name}`
    } else if (company_title) {
      fullName = company_title
    }

    try {
      if (!isAgent && !this.isUpdateModal()) {
        this.setState({
          isSaving: true
        })

        if (!contact) {
          const copyFormData = Object.assign({}, form)

          await createNewContact(
            normalizeNewRoleFormDataAsContact(copyFormData)
          )
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
              await upsertContactAttributes({
                contactId,
                attributes: [nameAttribute]
              })
            }

            if (newAttributes.length > 0) {
              await upsertContactAttributes({
                contactId,
                attributes: newAttributes
              })
            }

            this.notifySuccess(
              `${fullName}'s contact profile has been updated.`
            )
          }
        }
      }

      this.props.onUpsertRole({
        id: new Date().getTime(),
        ...form
      })
      this.handlOnHide()
    } catch (e) {
      this.setState({
        isSaving: false
      })

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
  }

  onSelectAgent = user => {
    const { agent, first_name, last_name, email, phone_number } = user

    const { office, work_phone } = agent || {}

    const form = {
      email,
      isAgent: true,
      legal_last_name: last_name,
      legal_first_name: first_name,
      phone: phone_number || work_phone,
      company: office ? office.name : ''
    }

    this.setState({
      form,
      showAgentsModal: false,
      showFormModal: true
    })
  }

  onFormChange = form => {
    this.setState({
      form
    })
  }

  handleOpenFormModal = () => {
    this.setState({
      showFormModal: true,
      showAgentsModal: false,
      showSelectContactModal: false
    })
  }

  handleSelectedContact = contact => {
    this.setState({
      showFormModal: true,
      showSelectContactModal: false,
      form: normalizeContactAsRole(contact)
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

  render() {
    const {
      form,
      isSaving,
      showFormModal,
      showAgentsModal,
      showSelectContactModal
    } = this.state

    const {
      role,
      ctaTitle,
      modalTitle,
      teamAgents,
      onRemoveRole,
      allowedRoles,
      isCommissionRequired
    } = this.props

    return (
      <div>
        {role ? (
          <RoleItem
            person={role}
            onRemove={onRemoveRole}
            onClick={this.handleShowModal}
          />
        ) : (
          <div className="entity-item people new">
            <button
              onClick={this.handleShowModal}
              className="c-button--shadow add-item"
            >
              <span className="icon test">+</span>
              <span className="text">{ctaTitle}</span>
            </button>
          </div>
        )}

        <SelectContactModal
          title={modalTitle}
          isOpen={showSelectContactModal}
          handleOnClose={this.handlOnHide}
          handleAddManually={this.handleOpenFormModal}
          handleSelectedItem={this.handleSelectedContact}
        />

        <TeamAgents
          show={showAgentsModal}
          handleOnClose={this.handlOnHide}
          handleSelectAgent={user => this.onSelectAgent(user)}
          teamAgents={teamAgents}
        />

        <RoleForm
          showFormModal={showFormModal}
          handlOnHide={this.handlOnHide}
          onSubmit={this.addRole}
          submitButtonText={this.setSubmitButtonText()}
          formNotChanged={!form}
          modalTitle={modalTitle}
          isSaving={isSaving}
          form={form || role}
          allowedRoles={allowedRoles}
          isCommissionRequired={isCommissionRequired}
          onFormChange={data => this.onFormChange(data)}
        />
      </div>
    )
  }
}

export default connect(null, {
  notify,
  createNewContact,
  upsertContactAttributes
})(CrudRole)
