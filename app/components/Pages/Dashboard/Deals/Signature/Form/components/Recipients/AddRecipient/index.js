import React from 'react'
import Downshift from 'downshift'

import ActionButton from 'components/Button/ActionButton'

import { primary } from 'views/utils/colors'
import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import LinkButton from 'components/Button/LinkButton'

import Roles from '../../../../../components/Roles'

import { Container, Menu } from './styled'

export class AddRecipient extends React.Component {
  state = {
    isMenuOpen: false,
    isOuterClickLocked: false
  }

  toggleOpenMenu = () =>
    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen,
      isOuterClickLocked: false
    }))

  closeMenu = () =>
    this.setState({
      isMenuOpen: false,
      isOuterClickLocked: false
    })

  handleAddRecipient = recipient => {
    this.closeMenu()

    this.props.onAddRecipient(recipient)
  }

  handleCreateNewRole = props => {
    this.setState({
      isOuterClickLocked: true
    })

    props.onClick()
  }

  handleUnlockOuterClick = () =>
    this.setState({
      isOuterClickLocked: false
    })

  handleOuterClick = () => {
    if (!this.state.isOuterClickLocked) {
      this.closeMenu()
    }
  }

  render() {
    return (
      <Container>
        <Downshift
          isOpen={this.state.isMenuOpen}
          onOuterClick={this.handleOuterClick}
        >
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
                <span style={{ fontWeight: 500 }}>Add next Recipient</span>
              </ActionButton>

              {isOpen && (
                <Menu>
                  <Roles
                    showTitle={false}
                    deal={this.props.deal}
                    isEmailRequired
                    allowDeleteRole={false}
                    onSelect={this.handleAddRecipient}
                    onCloseAddRoleDrawer={this.handleUnlockOuterClick}
                    onCreateRole={this.handleUnlockOuterClick}
                    addRoleActionRenderer={props => (
                      <LinkButton
                        onClick={() => this.handleCreateNewRole(props)}
                        style={{
                          padding: 0
                        }}
                      >
                        <span style={{ marginRight: '0.5rem' }}>+</span>
                        Add New Email
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
