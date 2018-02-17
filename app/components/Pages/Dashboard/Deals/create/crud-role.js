import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import RoleForm from '../dashboard/roles/form'
import RoleItem from './role-item'
import UserAvatar from '../../../../Partials/UserAvatar'
import {
  roleName,
  normalizeContact,
  getNewAttributes,
  getUpdatedNameAttribute,
  normalizedFormDataAsContact
} from '../utils/roles'
import SelectContactModal from '../../../../../views/components/SelectContactModal'
import createNewContact from '../../../../../store_actions/contacts/create-new-contact'
import { upsertAttributes } from '../../../../../store_actions/contact/index'

const initialState = {
  form: null,
  isSaving: false,
  showFormModal: false,
  showAgentsModal: false,
  isFormCompleted: false,
  showSelectContactModal: false
}

class CrudRole extends React.Component {
  state = initialState

  handlOnHide = () => {
    this.setState(initialState)
  }

  handleShowModal = () => {
    const { teamAgents, shouldPrepopulateAgent, role } = this.props

    if (shouldPrepopulateAgent && teamAgents.length > 0) {
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
    const { notify, createNewContact, upsertAttributes } = this.props
    const { contact, legal_first_name, legal_last_name, isAgent } = form
    const fullName = `${legal_first_name} ${legal_last_name}`

    try {
      if (!isAgent && !this.isUpdateModal()) {
        this.setState({
          isSaving: true
        })

        if (!contact) {
          const copyFormData = Object.assign({}, form)

          await createNewContact(normalizedFormDataAsContact(copyFormData))
          this.notifySuccess(`${fullName} has been added to your Contacts.`)
        } else {
          const newAttributes = await getNewAttributes(form)
          const nameAttribute = await getUpdatedNameAttribute(form)

          if (nameAttribute && !nameAttribute.id) {
            newAttributes.push(nameAttribute)
          }

          if (nameAttribute || newAttributes.length > 0) {
            if (nameAttribute && nameAttribute.id) {
              await upsertAttributes(
                form.contact.id,
                'name',
                [nameAttribute],
                true
              )
            }

            if (newAttributes.length > 0) {
              await upsertAttributes(form.contact.id, '', newAttributes, true)
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
    const { office, work_phone } = agent

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

  onFormChange = ({ form, isFormCompleted }) => {
    this.setState({
      form,
      isFormCompleted
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
      form: normalizeContact(contact),
      showFormModal: true,
      showSelectContactModal: false
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
      isFormCompleted,
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
              <span className="icon">+</span>
              <span className="text">{ctaTitle}</span>
            </button>
          </div>
        )}

        <SelectContactModal
          title="Add to Deal"
          isOpen={showSelectContactModal}
          handleOnClose={this.handlOnHide}
          handleAddManually={this.handleOpenFormModal}
          handleSelectedItem={this.handleSelectedContact}
        />

        <Modal
          show={showFormModal}
          onHide={this.handlOnHide}
          dialogClassName="modal-deal-add-role"
          backdrop="static"
        >
          <Modal.Header closeButton>{modalTitle}</Modal.Header>

          <Modal.Body>
            <RoleForm
              form={role || form}
              allowedRoles={allowedRoles}
              isCommissionRequired={isCommissionRequired}
              onFormChange={data => this.onFormChange(data)}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              onClick={this.addRole}
              disabled={!isFormCompleted || isSaving}
              bsStyle={!isFormCompleted ? 'link' : 'primary'}
              className={`btn-deal ${!isFormCompleted ? 'disabled' : ''}`}
            >
              {this.setSubmitButtonText()}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          backdrop="static"
          show={showAgentsModal}
          dialogClassName="modal-deal-select-role"
          onHide={this.handlOnHide}
        >
          <Modal.Header closeButton>Choose primary agent</Modal.Header>

          <Modal.Body>
            <div className="deal-roles">
              {teamAgents &&
                teamAgents.map(user => (
                  <div
                    key={user.id}
                    className="item"
                    onClick={() => this.onSelectAgent(user)}
                  >
                    <div className="role-avatar">
                      <UserAvatar
                        name={user.display_name}
                        image={user.profile_image_url}
                        size={32}
                        showStateIndicator={false}
                      />
                    </div>

                    <div className="name">
                      <div>{user.display_name}</div>
                      <div className="role">{roleName(user.role || '')}</div>
                    </div>
                  </div>
                ))}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

function mapToProps({ deals }) {
  const { agents: teamAgents } = deals

  return { teamAgents }
}

export default connect(mapToProps, {
  notify,
  createNewContact,
  upsertAttributes
})(CrudRole)
