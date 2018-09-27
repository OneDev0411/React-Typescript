import React from 'react'
import PropTypes from 'prop-types'
import _ from 'underscore'

import { BasicDropdown } from '../BasicDropdown'

import { CheckBoxButton } from 'components/Button/CheckboxButton'
import { MenuItem } from './styled'

class MultiSelectDropdown extends React.Component {
  state = {
    selectedItems: this.props.defaultSelectedItems
  }

  get Items() {
    const { items, selectAllButton } = this.props

    if (selectAllButton) {
      return [
        {
          label: selectAllButton.label,
          selectAll: true
        },
        ...items
      ]
    }

    return items
  }

  handleOnChange = item => {
    let selectedItems = item.selectAll
      ? this.toggleSelectAll()
      : this.toggleSelectItem(item)

    if (selectedItems.length === 0) {
      selectedItems = this.props.forcedSelectedItemsOnDeselectAll
    }

    this.setState({
      selectedItems
    })

    this.props.onChange(selectedItems)
  }

  toggleSelectAll = () =>
    this.state.selectedItems.length === this.props.items.length
      ? []
      : _.pluck(this.props.items, 'value')

  toggleSelectItem = item => {
    const { selectedItems } = this.state

    if (selectedItems.includes(item.value)) {
      return selectedItems.filter(id => id !== item.value)
    }

    return [item.value, ...selectedItems]
  }

  getIsItemSelected = item => {
    if (
      item.selectAll &&
      this.state.selectedItems.length === this.props.items.length
    ) {
      return true
    }

    return this.state.selectedItems.includes(item.value)
  }

  render() {
    return (
      <BasicDropdown
        style={this.props.style}
        fullWidth={this.props.fullWidth}
        items={this.Items}
        onSelect={this.handleOnChange}
        buttonText={this.props.title}
        menuStyle={{
          zIndex: 6
        }}
        itemRenderer={({ item, ...rest }) => (
          <MenuItem
            appearance="link"
            key={item.label}
            style={{ width: '100%' }}
            hasDevider={item.selectAll}
            {...rest}
          >
            <CheckBoxButton
              isSelected={this.getIsItemSelected(item)}
              onClick={() => this.handleOnChange(item)}
              style={{
                marginRight: '1rem'
              }}
            />

            {item.label}
          </MenuItem>
        )}
      />
    )
  }
}

MultiSelectDropdown.propTypes = {
  title: PropTypes.string.isRequired,
  defaultSelectedItems: PropTypes.array,
  selectAllButton: PropTypes.object,
  fullWidth: PropTypes.bool,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  /* use this prop when you need to have some re-selected items 
  * when user deselects all options (see Calendar Filters for instnace)
  */
  forcedSelectedItemsOnDeselectAll: PropTypes.array
}

MultiSelectDropdown.defaultProps = {
  defaultSelectedItems: [],
  forcedSelectedItemsOnDeselectAll: [],
  fullWidth: true,
  selectAllButton: {
    label: 'Select All'
  }
}

export default MultiSelectDropdown
