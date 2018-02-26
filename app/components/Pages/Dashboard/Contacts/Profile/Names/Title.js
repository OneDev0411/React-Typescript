import React from 'react'
import Dropdown from '../../components/Dropdown'

const OPTIONS = {
  '-': '-',
  Mr: 'Mr',
  Ms: 'Ms',
  Mrs: 'Mrs',
  Miss: 'Miss',
  Dr: 'Dr'
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
          className="c-contact-details-item__field"
          style={{ paddingLeft: '4px' }}
        >
          <Dropdown
            defaultTitle="Mr"
            options={OPTIONS}
            disabled={disabled}
            selectedItem={field.legal_prefix}
            handleOnSelect={this.handleOnSelect}
          />
        </span>
      </li>
    )
  }
}

export default Title
