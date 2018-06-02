import React from 'react'
import Downshift from 'downshift'
import _ from 'underscore'

import {
  Container,
  List,
  ListItem,
  ListItemTitle,
  SelectedItem,
  ListItemIconContainer,
  ItemsContainer,
  InputContainer,
  Input,
  InputIndicator
} from './styled'

export class DropDownList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isMenuOpen: false,
      selectedItems: this.getDefaultSelectedItem(),
      filterValue: null
    }
  }

  toggleMenu = () => this.setState({ isMenuOpen: !this.state.isMenuOpen })

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
      return {
        [item.value]: item
      }
    }

    if (selectedItems[item.value]) {
      return _.omit(selectedItems, i => i.value === item.value)
    }

    return {
      ...selectedItems,
      [item.value]: item
    }
  }

  onInputValueChange = value =>
    this.setState({ filterValue: value.trim(), isMenuOpen: true })

  getFilteredOptions = filter => {
    const { options } = this.props

    if (!filter) {
      return options
    }

    return options.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
  }

  isItemSelected = item => {
    const { selectedItems } = this.state

    return selectedItems[item.value] !== undefined
  }

  getDefaultInputValue = () => {
    const { defaultValue, conditions } = this.props

    if (conditions && conditions.length > 0) {
      return conditions[0].value
    }

    if (defaultValue) {
      return defaultValue
    }

    return ''
  }

  getDefaultSelectedItem = () => {
    const { conditions, defaultValue } = this.props

    if (conditions && conditions.length > 0) {
      return _.indexBy(conditions, 'value')
    }

    if (defaultValue) {
      return {
        [defaultValue]: {
          name: defaultValue,
          value: defaultValue
        }
      }
    }

    return {}
  }

  render() {
    const { isMenuOpen, filterValue, selectedItems } = this.state
    const { allowMultipleSelections } = this.props

    return (
      <Container>
        <Downshift
          isOpen={isMenuOpen}
          defaultInputValue={this.getDefaultInputValue()}
          itemToString={item => (item ? item.value : '')}
          onChange={this.onSelectItem}
          onOuterClick={this.toggleMenu}
          onInputValueChange={this.onInputValueChange}
        >
          {({ isOpen, getInputProps, getItemProps }) => (
            <div>
              <ItemsContainer>
                {allowMultipleSelections &&
                  _.map(selectedItems, item => (
                    <SelectedItem
                      key={item.value}
                      onClick={() => this.onSelectItem(item)}
                    >
                      {item.name}
                    </SelectedItem>
                  ))}

                <InputContainer
                  withMargin={
                    allowMultipleSelections && _.size(selectedItems) > 0
                  }
                >
                  <Input
                    {...getInputProps({
                      placeholder: 'Select'
                    })}
                    onClick={this.toggleMenu}
                  />

                  <InputIndicator
                    className={`fa fa-caret-${isMenuOpen ? 'up' : 'down'}`}
                  />
                </InputContainer>
              </ItemsContainer>

              {isOpen && (
                <List>
                  {this.getFilteredOptions(filterValue).map((item, index) => (
                    <ListItem
                      key={index}
                      isSelected={this.isItemSelected(item)}
                      {...getItemProps({
                        index,
                        item
                      })}
                    >
                      <ListItemTitle>{item.name}</ListItemTitle>
                      <ListItemIconContainer>
                        {this.isItemSelected(item) && (
                          <i className="fa fa-check" />
                        )}
                      </ListItemIconContainer>
                    </ListItem>
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
