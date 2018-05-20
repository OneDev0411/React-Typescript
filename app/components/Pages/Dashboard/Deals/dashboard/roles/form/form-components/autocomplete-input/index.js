import React, { Component } from 'react'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'
import { TextInput } from '../../../../../../../../../views/components/Forms/TextInput'
import {
  AutoCompleteInputContainer,
  AutoCompleteInputOptions,
  AutoCompleteInputItem
} from '../../styles'

export class AutoCompleteInput extends Component {
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
      input,
      meta,
      placeholder,
      isRequired,
      items,
      defaultSelectedItem
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
          getInputProps,
          inputValue,
          isOpen,
          selectedItem
        }) => (
          <div>
            <AutoCompleteInputContainer>
              <TextInput
                meta={meta}
                isRequired={isRequired}
                placeholder={placeholder}
                {...getInputProps({
                  ...input
                })}
              />

              {isOpen &&
                items && (
                  <AutoCompleteInputOptions>
                    {(inputValue ? matchSorter(items, inputValue) : items).map(
                      (item, index) => (
                        <AutoCompleteInputItem
                          key={item}
                          {...getItemProps({
                            item,
                            isSelected: selectedItem === item,
                            isActive: highlightedIndex === index
                          })}
                        >
                          {item}
                        </AutoCompleteInputItem>
                      )
                    )}
                  </AutoCompleteInputOptions>
                )}
            </AutoCompleteInputContainer>
          </div>
        )}
      />
    )
  }
}
