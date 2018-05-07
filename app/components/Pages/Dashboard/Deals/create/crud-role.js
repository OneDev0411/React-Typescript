import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import RoleCrmIntegration from '../dashboard/roles/crm-integration'
import AgentModal from './deal-team-agents'
import RoleItem from './role-item'
import ContactModal from '../../../../../views/components/SelectContactModal'
import { convertContactToRole } from '../utils/roles'
import { extractUserInfoFromContact } from '../../../../../models/contacts'
import { selectContacts } from '../../../../../reducers/contacts/list'

const initialState = {
  role: null,
  isSaving: false,
  showRoleModal: false,
  showAgentModal: false,
  showContactModal: false,
  selectedAgent: null
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
      role: convertContactToRole(contact)
    })
  }

  onSelectAgent = user => {
    const contacts = this.searchContactByEmail(user.email)
    let newState

    if (contacts.length === 0) {
      newState = {
        showRoleModal: true
      }
    } else if (contacts.length === 1) {
      newState = {
        showRoleModal: true,
        role: convertContactToRole(contacts[0])
      }
    } else if (contacts.length > 1) {
      newState = {
        selectedAgent: user,
        showContactModal: true
      }
    }

    this.setState({
      ...initialState,
      ...newState
    })
  }

  searchContactByEmail = email => {
    const { contacts } = this.props
    const contactsList = selectContacts(contacts).map(
      extractUserInfoFromContact
    )

    if (!contactsList) {
      return []
    }

    return contactsList.filter(contact => contact.email === email)
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
      showContactModal,
      selectedAgent
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
          handleAddManually={selectedAgent ? null : this.showRoleModal}
          defaultSearchFilter={selectedAgent && selectedAgent.email}
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
    contacts: contacts.list
  }
}

export default connect(mapStateToProps, {
  notify
})(CrudRole)
