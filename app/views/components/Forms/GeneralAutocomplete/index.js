import React, { Component } from 'react'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'

import { Input, List, Item, ArrowDownIcon } from './styled'
import Button from '../../Button/IconButton'

export class GeneralAutocomplete extends Component {
  constructor(props) {
    super(props)

    const { items, defaultSelectedItem } = props

    this.state = {
      selectedItem: items.includes(defaultSelectedItem)
        ? defaultSelectedItem
        : items[0]
    }
  }

  onChange = selectedItem => {
    this.setState({ selectedItem })
    this.props.input.onChange(selectedItem)
  }

  handleItemToString = item => (typeof item !== 'string' ? '' : item)

  render() {
    const {
      defaultSelectedItem,
      fixedHeight,
      input,
      isRequired,
      items,
      meta,
      placeholder
    } = this.props

    const { selectedItem } = this.state

    return (
      <Downshift
        selectedItem={selectedItem}
        onChange={this.onChange}
        itemToString={this.handleItemToString}
        defaultSelectedItem={defaultSelectedItem || input.value}
        onInputValueChange={this.onChange}
        render={({
          getItemProps,
          highlightedIndex,
          getButtonProps,
          getInputProps,
          inputValue,
          isOpen,
          selectedItem
        }) => (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex' }}>
              <Input
                meta={meta}
                isRequired={isRequired}
                placeholder={placeholder}
                {...getInputProps({
                  ...input
                })}
              />
              <Button {...getButtonProps()}>
                <ArrowDownIcon isOpen={isOpen} />
              </Button>
            </div>

            {isOpen &&
              items && (
                <List fixedHeight={fixedHeight}>
                  {(inputValue ? matchSorter(items, inputValue) : items).map(
                    (item, index) => (
                      <Item
                        key={item}
                        {...getItemProps({
                          item,
                          isSelected: selectedItem === item,
                          isActive: highlightedIndex === index
                        })}
                      >
                        {item}
                      </Item>
                    )
                  )}
                </List>
              )}
          </div>
        )}
      />
    )
  }
}
