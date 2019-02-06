import React from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'
import { Field } from 'react-final-form'

import { Item } from 'components/Dropdown/Item'

import { Container, List, Label, Input } from './styled'

const propTypes = {
  width: PropTypes.number,
  style: PropTypes.shape(),
  validate: PropTypes.func,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
}

const defaultProps = {
  width: 20,
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
      <Container width={this.props.width} style={this.props.style}>
        <Label htmlFor={id}>{this.props.label}</Label>

        <Downshift
          {...input}
          onInputValueChange={this.onInputValueChange}
          itemToString={this.handleItemToString}
          selectedItem={input.value}
          render={({
            getItemProps,
            highlightedIndex,
            getInputProps,
            inputValue,
            isOpen,
            selectedItem
          }) => {
            const filteredItems = matchSorter(items, inputValue, {
              keys: ['title', 'value'],
              maxRanking: matchSorter.rankings.STARTS_WITH
            })

            return (
              <div style={{ position: 'relative' }}>
                <Input
                  {...getInputProps({
                    name: input.name,
                    autoComplete: 'off'
                  })}
                />

                {isOpen && !!filteredItems.length && (
                  <List>
                    {filteredItems.map(({ title, value }, index) => (
                      <Item
                        key={index}
                        {...getItemProps({
                          item: value,
                          isSelected: selectedItem === value,
                          isActive: highlightedIndex === index
                        })}
                      >
                        {title}
                      </Item>
                    ))}
                  </List>
                )}
              </div>
            )
          }}
        />
      </Container>
    )
  }
}

AutocompleteField.propTypes = propTypes
AutocompleteField.defaultProps = defaultProps

export function AutocompleteField(props) {
  return <Field {...props} component={AutocompleteFieldComponent} />
}
