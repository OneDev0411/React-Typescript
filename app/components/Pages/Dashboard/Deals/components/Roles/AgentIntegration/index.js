import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import DealRole from 'components/DealRole'

import { convertContactToRole, AGENT_ROLES } from 'deals/utils/roles'

import Agents from './AgentsList'

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

  onSelectAgent = (user, relatedContacts = []) => {
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
          agent,
          email,
          brand: user.brand_id,
          legal_last_name: last_name,
          legal_first_name: first_name,
          phone_number: phone_number || work_phone,
          company: office ? office.name : ''
        },
        isRoleFormOpen: true
      }
    }

    if (relatedContacts.length > 0) {
      let role = {
        ...convertContactToRole(relatedContacts[0], this.props.attributeDefs),
        brand: user.brand_id
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

  render() {
    return (
      <Fragment>
        {this.state.isAgentDrawerOpen && (
          <Agents
            title={this.props.modalTitle}
            isPrimaryAgent={this.getIsPrimaryAgent()}
            onClose={this.props.onClose}
            onSelectAgent={this.onSelectAgent}
          />
        )}

        <DealRole
          deal={this.props.deal}
          isOpen={this.state.isRoleFormOpen}
          form={this.state.role}
          dealSide={this.props.dealSide}
          allowedRoles={this.props.allowedRoles}
          isEmailRequired={this.props.isEmailRequired}
          isCommissionRequired={this.props.isCommissionRequired}
          onClose={this.props.onClose}
          onUpsertRole={this.onUpsertRole}
        />
      </Fragment>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    user
  }
}

export default connect(mapStateToProps)(RoleAgentIntegration)
