import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import RoleForm from '../dashboard/roles/form'
import RoleItem from './role-item'
import UserAvatar from '../../../../Partials/UserAvatar'
import roleName from '../utils/roles'

class CrudRole extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFormModal: false,
      showAgentsModal: false,
      isFormCompleted: false,
      form: null
    }
  }

  showModal() {
    const { teamAgents, shouldPrepopulateAgent } = this.props
    let showAgentsModal = false
    let showFormModal = false

    if (shouldPrepopulateAgent !== true) {
      return this.setState({
        showFormModal: true
      })
    }

    if (teamAgents.length >= 1) {
      showAgentsModal = true
    } else {
      showFormModal = true
    }

    this.setState({
      showFormModal,
      showAgentsModal
    })
  }

  populateForm(user) {
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

  closeModal() {
    this.setState({
      showFormModal: false,
      showAgentsModal: false,
      isFormCompleted: false,
      form: null
    })
  }

  addRole() {
    const { form } = this.state

    this.props.onUpsertRole({
      id: new Date().getTime(),
      ...form
    })

    this.closeModal()
  }

  onSelectRole(user) {
    this.populateForm(user)

    this.setState({
      showAgentsModal: false,
      showFormModal: true
    })
  }

  onFormChange({ form, isFormCompleted }) {
    this.setState({
      form,
      isFormCompleted
    })
  }

  render() {
    const {
      showFormModal, showAgentsModal, isFormCompleted, form
    } = this.state
    const {
      role,
      teamAgents,
      allowedRoles,
      onRemoveRole,
      modalTitle,
      ctaTitle,
      buttonText,
      isCommissionRequired
    } = this.props

    return (
      <div>
        {role ? (
          <RoleItem
            person={role}
            onRemove={onRemoveRole}
            onClick={() => this.showModal()}
          />
        ) : (
          <div className="entity-item people new">
            <span className="add-item" onClick={() => this.showModal()}>
              <span className="icon">+</span>
              <span className="text">{ctaTitle}</span>
            </span>
          </div>
        )}

        <Modal
          show={showFormModal}
          onHide={() => this.closeModal()}
          dialogClassName="modal-deal-add-role"
          backdrop="static"
        >
          <Modal.Header closeButton>
            {(form && form.title) || modalTitle}
          </Modal.Header>

          <Modal.Body>
            <RoleForm
              form={role || form}
              onFormChange={data => this.onFormChange(data)}
              allowedRoles={allowedRoles}
              isCommissionRequired={isCommissionRequired}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              className={`btn-deal ${!isFormCompleted ? 'disabled' : ''}`}
              bsStyle={!isFormCompleted ? 'link' : 'primary'}
              disabled={!isFormCompleted}
              onClick={() => this.addRole()}
            >
              {buttonText || 'Add'}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showAgentsModal}
          dialogClassName="modal-deal-select-role"
          onHide={() => this.closeModal()}
          backdrop="static"
        >
          <Modal.Header closeButton>Choose primary agent</Modal.Header>

          <Modal.Body>
            <div className="deal-roles">
              {teamAgents &&
                teamAgents.map(user => (
                  <div
                    key={user.id}
                    className="item"
                    onClick={() => this.onSelectRole(user)}
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

export default connect(({ deals }) => ({
  teamAgents: deals.agents
}))(CrudRole)
