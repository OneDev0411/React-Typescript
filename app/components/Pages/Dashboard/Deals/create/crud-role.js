import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import RoleForm from '../dashboard/roles/form'
import RoleItem from './role-item'
import UserAvatar from '../../../../Partials/UserAvatar'
import roleName from '../utils/roles'
import SelectContactModal from '../../../../../views/components/SelectContactModal'

const initialState = {
  form: null,
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

  addRole = () => {
    const { form } = this.state

    this.props.onUpsertRole({
      id: new Date().getTime(),
      ...form
    })

    this.handlOnHide()
  }

  populateFormWithAgentData = user => {
    const { agent } = user

    const form = {
      title: `${user.first_name} ${user.last_name}`,
      legal_first_name: user.first_name,
      legal_last_name: user.last_name,
      email: user.email,
      phone: user.phone_number || agent.work_phone,
      company: agent.office ? agent.office.name : ''
    }

    this.setState({ form })
  }

  onSelectAgent = agent => {
    this.populateFormWithAgentData(agent)

    this.setState({
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
    const {
      legal_last_name, legal_first_name, last_name, first_name
    } = contact

    const form = {
      ...contact,
      legal_first_name: legal_first_name || first_name,
      legal_last_name: legal_last_name || last_name
    }

    this.setState({ form, showFormModal: true, showSelectContactModal: false })
  }

  render() {
    const {
      form,
      showFormModal,
      showAgentsModal,
      isFormCompleted,
      showSelectContactModal
    } = this.state

    const {
      role,
      ctaTitle,
      buttonText,
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
          <Modal.Header closeButton>
            {(form && form.title) || modalTitle}
          </Modal.Header>

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
              className={`btn-deal ${!isFormCompleted ? 'disabled' : ''}`}
              bsStyle={!isFormCompleted ? 'link' : 'primary'}
              disabled={!isFormCompleted}
              onClick={this.addRole}
            >
              {buttonText || 'Add'}
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

export default connect(mapToProps)(CrudRole)
