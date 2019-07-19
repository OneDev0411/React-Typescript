import styled from 'styled-components'
import React from 'react'
import Downshift from 'downshift'
import Flex from 'styled-flex-component'

import { FilterItemToolTip, MissingValueToolTip } from './tooltip'
import { Container, List, ListItem } from './styled'
import Button from '../../../Button/ActionButton'
import { blue } from '../../../../utils/colors'
import Icon from '../../../SvgIcons/Add/AddIcon'

const IconAdd = styled(Icon)`
  fill: ${blue.A100};
  width: 1em;
  height: 1em;
`

const AddItem = styled(Button)`
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
    if (this.props.disabled) {
      return false
    }

    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen
    }))
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
    const { config, disabled } = this.props

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
                data-test="add-filter"
                appearance="link"
                onClick={this.toggleMenu}
                disabled={disabled}
              >
                <MissingValueToolTip enabled={disabled}>
                  <Flex alignCenter>
                    <IconAdd />
                    <span style={{ fontWight: 500 }}>Add Filter</span>
                  </Flex>
                </MissingValueToolTip>
              </AddItem>

              {isOpen && (
                <List depth={3}>
                  {config.map((item, index) => (
                    <FilterItemToolTip key={index} item={item}>
                      <ListItem
                        data-test={`add-filter-item-${item.label}`}
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
