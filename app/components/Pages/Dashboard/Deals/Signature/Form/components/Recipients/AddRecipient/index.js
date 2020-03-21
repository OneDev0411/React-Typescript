import React from 'react'
import Downshift from 'downshift'

import { Button } from '@material-ui/core'

import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

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
              <Button color="secondary" onClick={this.toggleOpenMenu}>
                <IconAdd style={{ marginRight: '1rem' }} />
                Add New Recipient
              </Button>

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
                      <Button color="secondary" {...props}>
                        <IconAdd style={{ marginRight: '1rem' }} />
                        Add Contact
                      </Button>
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
