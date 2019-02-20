import React from 'react'
import PropTypes from 'prop-types'

import { InlineTextField } from 'components/inline-editable-fields/InlineTextField'

import { getValue, getLabel } from '../helpers'
import { formatPreSave } from './format-pre-save'

export class TextField extends React.Component {
  static propTypes = {
    attribute: PropTypes.shape().isRequired,
    format: PropTypes.func,
    parse: PropTypes.func,
    placeholder: PropTypes.string,
    validate: PropTypes.func
  }

  static defaultProps = {
    format: t => t,
    parse: t => t,
    placeholder: '',
    validate() {}
  }

  save = async value =>
    this.props.handleSave(formatPreSave(this.props.attribute, value))

  delete = async () => this.props.handleDelete(this.props.attribute)

  render() {
    const { attribute } = this.props

    return (
      <InlineTextField
        label={getLabel(attribute)}
        value={getValue(attribute)}
        handleSave={this.save}
        handleDelete={this.delete}
        showDelete={!!attribute.id}
      />
    )
  }
}
