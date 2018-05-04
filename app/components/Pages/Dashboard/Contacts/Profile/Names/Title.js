import React from 'react'
import Dropdown from '../../components/Dropdown'

const OPTIONS = {
  default: {
    title: 'Mr'
  },
  ms: {
    title: 'Ms'
  },
  mrs: {
    title: 'Mrs'
  },
  miss: {
    title: 'Miss'
  },
  dr: {
    title: 'Dr'
  }
}

class Title extends React.Component {
  handleOnSelect = text => {
    const { onChange, field } = this.props

    onChange({ ...field, text })
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
            name="title"
            options={OPTIONS}
            disabled={disabled}
            defaultTitle={(field && field.text) || 'Mr'}
            handleOnSelect={this.handleOnSelect}
          />
        </span>
      </li>
    )
  }
}

export default Title
