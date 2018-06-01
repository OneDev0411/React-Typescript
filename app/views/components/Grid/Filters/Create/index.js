import React from 'react'
import Downshift from 'downshift'

import { Container, List, ListItem, AddItem } from './styled'

export class AddFilter extends React.Component {
  state = {
    isMenuOpen: false
  }

  toggleMenu = () =>
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    })

  onSelectFilter = item => {
    this.setState({
      isMenuOpen: false
    })

    this.props.onNewFilter({
      name: item.name
    })
  }

  render() {
    const { isMenuOpen } = this.state
    const { config } = this.props

    return (
      <Container>
        <Downshift
          isOpen={isMenuOpen}
          onSelect={this.onSelectFilter}
          itemToString={item => (item ? item.value : '')}
          onOuterClick={this.toggleMenu}
        >
          {({ isOpen, getItemProps }) => (
            <div>
              <AddItem onClick={this.toggleMenu}>+ Add Filter</AddItem>

              {isOpen && (
                <List>
                  {config.map((item, index) => (
                    <ListItem
                      key={index}
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
