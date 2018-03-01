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
  constructor(props) {
    super(props)

    this.handleOnSelect = this.handleOnSelect.bind(this)
  }

  async handleOnSelect(legal_prefix) {
    const { onChange } = this.props

    await onChange([{ type: 'legal_prefix', legal_prefix }])
  }

  render() {
    const { field, disabled } = this.props

    return (
      <li className="c-contact-details-item">
        <label className="c-contact-details-item__label">Title</label>
        <span
          style={{ paddingLeft: '4px' }}
          className="c-contact-details-item__field"
        >
          <Dropdown
            name="title"
            options={OPTIONS}
            disabled={disabled}
            defaultTitle={field.legal_prefix}
            handleOnSelect={this.handleOnSelect}
          />
        </span>
      </li>
    )
  }
}

export default Title
