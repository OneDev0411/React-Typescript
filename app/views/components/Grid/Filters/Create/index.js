import styled from 'styled-components'
import React from 'react'
import Downshift from 'downshift'
import { mdiPlus } from '@mdi/js'
import Button from '@material-ui/core/Button'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { FilterItemTooltip } from './tooltip'
import { Container, List, ListItem } from './styled'

const IconAdd = styled(SvgIcon)`
  color: ${props =>
    !props.disabled
      ? props.theme.palette.secondary.main
      : props.theme.palette.action.disabled};
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
                color="secondary"
                size="small"
                data-test="add-filter"
                onClick={this.toggleMenu}
                disabled={disabled}
              >
                <IconAdd path={mdiPlus} disabled={disabled} />
                <span style={{ fontWight: 500 }}>Add Filter</span>
              </Button>

              {isOpen && (
                <List depth={3}>
                  {config.map((item, index) => (
                    <FilterItemTooltip key={index} item={item}>
                      <ListItem
                        data-test={`add-filter-item-${item.label}`}
                        {...getItemProps({
                          index,
                          item
                        })}
                      >
                        {item.label}
                      </ListItem>
                    </FilterItemTooltip>
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
