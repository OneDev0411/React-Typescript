import styled from 'styled-components'
import React from 'react'
import Downshift from 'downshift'

import Button from '@material-ui/core/Button'

import { FilterItemToolTip } from './tooltip'
import { Container, List, ListItem } from './styled'
import Icon from '../../../SvgIcons/Add/AddIcon'

const IconAdd = styled(Icon)`
  fill: #000;
  width: 1.3em;
  height: 1.3em;
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
              <Button
                variant="outlined"
                size="small"
                data-test="add-filter"
                onClick={this.toggleMenu}
                disabled={disabled}
              >
                <IconAdd />
                <span style={{ fontWight: 500 }}>Add Filter</span>
              </Button>

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
