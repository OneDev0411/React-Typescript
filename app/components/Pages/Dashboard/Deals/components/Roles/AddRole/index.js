import React from 'react'
import { connect } from 'react-redux'

import { Box, Typography, MenuItem } from '@material-ui/core'

import { mdiAccountPlusOutline } from '@mdi/js'

import Deal from 'models/Deal'
import { BaseDropdown } from 'components/BaseDropdown'
import { Avatar } from 'components/Avatar'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { ROLE_NAMES, roleName, isPrimaryAgent } from '../../../utils/roles'

import RoleAgentIntegration from '../AgentIntegration'

import { Container, RoleButton, MenuContainer } from './styled'

class AddRoleForm extends React.Component {
  state = {
    isFormOpen: false,
    selectedRole: null
  }

  closeDrawer = () => {
    this.setState({
      isFormOpen: false,
      selectedRole: null
    })

    if (this.props.onCloseDrawer) {
      this.props.onCloseDrawer()
    }
  }

  handleSelectRole = item =>
    this.setState({
      isFormOpen: true,
      selectedRole: item ? item.value : null
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

  get RoleItems() {
    const roles = this.AllowedRoles || ROLE_NAMES

    return roles
      .filter(name => !isPrimaryAgent(name, this.props.deal.deal_type))
      .map(name => ({
        label: roleName(name),
        value: name
      }))
  }

  get dealEnderType() {
    return Deal.get.field(this.props.deal, 'ender_type')
  }

  get isDoubleEnded() {
    return ['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(
      this.dealEnderType
    )
  }

  itemToString = item => item.label

  render() {
    const roleItems = this.RoleItems

    if (roleItems.length === 0) {
      return false
    }

    return (
      <Container>
        {this.props.actionRenderer ? (
          this.props.actionRenderer({
            disabled: roleItems.length === 0,
            onClick: this.handleSelectRole
          })
        ) : (
          <BaseDropdown
            PopperProps={{
              style: {
                width: '18rem',
                zIndex: 1
              }
            }}
            disablePortal
            renderDropdownButton={buttonProps => (
              <RoleButton {...buttonProps}>
                <Box mr={1}>
                  <Avatar
                    size="small"
                    style={{
                      backgroundColor: '#EAF4FC'
                    }}
                  >
                    <SvgIcon
                      path={mdiAccountPlusOutline}
                      size={muiIconSizes.small}
                      color="#0945EB" // TODO: use theme after component refactoring
                    />
                  </Avatar>
                </Box>
                <Typography variant="body2">Add a new contact</Typography>
              </RoleButton>
            )}
            renderMenu={({ close }) => (
              <MenuContainer>
                {roleItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      close()
                      this.handleSelectRole(item)
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </MenuContainer>
            )}
          />
        )}

        {this.state.isFormOpen && (
          <RoleAgentIntegration
            deal={this.props.deal}
            allowedRoles={this.AllowedRoles}
            isEmailRequired={this.props.isEmailRequired}
            dealEnderType={this.dealEnderType}
            showBrokerageFields={this.props.showBrokerageFields}
            isPrimaryAgent={['BuyerAgent', 'SellerAgent'].includes(
              this.state.selectedRole
            )}
            onUpsertRole={this.props.onCreateRole}
            onClose={this.closeDrawer}
          />
        )}
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
