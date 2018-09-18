import React from 'react'
import Downshift from 'downshift'
import Flex from 'styled-flex-component'

import { FilterItemToolTip, MissingValueToolTip } from './tooltip'
import { Container, List, ListItem } from './styled'
import Button from '../../../Button/ActionButton'
import { blue } from '../../../../utils/colors'
import Icon from '../../../SvgIcons/Add/AddIcon'

const IconAdd = Icon.extend`
  fill: ${blue.A100};
  width: 1em;
  height: 1em;
`

const AddItem = Button.extend`
  padding: 0;
  margin-right: 1em;

  &:hover > svg {
    fill: ${blue.A200};
  }
`

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
              <AddItem
                appearance="link"
                onClick={this.toggleMenu}
                disabled={hasMissingValue}
              >
                <MissingValueToolTip enabled={hasMissingValue}>
                  <Flex alignCenter>
                    <IconAdd />
                    <span>Add Filter</span>
                  </Flex>
                </MissingValueToolTip>
              </AddItem>

              {isOpen && (
                <List depth={3}>
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
