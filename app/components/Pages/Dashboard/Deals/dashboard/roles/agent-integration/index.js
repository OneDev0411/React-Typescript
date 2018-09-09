import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import ContactModal from '../../../../../../../views/components/SelectContactModal'
import { convertContactToRole, AGENT_ROLES } from '../../../utils/roles'

import RoleCrmIntegration from '../crm-integration'
import AgentModal from './agents-list'

const initialState = {
  showAgentModal: false,
  showContactModal: false,
  showRoleDrawer: false,
  role: null,
  selectedAgent: null
}

class RoleAgentIntegration extends React.Component {
  state = {
    ...initialState,
    ...this.InitialState
  }

  get InitialState() {
    if (this.props.user) {
      return {
        showRoleDrawer: true,
        role: this.props.user
      }
    }

    if (this.getShouldSelectRoleFromAgentsList()) {
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
      showRoleDrawer: true,
      selectedAgent: this.state.selectedAgent,
      role: convertContactToRole(contact, this.props.attributeDefs)
    })

  onUpsertRole = role => {
    const { selectedAgent } = this.state
    const { onUpsertRole } = this.props

    if (role && selectedAgent) {
      role.user = selectedAgent.id
    }

    this.setState(initialState)

    if (onUpsertRole) {
      onUpsertRole(role)
    }
  }

  showRoleDrawer = () =>
    this.setState({
      ...initialState,
      showRoleDrawer: true
    })

  getShouldSelectRoleFromAgentsList() {
    const { deal, allowedRoles } = this.props
    const dealSide = deal ? deal.deal_type : this.props.dealSide
    const role = allowedRoles && allowedRoles[0]

    if (!role || !AGENT_ROLES.includes(role)) {
      return false
    }

    if (
      this.props.isDoubleEnded ||
      (dealSide === 'Selling' &&
        ['SellerAgent', 'CoSellerAgent'].includes(role)) ||
      (dealSide === 'Buying' && ['BuyerAgent', 'CoBuyerAgent'].includes(role))
    ) {
      return true
    }

    return false
  }

  get IsPrimaryAgent() {
    const { deal, allowedRoles } = this.props
    const dealSide = deal ? deal.deal_type : this.props.dealSide
    const role = allowedRoles && allowedRoles[0]

    /**
     * https://gitlab.com/rechat/web/issues/1668#note_97457381
     */
    if (dealSide === 'Buying' && role === 'BuyerAgent') {
      return true
    }

    return (
      this.props.isPrimaryAgent &&
      this.props.dealEnderType !== 'OfficeDoubleEnder'
    )
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
        showRoleDrawer: true
      }
    }

    if (relatedContacts.length > 0) {
      newState = {
        showRoleDrawer: true,
        role: convertContactToRole(relatedContacts[0], this.props.attributeDefs)
      }
    }

    this.setState({
      ...initialState,
      ...newState,
      selectedAgent: user
    })
  }

  onClose = () => {
    this.props.onHide()
  }

  render() {
    const { role, selectedAgent } = this.state
    const { deal, modalTitle } = this.props

    return (
      <Fragment>
        {this.state.showAgentModal && (
          <AgentModal
            isPrimaryAgent={this.IsPrimaryAgent}
            onHide={this.onClose}
            onSelectAgent={this.onSelectAgent}
          />
        )}

        <RoleCrmIntegration
          deal={deal}
          isOpen={this.state.showRoleDrawer}
          user={role}
          dealSide={this.props.dealSide}
          modalTitle={modalTitle}
          allowedRoles={this.props.allowedRoles}
          isCommissionRequired={this.props.isCommissionRequired}
          onHide={this.onClose}
          onUpsertRole={this.onUpsertRole}
        />

        <ContactModal
          title={modalTitle}
          isOpen={this.state.showContactModal}
          handleOnClose={this.onClose}
          handleAddManually={selectedAgent ? null : this.showRoleDrawer}
          handleSelectedItem={this.onSelectContactUser}
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

export default connect(mapStateToProps)(RoleAgentIntegration)
