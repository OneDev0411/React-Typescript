import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import ContactModal from '../../../../../../../views/components/SelectContactModal'
import { convertContactToRole, AGENT_ROLES } from '../../../utils/roles'

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
    const { isOpen, user } = props

    if (!isOpen) {
      return initialState
    }

    if (user) {
      return {
        showRoleModal: true,
        role: user
      }
    }

    if (this.getShouldSelectRoleFromAgentsList(props)) {
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
    const { onUpsertRole } = this.props

    if (role && selectedAgent) {
      role.user = selectedAgent.id
    }

    this.setState(initialState)

    if (onUpsertRole) {
      onUpsertRole(role)
    }
  }

  showRoleModal = () =>
    this.setState({
      ...initialState,
      showRoleModal: true
    })

  getShouldSelectRoleFromAgentsList(props) {
    const { deal, allowedRoles } = props
    const dealSide = deal ? deal.deal_type : props.dealSide
    const role = allowedRoles && allowedRoles[0]

    if (!role || !AGENT_ROLES.includes(role)) {
      return false
    }

    if (
      props.isDoubleEnded ||
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
        showRoleModal: true
      }
    }

    if (relatedContacts.length > 0) {
      newState = {
        showRoleModal: true,
        role: convertContactToRole(relatedContacts[0], this.props.attributeDefs)
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
    const { deal, modalTitle, onHide } = this.props

    return (
      <Fragment>
        {showAgentModal && (
          <AgentModal
            isPrimaryAgent={this.IsPrimaryAgent}
            onHide={onHide}
            onSelectAgent={this.onSelectAgent}
          />
        )}

        <RoleCrmIntegration
          deal={deal}
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
