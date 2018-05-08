import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import RoleCrmIntegration from '../dashboard/roles/crm-integration'
import AgentModal from './deal-team-agents'
import RoleItem from './role-item'
import ContactModal from '../../../../../views/components/SelectContactModal'
import { convertContactToRole } from '../utils/roles'

const initialState = {
  role: null,
  isSaving: false,
  showRoleModal: false,
  showAgentModal: false,
  showContactModal: false
}

class CrudRole extends React.Component {
  state = initialState

  resetStates = () => {
    this.setState(initialState)
  }

  showModal = () => {
    const { shouldPrepopulateAgent, user } = this.props

    if (shouldPrepopulateAgent) {
      return this.setState({ showAgentModal: true })
    } else if (user) {
      return this.setState({ showRoleModal: true, role: user })
    }

    return this.setState({ showContactModal: true })
  }

  showRoleModal = () => {
    this.setState({
      ...initialState,
      showRoleModal: true
    })
  }

  onSelectContactUser = contact => {
    this.setState({
      ...initialState,
      showRoleModal: true,
      role: convertContactToRole(contact, this.props.attributeDefs)
    })
  }

  onSelectAgent = user => {
    const { agent, first_name, last_name, email, phone_number } = user

    const { office, work_phone } = agent || {}

    const role = {
      email,
      legal_last_name: last_name,
      legal_first_name: first_name,
      phone: phone_number || work_phone,
      company: office ? office.name : ''
    }

    this.setState({
      ...initialState,
      role,
      showRoleModal: true
    })
  }

  showNotification = (message, status = 'success') =>
    this.props.notify({
      message,
      status
    })

  render() {
    const {
      role,
      isSaving,
      showRoleModal,
      showAgentModal,
      showContactModal
    } = this.state

    const {
      user,
      ctaTitle,
      modalTitle,
      teamAgents,
      onUpsertUser,
      onRemoveUser,
      allowedRoles,
      isCommissionRequired
    } = this.props

    return (
      <Fragment>
        {user ? (
          <RoleItem
            user={user}
            onRemove={onRemoveUser}
            onClick={this.showModal}
          />
        ) : (
          <div className="entity-item people new">
            <button
              onClick={this.showModal}
              className="c-button--shadow add-item"
            >
              <span className="icon test">+</span>
              <span className="text">{ctaTitle}</span>
            </button>
          </div>
        )}

        <ContactModal
          title={modalTitle}
          isOpen={showContactModal}
          handleOnClose={this.resetStates}
          handleAddManually={this.showRoleModal}
          handleSelectedItem={this.onSelectContactUser}
        />

        <AgentModal
          isOpen={showAgentModal}
          onHide={this.resetStates}
          onSelectAgent={this.onSelectAgent}
          teamAgents={teamAgents}
        />

        <RoleCrmIntegration
          isSubmitting={isSaving}
          isOpen={showRoleModal}
          user={role}
          onHide={this.resetStates}
          onUpsertRole={onUpsertUser}
          modalTitle={modalTitle}
          allowedRoles={allowedRoles}
          isCommissionRequired={isCommissionRequired}
        />
      </Fragment>
    )
  }
}

function mapStateToProps({ contacts }) {
  return {
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(mapStateToProps, {
  notify
})(CrudRole)
