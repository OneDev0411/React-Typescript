import React from 'react'
import PropTypes from 'prop-types'

import { InlineSelectField } from 'components/inline-editable-fields/InlineSelectField'

import { getValue, getLabel } from '../helpers'
import { formatPreSave } from './format-pre-save'

export class SelectField extends React.Component {
  static propTypes = {
    attribute: PropTypes.shape().isRequired,
    format: PropTypes.func,
    parse: PropTypes.func,
    validate: PropTypes.func
  }

  static defaultProps = {
    format: t => t,
    parse: t => t,
    validate() {}
  }

  label = getLabel(this.props.attribute)

  items = [
    {
      label: 'Select',
      value: ''
    },
    ...this.props.attribute.attribute_def.enum_values.map(label => ({
      label,
      value: label
    }))
  ]

  get defaultSelectedItem() {
    let value = getValue(this.props.attribute)
    let label = value

    if (!value || value === '-') {
      label = 'Select'
      value = ''
    }

    return {
      label,
      value
    }
  }

  save = async value =>
    this.props.handleSave(formatPreSave(this.props.attribute, value))

  delete = async () => this.props.handleDelete(this.props.attribute)

  render() {
    return (
      <InlineSelectField
        defaultSelectedItem={this.defaultSelectedItem}
        items={this.items}
        label={this.label}
        handleSave={this.save}
        handleDelete={this.delete}
        showDelete={!!this.props.attribute.id}
      />
    )
  }
}
