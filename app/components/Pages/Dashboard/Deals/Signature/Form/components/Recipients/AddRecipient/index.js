import React from 'react'
import Downshift from 'downshift'

import ActionButton from 'components/Button/ActionButton'

import { primary } from 'views/utils/colors'
import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import LinkButton from 'components/Button/LinkButton'

import Roles from 'deals/components/Roles'

import { Container, Menu } from './styled'

export class AddRecipient extends React.Component {
  state = {
    isMenuOpen: false
  }

  toggleOpenMenu = () =>
    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen
    }))

  closeMenu = () =>
    this.setState({
      isMenuOpen: false
    })

  handleAddRecipient = recipient => {
    this.closeMenu()

    this.props.onAddRecipient(recipient)
  }

  render() {
    return (
      <Container>
        <Downshift isOpen={this.state.isMenuOpen}>
          {({ isOpen }) => (
            <div>
              <ActionButton
                appearance="link"
                type="button"
                onClick={this.toggleOpenMenu}
                style={{
                  justifyContent: 'flex-start',
                  padding: 0,
                  margin: 0
                }}
              >
                <IconAdd style={{ fill: primary, marginRight: '1rem' }} />
                <span style={{ fontWeight: 500 }}>Add New Recipient</span>
              </ActionButton>

              {isOpen && (
                <Menu>
                  <Roles
                    showEmail
                    isEmailRequired
                    showTitle={false}
                    deal={this.props.deal}
                    allowDeleteRole={false}
                    filter={role => !this.props.selectedRoles[role.id]}
                    onSelect={this.handleAddRecipient}
                    onUpsertRole={this.handleAddRecipient}
                    onCreateRole={this.handleAddRecipient}
                    addRoleActionRenderer={props => (
                      <LinkButton
                        {...props}
                        style={{
                          padding: 0
                        }}
                      >
                        <span style={{ marginRight: '0.5rem' }}>+</span>
                        Add Contact
                      </LinkButton>
                    )}
                  />
                </Menu>
              )}
            </div>
          )}
        </Downshift>
      </Container>
    )
  }
}
