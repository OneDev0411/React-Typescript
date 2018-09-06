import React from 'react'
import { connect } from 'react-redux'
import Downshift from 'downshift'

import RoleAgentIntegration from '../agent-integration'
import { ROLE_NAMES, roleName } from '../../../utils/roles'
import Deal from '../../../../../../../models/Deal'

import {
  Container,
  RolesMenuContainer,
  RolesMenu,
  RolesMenuItem
} from './styled'

import { RoleItem as AddRole, RoleInfo, RoleTitle, RoleAvatar } from '../styled'

class AddRoleForm extends React.Component {
  state = {
    isModalOpen: false,
    showRolesMenu: false,
    selectedRole: null
  }

  toggleRolesMenu = () =>
    this.setState(state => ({
      showRolesMenu: !state.showRolesMenu
    }))

  closeModal = () =>
    this.setState({
      isModalOpen: false,
      selectedRole: null
    })

  handleAddNewRole = () => {
    const { allowedRoles } = this.props

    console.log(allowedRoles)

    if (!allowedRoles || allowedRoles.length > 0) {
      return this.toggleRolesMenu()
    }
  }

  handleSelectRole = name =>
    this.setState({
      isModalOpen: true,
      showRolesMenu: false,
      selectedRole: name
    })

  get AllowedRoles() {
    const { selectedRole } = this.state
    const { allowedRoles } = this.props

    if (!selectedRole) {
      return allowedRoles
    }

    return Array.isArray(allowedRoles)
      ? [...allowedRoles, selectedRole]
      : [selectedRole]
  }

  get isDoubleEnded() {
    const enderType = Deal.get.field(this.props.deal, 'ender_type')

    return ['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(enderType)
  }

  get Roles() {
    const { deal_type } = this.props.deal

    return ROLE_NAMES.filter(name => {
      if (
        (name === 'BuyerAgent' && deal_type === 'Buying') ||
        (name === 'SellerAgent' && deal_type === 'Selling')
      ) {
        return false
      }

      return true
    })
  }

  render() {
    const { isModalOpen, selectedRole } = this.state
    const { deal } = this.props

    return (
      <Container>
        <Downshift
          isOpen={this.state.showRolesMenu}
          onOuterClick={this.toggleRolesMenu}
        >
          {({ isOpen }) => (
            <div>
              <AddRole onClick={this.handleAddNewRole} noBackgroundHover>
                <RoleAvatar>
                  <img src="/static/images/deals/contact-add.png" alt="" />
                </RoleAvatar>

                <RoleInfo>
                  <RoleTitle>Add Contact</RoleTitle>
                </RoleInfo>
              </AddRole>

              {isOpen && (
                <RolesMenuContainer>
                  <RolesMenu>
                    {this.Roles.map((name, index) => (
                      <RolesMenuItem
                        key={index}
                        onClick={() => this.handleSelectRole(name)}
                      >
                        {roleName(name)}
                      </RolesMenuItem>
                    ))}
                  </RolesMenu>
                </RolesMenuContainer>
              )}
            </div>
          )}
        </Downshift>

        <RoleAgentIntegration
          deal={deal}
          allowedRoles={this.AllowedRoles}
          isDoubleEnded={this.isDoubleEnded}
          isPrimaryAgent={['BuyerAgent', 'SellerAgent'].includes(selectedRole)}
          isOpen={isModalOpen}
          modalTitle="Add to Deal"
          onHide={this.closeModal}
        />
      </Container>
    )
  }
}

function mapStateToProps({ contacts }) {
  return {
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(AddRoleForm)
