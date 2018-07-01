import React from 'react'

import Dropdown from '../../components/Dropdown'

class Title extends React.Component {
  handleOnSelect = text => {
    this.props.onChange({ ...this.props.field, text })
  }

  getOptions = field => {
    const options = {}

    if (
      !field ||
      !field.attribute_def ||
      !Array.isArray(field.attribute_def.enum_values)
    ) {
      return options
    }

    field.attribute_def.enum_values.forEach(value => {
      options[value] = {
        name: value,
        title: value
      }
    })

    return options
  }

  render() {
    const { field, disabled } = this.props

    return (
      <div className="c-contact-details-item" style={{ marginBottom: '1em' }}>
        <label className="c-contact-details-item__label">Title</label>
        <span
          style={{ paddingLeft: '4px' }}
          className="c-contact-details-item__field__label-select"
        >
          <Dropdown
            defaultTitle={(field && field.text) || '-Select-'}
            disabled={disabled}
            handleOnSelect={this.handleOnSelect}
            name="title"
            options={this.getOptions(field)}
          />
        </span>
      </div>
    )
  }
}

export default Title
