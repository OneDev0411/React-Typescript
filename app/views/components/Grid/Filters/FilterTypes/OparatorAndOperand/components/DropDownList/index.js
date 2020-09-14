import React from 'react'
import Downshift from 'downshift'
import { mdiChevronUp } from '@mdi/js'

import { Item } from 'components/Dropdown/Item'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { List, ItemsContainer, InputContainer, Input } from './styled'

export class DropDownList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isMenuOpen: false,
      filterValue: null,
      inputFocused: false
    }
  }

  toggleMenu = () => this.setState(state => ({ isMenuOpen: !state.isMenuOpen }))

  onSelectItem = selectedItem => {
    this.setState(
      {
        filterValue: null,
        isMenuOpen: this.props.allowMultipleSelections
      },
      () => this.props.onFilterChange([selectedItem])
    )
  }

  onInputValueChange = value => {
    this.setState({
      filterValue: value,
      isMenuOpen: true
    })
  }

  getFilteredOptions = filter => {
    const { options } = this.props

    if (!filter) {
      return options
    }

    return options.filter(item =>
      item.value.toLowerCase().includes(filter.toLowerCase())
    )
  }

  getDefaultValue = () => {
    const { values } = this.props

    if (values && values.length > 0) {
      return values[0].label
    }

    return ''
  }

  render() {
    const { isMenuOpen, filterValue } = this.state
    const defaultValue = this.getDefaultValue()

    return (
      <div style={{ position: 'relative' }}>
        <Downshift
          itemToString={item => (item ? item.label : '')}
          isOpen={isMenuOpen}
          defaultInputValue={defaultValue}
          onSelect={this.onSelectItem}
          onOuterClick={this.toggleMenu}
          onInputValueChange={this.onInputValueChange}
        >
          {({ isOpen, getInputProps, getItemProps, highlightedIndex }) => (
            <div>
              <ItemsContainer>
                <InputContainer
                  inputFocused={this.state.inputFocused}
                  onClick={this.toggleMenu}
                >
                  <Input
                    {...getInputProps({
                      placeholder: 'Select'
                    })}
                    onFocus={() => this.setState({ inputFocused: true })}
                    onBlur={() => this.setState({ inputFocused: false })}
                    data-test="open-filters-list"
                  />
                  <SvgIcon path={mdiChevronUp} rotate={isMenuOpen ? 0 : 180} />
                </InputContainer>
              </ItemsContainer>

              {isOpen && (
                <List
                  data-test="filter-items-list"
                  depth={3}
                  className="u-scrollbar--thinner--self"
                >
                  {this.getFilteredOptions(filterValue).map((item, index) => (
                    <Item
                      data-test={`filter-item-${item.label}`}
                      key={index}
                      {...getItemProps({
                        index,
                        item,
                        isActive: index === highlightedIndex,
                        isSelected: item.label === defaultValue
                      })}
                    >
                      {item.label}
                    </Item>
                  ))}
                </List>
              )}
            </div>
          )}
        </Downshift>
      </div>
    )
  }
}
