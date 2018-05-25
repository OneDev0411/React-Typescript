import React from 'react'

import Dropdown from '../../components/Dropdown'
import { getAttributeLabels } from '../../../../../../models/contacts/helpers'

class Title extends React.Component {
  handleOnSelect = text => {
    this.props.onChange({ ...this.props.field, text })
  }

  render() {
    const { field, disabled } = this.props

    return (
      <li className="c-contact-details-item">
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
            options={getAttributeLabels(field.attribute_def)}
          />
        </span>
      </li>
    )
  }
}

export default Title
