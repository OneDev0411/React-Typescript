import React from 'react'
import Downshift from 'downshift'
import _ from 'underscore'

import { Item } from 'components/Dropdown/Item'
import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import IconKeyboardArrowUp from 'components/SvgIcons/KeyboardArrowUp/IconKeyboardArrowUp'

import {
  List,
  SelectedItem,
  ItemsContainer,
  InputContainer,
  Input
} from './styled'

export class DropDownList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isMenuOpen: false,
      selectedItems: this.getDefaultSelectedItem(),
      filterValue: null,
      inputFocused: false
    }
  }

  getDefaultSelectedItem = () => {
    const { values, defaultValue } = this.props

    if (values && values.length > 0) {
      return values
    }

    if (defaultValue) {
      return [defaultValue]
    }

    return []
  }

  toggleMenu = () => this.setState(state => ({ isMenuOpen: !state.isMenuOpen }))

  onSelectItem = item => {
    const selectedItems = this.getNewSelectedItems(item)

    this.setState({
      filterValue: null,
      isMenuOpen: this.props.allowMultipleSelections,
      selectedItems
    })

    this.props.onFilterChange(selectedItems)
  }

  getNewSelectedItems = item => {
    const { selectedItems } = this.state
    const { allowMultipleSelections } = this.props

    if (allowMultipleSelections === false) {
      return [item]
    }

    if (selectedItems.includes(item)) {
      return _.without(selectedItems, item)
    }

    return [...selectedItems, item]
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

  isItemSelected = item =>
    this.state.selectedItems.some(({ value }) => value === item.value)

  getDefaultInputValue = () => {
    const { defaultValue, values } = this.props

    if (values && values.length > 0) {
      return values[0].label
    }

    if (defaultValue) {
      return defaultValue
    }

    return ''
  }

  render() {
    const { isMenuOpen, filterValue, selectedItems } = this.state
    const { allowMultipleSelections } = this.props

    return (
      <div style={{ position: 'relative' }}>
        <Downshift
          itemToString={item => (item ? item.label : '')}
          isOpen={isMenuOpen}
          defaultInputValue={this.getDefaultInputValue()}
          onSelect={this.onSelectItem}
          onOuterClick={this.toggleMenu}
          onInputValueChange={this.onInputValueChange}
        >
          {({ isOpen, getInputProps, getItemProps }) => (
            <div>
              <ItemsContainer selectedItems={selectedItems}>
                {allowMultipleSelections &&
                  selectedItems.map((item, index) => (
                    <SelectedItem
                      key={index}
                      onClick={() => this.onSelectItem(item)}
                    >
                      {item.label}
                    </SelectedItem>
                  ))}

                <InputContainer
                  withMargin={
                    allowMultipleSelections && selectedItems.length > 0
                  }
                  inputFocused={this.state.inputFocused}
                  onClick={this.toggleMenu}
                >
                  <Input
                    {...getInputProps({
                      placeholder: 'Select'
                    })}
                    onFocus={() => this.setState({ inputFocused: true })}
                    onBlur={() => this.setState({ inputFocused: false })}
                  />
                  {isMenuOpen ? (
                    <IconKeyboardArrowUp />
                  ) : (
                    <IconKeyboardArrowDown />
                  )}
                </InputContainer>
              </ItemsContainer>

              {isOpen && (
                <List depth={3} className="u-scrollbar--thinner--self">
                  {this.getFilteredOptions(filterValue).map((item, index) => (
                    <Item
                      key={index}
                      {...getItemProps({
                        index,
                        item,
                        isSelected: this.isItemSelected(item)
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
