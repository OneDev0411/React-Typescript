import React, { Component } from 'react'
import ClickOutside from 'react-click-outside'
import ShadowButton from '../Button/ShadowButton'
import Card from '../Card'

const ToggleButton = ShadowButton.extend`
  &:focus {
    outline: none;
  }
`

class DropDown extends Component {
  state = {
    isOpen: false
  }

  toggleMenu = (event, isOpen) => {
    event.preventDefault()

    this.setState({ isOpen })
  }

  closeMenu = () => {
    this.setState({ isOpen: false })
  }

  render() {
    const { isOpen } = this.state
    const { items, renderItem, renderToggleButton } = this.props

    return (
      <ClickOutside
        onClickOutside={this.closeMenu}
        style={{ position: 'relative' }}
      >
        <ToggleButton onClick={event => this.toggleMenu(event, !isOpen)}>
          {renderToggleButton(isOpen)}
        </ToggleButton>

        {isOpen ? (
          <Card
            depth={3}
            style={{
              position: 'absolute',
              left: 0,
              top: '100%',
              zIndex: 1,
              padding: 0,
              margin: '2px 0 0'
            }}
          >
            {items.map(item => renderItem(item, this.closeMenu))}
          </Card>
        ) : null}
      </ClickOutside>
    )
  }
}

export default DropDown
