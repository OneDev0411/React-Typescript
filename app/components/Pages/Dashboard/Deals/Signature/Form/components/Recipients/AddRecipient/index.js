import React from 'react'
import Downshift from 'downshift'

import ActionButton from 'components/Button/ActionButton'

import { primary } from 'views/utils/colors'
import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import Roles from '../../../../../components/Roles'

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
        <Downshift isOpen={this.state.isMenuOpen} onOuterClick={this.closeMenu}>
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
                    disableAddRole
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
