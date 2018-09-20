import React from 'react'
import Downshift from 'downshift'

import { Container, LabelButton, List, ListItem } from './styled'

export default class DropDownList extends React.Component {
  state = {
    isMenuOpen: false
  }

  toggleMenu = () => this.setState({ isMenuOpen: !this.state.isMenuOpen })

  get LabelValue() {
    const { selectedValue, placeholder, options } = this.props

    const selectedItem = options.find(item => item.value === selectedValue)

    if (selectedItem) {
      return selectedItem.label
    }

    return placeholder
  }

  onSelect = item => {
    this.props.onChange(item)
    this.setState({ isMenuOpen: false })
  }

  render() {
    const { options, selectedValue } = this.props
    const { isMenuOpen } = this.state

    return (
      <Container>
        <Downshift
          isOpen={isMenuOpen}
          onSelect={this.onSelect}
          itemToString={item => (item ? item.value : '')}
          onOuterClick={this.toggleMenu}
        >
          {({ isOpen, getItemProps }) => (
            <div>
              <LabelButton type="button" onClick={this.toggleMenu}>
                {this.LabelValue}
                <i className={`fa fa-angle-${isOpen ? 'up' : 'down'}`} />
              </LabelButton>

              {isOpen && (
                <List>
                  {options.map((item, index) => (
                    <ListItem
                      key={index}
                      isSelected={selectedValue === item.value}
                      {...getItemProps({
                        index,
                        item
                      })}
                    >
                      {item.label}
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          )}
        </Downshift>
      </Container>
    )
  }
}
