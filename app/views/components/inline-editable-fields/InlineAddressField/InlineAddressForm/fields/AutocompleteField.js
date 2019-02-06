import React from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { Item } from 'components/Dropdown/Item'
import IconDropDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import { Container } from '../styled'
import { Label, Input, Button } from './styled'

const propTypes = {
  style: PropTypes.shape(),
  validate: PropTypes.func,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
}

const defaultProps = {
  style: {},
  validate() {}
}

class AutocompleteFieldComponent extends React.Component {
  onInputValueChange = value => this.props.input.onChange(value)

  handleItemToString = item => item || ''

  render() {
    const { items, input } = this.props
    const id = `${this.props.name}_text-field`

    return (
      <div style={this.props.style}>
        <Label htmlFor={id}>{this.props.label}</Label>

        <Downshift
          {...input}
          onInputValueChange={this.onInputValueChange}
          itemToString={this.handleItemToString}
          selectedItem={input.value}
          render={({
            getItemProps,
            highlightedIndex,
            getButtonProps,
            getInputProps,
            inputValue,
            isOpen,
            selectedItem
          }) => {
            const filteredItems = matchSorter(items, inputValue, {
              keys: ['label'],
              maxRanking: matchSorter.rankings.STARTS_WITH
            })

            return (
              <div style={{ position: 'relative' }}>
                <Flex>
                  <Input
                    {...getInputProps({
                      name: input.name,
                      autoComplete: 'off'
                    })}
                  />
                  <Button
                    isFit
                    isOpen={isOpen}
                    iconSize="large"
                    {...getButtonProps()}
                  >
                    <IconDropDown />
                  </Button>
                </Flex>

                {isOpen && !!filteredItems.length && (
                  <Container
                    style={{
                      overflowY: 'auto',
                      maxHeight: '10rem',
                      top: 'calc(100% - 1rem)'
                    }}
                  >
                    {filteredItems.map(({ label, value }, index) => (
                      <Item
                        key={index}
                        {...getItemProps({
                          item: value,
                          isSelected: selectedItem === value,
                          isActive: highlightedIndex === index
                        })}
                      >
                        {label}
                      </Item>
                    ))}
                  </Container>
                )}
              </div>
            )
          }}
        />
      </div>
    )
  }
}

AutocompleteField.propTypes = propTypes
AutocompleteField.defaultProps = defaultProps

export function AutocompleteField(props) {
  return <Field {...props} component={AutocompleteFieldComponent} />
}
