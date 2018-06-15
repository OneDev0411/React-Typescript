import React from 'react'
import Downshift from 'downshift'

import { FilterItemToolTip, MissingValueToolTip } from './tooltip'
import { Container, List, ListItem, AddItem } from './styled'

export class AddFilter extends React.Component {
  state = {
    isMenuOpen: false
  }

  toggleMenu = () => {
    if (this.props.hasMissingValue) {
      return false
    }

    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    })
  }

  onSelectFilter = item => {
    this.setState({
      isMenuOpen: false
    })

    this.props.onNewFilter({
      id: item.id
    })
  }

  render() {
    const { isMenuOpen } = this.state
    const { config, hasMissingValue } = this.props

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
              <AddItem onClick={this.toggleMenu} disabled={hasMissingValue}>
                <MissingValueToolTip enabled={hasMissingValue}>
                  <span>+ Add Filter</span>
                </MissingValueToolTip>
              </AddItem>

              {isOpen && (
                <List>
                  {config.map((item, index) => (
                    <FilterItemToolTip key={index} item={item}>
                      <ListItem
                        {...getItemProps({
                          index,
                          item
                        })}
                      >
                        {item.label}
                      </ListItem>
                    </FilterItemToolTip>
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
