import React from 'react'
import PropTypes from 'prop-types'

import { BasicDropdown } from 'components/BasicDropdown'
import {
  Input,
  DropdownButton,
  DropdownArrowIcon
} from 'components/inline-editable-fields/styled'

export class Label extends React.Component {
  static propTypes = {
    attribute: PropTypes.shape().isRequired,
    onChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    let labels
    let inputValue
    let selectedItem
    const { attribute } = props
    let { label, attribute_def } = attribute
    const DEFAULT_LABEL = { label: 'Select', value: '' }

    if (attribute_def.labels) {
      selectedItem = label ? { label, value: label } : DEFAULT_LABEL
      labels = [
        DEFAULT_LABEL,
        ...attribute_def.labels.map(label => ({
          label,
          value: label
        }))
      ]
    } else {
      inputValue = label || ''
    }

    this.state = {
      inputValue,
      selectedItem
    }

    this.labels = labels
  }

  onChangeLabel = selectedItem =>
    this.setState({ selectedItem }, () =>
      this.props.onChange(this.state.selectedItem.value)
    )

  onChangeInput = event =>
    this.setState({ inputValue: event.target.value }, () =>
      this.props.onChange(this.state.inputValue)
    )

  renderField() {
    if (this.labels) {
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
          onChange={this.onChangeLabel}
          selectedItem={this.state.selectedItem}
        />
      )
    }

    return (
      <Input
        type="text"
        onChange={this.onChangeInput}
        value={this.state.inputValue}
      />
    )
  }

  render() {
    return <div style={{ marginBottom: '0.5em' }}>{this.renderField()}</div>
  }
}
