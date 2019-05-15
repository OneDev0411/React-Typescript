import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { SearchContactDrawer } from 'components/SearchContactDrawer'
import TextIconButton from 'components/Button/TextIconButton'
import AddIcon from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import { convertContactToRole, AGENT_ROLES } from '../../../utils/roles'

import RoleCrmIntegration from '../CrmIntegration'
import AgentModal from './AgentsList'

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
    if (this.props.role) {
      return {
        showRoleDrawer: true,
        role: this.props.role
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
    this.setState(state => ({
      ...initialState,
      showRoleDrawer: true,
      selectedAgent: state.selectedAgent,
      role: convertContactToRole(contact, this.props.attributeDefs)
    }))

  onUpsertRole = role => {
    const { selectedAgent } = this.state

    if (role && selectedAgent) {
      role.user = selectedAgent.id
    }

    this.setState(initialState)

    if (this.props.onUpsertRole) {
      this.props.onUpsertRole(role)
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
          phone_number: phone_number || work_phone,
          company: office ? office.name : ''
        },
        showRoleDrawer: true
      }
    }

    if (relatedContacts.length > 0) {
      let role = convertContactToRole(
        relatedContacts[0],
        this.props.attributeDefs
      )

      if (user.id === this.props.user.id) {
        role = {
          ...role,
          legal_first_name: user.first_name || role.legal_first_name,
          legal_last_name: user.last_name || role.legal_last_name
        }
      }

      newState = {
        showRoleDrawer: true,
        role
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

  renderSearchContactDrawerHeaderMenu = () => {
    if (this.state.selectedAgent) {
      return null
    }

    return (
      <TextIconButton
        onClick={this.showRoleDrawer}
        text="Add New Contact"
        type="button"
        appearance="outline"
        iconLeft={AddIcon}
        iconSize="large"
      />
    )
  }

  render() {
    return (
      <Fragment>
        {this.state.showAgentModal && (
          <AgentModal
            title={this.props.modalTitle}
            isPrimaryAgent={this.IsPrimaryAgent}
            onClose={this.onClose}
            onSelectAgent={this.onSelectAgent}
          />
        )}

        <RoleCrmIntegration
          deal={this.props.deal}
          isOpen={this.state.showRoleDrawer}
          role={this.state.role}
          dealSide={this.props.dealSide}
          modalTitle={this.props.modalTitle}
          allowedRoles={this.props.allowedRoles}
          formOptions={this.props.roleFormOptions}
          isEmailRequired={this.props.isEmailRequired}
          isCommissionRequired={this.props.isCommissionRequired}
          onHide={this.onClose}
          onUpsertRole={this.onUpsertRole}
        />

        <SearchContactDrawer
          title={this.props.modalTitle}
          isOpen={this.state.showContactModal}
          onClose={this.onClose}
          onSelect={this.onSelectContactUser}
          renderHeaderMenu={this.renderSearchContactDrawerHeaderMenu}
        />
      </Fragment>
    )
  }
}

function mapStateToProps({ contacts, user }) {
  return {
    user,
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(RoleAgentIntegration)
