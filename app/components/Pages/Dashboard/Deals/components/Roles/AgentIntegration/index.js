import React from 'react'
import { connect } from 'react-redux'

import DealRole from 'components/DealRole'
import { TeamAgentsDrawer } from 'components/TeamAgentsDrawer'

import { convertContactToRole, AGENT_ROLES } from 'deals/utils/roles'

const initialState = {
  isAgentDrawerOpen: false,
  isRoleFormOpen: false,
  role: null,
  selectedAgent: null
}

export class RoleAgentIntegration extends React.Component {
  state = {
    ...initialState,
    ...this.getInitialState()
  }

  getInitialState() {
    if (this.getShouldSelectRoleFromAgentsList()) {
      return {
        isAgentDrawerOpen: true
      }
    }

    return {
      isRoleFormOpen: true,
      role: this.props.role || null
    }
  }

  onUpsertRole = role => {
    const { state, props } = this

    props.onUpsertRole &&
      props.onUpsertRole({
        ...role,
        user: state.selectedAgent ? state.selectedAgent.id : role.user
      })

    this.setState(initialState)
  }

  getShouldSelectRoleFromAgentsList() {
    const { deal, role, allowedRoles } = this.props
    const dealSide = deal ? deal.deal_type : this.props.dealSide
    const selectedRole = allowedRoles && allowedRoles[0]

    if (role || !selectedRole || !AGENT_ROLES.includes(selectedRole)) {
      return false
    }

    const isDoubleEnded = ['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(
      this.props.dealEnderType
    )

    if (
      isDoubleEnded ||
      (dealSide === 'Selling' &&
        ['SellerAgent', 'CoSellerAgent'].includes(selectedRole)) ||
      (dealSide === 'Buying' &&
        ['BuyerAgent', 'CoBuyerAgent'].includes(selectedRole))
    ) {
      return true
    }

    return false
  }

  getIsPrimaryAgent() {
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

  onSelectAgent = agents => {
    const { agent: user, contacts: relatedContacts = [] } = agents[0]

    let newState

    const { agent, first_name, last_name, email, phone_number } = user
    const { office, work_phone } = agent || {}

    /**
     * if there is no related contact for this agent:
     * populate role form with agent data
     */
    if (relatedContacts.length === 0) {
      newState = {
        role: {
          agent,
          email,
          brand: this.isOfficeDoubleEnded ? null : user.brand_id,
          legal_last_name: last_name,
          legal_first_name: first_name,
          phone_number: phone_number || work_phone,
          company_title: office ? office.name : ''
        },
        isRoleFormOpen: true
      }
    }

    if (relatedContacts.length > 0) {
      let role = {
        ...convertContactToRole(relatedContacts[0], this.props.attributeDefs),
        brand: this.isOfficeDoubleEnded ? null : user.brand_id,
        phone_number: phone_number || work_phone,
        company_title: office ? office.name : ''
      }

      if (user.id === this.props.user.id) {
        role = {
          ...role,
          agent: user.agent,
          legal_first_name: user.first_name || role.legal_first_name,
          legal_last_name: user.last_name || role.legal_last_name
        }
      }

      newState = {
        isRoleFormOpen: true,
        role
      }
    }

    this.setState({
      ...initialState,
      ...newState,
      selectedAgent: user
    })
  }

  get isOfficeDoubleEnded() {
    return this.props.dealEnderType === 'OfficeDoubleEnder'
  }

  render() {
    console.log(this.state.isAgentDrawerOpen)

    return (
      <>
        {this.state.isAgentDrawerOpen && (
          <TeamAgentsDrawer
            title={this.props.modalTitle}
            isPrimaryAgent={this.getIsPrimaryAgent()}
            flattenTeams={this.isOfficeDoubleEnded}
            onClose={this.props.onClose}
            onSelectAgents={this.onSelectAgent}
          />
        )}

        <DealRole
          deal={this.props.deal}
          isOpen={this.state.isRoleFormOpen}
          form={this.state.role}
          dealSide={this.props.dealSide}
          showBrokerageFields={this.props.showBrokerageFields}
          allowedRoles={this.props.allowedRoles}
          isEmailRequired={this.props.isEmailRequired}
          isCommissionRequired={this.props.isCommissionRequired}
          onClose={this.props.onClose}
          onUpsertRole={this.onUpsertRole}
        />
      </>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    user
  }
}

export default connect(mapStateToProps)(RoleAgentIntegration)
