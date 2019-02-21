import React from 'react'
import PropTypes from 'prop-types'

import { InlineDateField } from 'components/inline-editable-fields/InlineDateField'

import { getValue, getLabel } from '../helpers'
import { formatPreSave } from './format-pre-save'

export class DateField extends React.Component {
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

  get date() {
    return getValue(this.props.attribute)
  }

  save = async value =>
    this.props.handleSave(formatPreSave(this.props.attribute, value))

  delete = async () => this.props.handleDelete(this.props.attribute)

  render() {
    return (
      <InlineDateField
        date={this.date}
        label={this.label}
        handleSave={this.save}
        handleDelete={this.delete}
        showDelete={!!this.props.attribute.id}
      />
    )
  }
}
