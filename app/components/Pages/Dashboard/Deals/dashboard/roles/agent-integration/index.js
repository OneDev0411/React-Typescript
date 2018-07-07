import React, { Fragment } from 'react'

import ContactModal from '../../../../../../../views/components/SelectContactModal'
import { convertContactToRole } from '../../../utils/roles'

import RoleCrmIntegration from '../crm-integration'
import AgentModal from './agents-list'

const initialState = {
  showAgentModal: false,
  showContactModal: false,
  showRoleModal: false,
  role: null,
  selectedAgent: null
}

class RoleAgentIntegration extends React.Component {
  state = initialState

  componentWillReceiveProps(nextProps) {
    this.setState(this.getModalStates(nextProps))
  }

  getModalStates = props => {
    const { isOpen } = props

    if (!isOpen) {
      return initialState
    }

    if (this.ShouldSelectRoleFromAgentsList) {
      return {
        showAgentModal: true
      }
    }

    return {
      showContactModal: true
    }
  }

  onSelectContactUser = contact =>
    this.setState({
      ...initialState,
      showRoleModal: true,
      selectedAgent: this.state.selectedAgent,
      role: convertContactToRole(contact, this.props.attributeDefs)
    })

  onUpsertRole = role => {
    const { selectedAgent } = this.state

    if (role && selectedAgent) {
      role.user = selectedAgent.id
    }

    this.setState(initialState)
    this.props.onUpsertRole(role)
  }

  showRoleModal = () =>
    this.setState({
      ...initialState,
      showRoleModal: true
    })

  get ShouldSelectRoleFromAgentsList() {
    const { dealSide, allowedRoles, roleType } = this.props

    if (this.props.disableAgentsList || roleType !== 'agent') {
      return false
    }

    const isCoSellerAgent =
      dealSide === 'Selling' &&
      allowedRoles.length === 1 &&
      allowedRoles[0] === 'CoSellerAgent'

    const isCoBuyerAgent =
      dealSide === 'Buying' &&
      allowedRoles.length === 1 &&
      allowedRoles[0] === 'CoBuyerAgent'

    if (
      this.props.isPrimaryAgent ||
      this.props.isDoubleEnded ||
      isCoSellerAgent ||
      isCoBuyerAgent
    ) {
      return true
    }

    return false
  }

  onSelectAgent = (user, relatedContacts) => {
    let newState

    /**
     * if there is no related contact for this agent:
     * populate role form with agent data
     */
    if (relatedContacts.length === 0) {
      let { agent, first_name, last_name, email, phone_number } = user
      let { office, work_phone } = agent || {}

      newState = {
        role: {
          email,
          legal_last_name: last_name,
          legal_first_name: first_name,
          phone: phone_number || work_phone,
          company: office ? office.name : ''
        },
        showRoleModal: true
      }
    }

    /**
     * if there is one related contact for the agent:
     * populate role form with the relevant contact record
     */
    if (relatedContacts.length === 1) {
      newState = {
        showRoleModal: true,
        role: convertContactToRole(relatedContacts[0], this.props.attributeDefs)
      }
    }

    /**
     * if there are more than one related contacts for the agent:
     * show contacts modal to user be able select one of them
     */
    if (relatedContacts.length > 1) {
      newState = {
        showContactModal: true
      }
    }

    this.setState({
      ...initialState,
      ...newState,
      selectedAgent: user
    })
  }

  render() {
    const {
      showAgentModal,
      showRoleModal,
      showContactModal,
      role,
      selectedAgent
    } = this.state
    const { modalTitle, onHide } = this.props

    return (
      <Fragment>
        {showAgentModal && (
          <AgentModal
            isPrimaryAgent={this.props.isPrimaryAgent}
            onHide={onHide}
            onSelectAgent={this.onSelectAgent}
          />
        )}

        <RoleCrmIntegration
          isOpen={showRoleModal}
          user={role}
          dealSide={this.props.dealSide}
          modalTitle={modalTitle}
          allowedRoles={this.props.allowedRoles}
          isCommissionRequired={this.props.isCommissionRequired}
          onHide={onHide}
          onUpsertRole={this.onUpsertRole}
        />

        <ContactModal
          title={modalTitle}
          isOpen={showContactModal}
          handleOnClose={onHide}
          handleAddManually={selectedAgent ? null : this.showRoleModal}
          defaultSearchFilter={selectedAgent && selectedAgent.email}
          showSearchInput={selectedAgent === null}
          handleSelectedItem={this.onSelectContactUser}
        />
      </Fragment>
    )
  }
}

export default RoleAgentIntegration
