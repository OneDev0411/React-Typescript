import React from 'react'
import PropTypes from 'prop-types'

import { BasicDropdown } from 'components/BasicDropdown'
import {
  DropdownButton,
  DropdownArrowIcon
} from 'components/inline-editable-fields/styled'

const DEFAULT_LABEL = { label: 'Select', value: '' }

export class SelectField extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
  }

  static defaultProps = {
    value: ''
  }

  constructor(props) {
    super(props)

    this.labels = [
      DEFAULT_LABEL,
      ...props.items.map(label => ({
        label,
        value: label
      }))
    ]

    const { value } = props
    let selectedItem = DEFAULT_LABEL

    if (value) {
      selectedItem = { label: value, value }
    }

    this.state = {
      selectedItem
    }
  }

  onChange = selectedItem =>
    this.setState({ selectedItem }, () =>
      this.props.onChange(this.state.selectedItem.value)
    )

  render() {
    return (
      <BasicDropdown
        buttonRenderer={buttonProps => (
          <DropdownButton {...buttonProps} isActive={buttonProps.isOpen}>
            {buttonProps.selectedItem.label}
            <DropdownArrowIcon isOpen={buttonProps.isOpen} />
          </DropdownButton>
        )}
        fullHeight
        items={this.labels}
        onChange={this.onChange}
        selectedItem={this.state.selectedItem}
      />
    )
  }
}
