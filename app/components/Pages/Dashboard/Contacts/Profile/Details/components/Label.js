import React from 'react'
import cn from 'classnames'
import Dropdown from '../../../components/Dropdown'

class Label extends React.Component {
  constructor(props) {
    super(props)
    this.handleOnSelect = this.handleOnSelect.bind(this)
  }

  async handleOnSelect(label) {
    const { onChange, field } = this.props

    await onChange({ ...field, label })
  }

  render() {
    const { name, field, disabled, labels } = this.props
    const { id, label, is_primary } = field

    return (
      <span
        className={cn('c-contact-details-item__field__label-select', {
          'is-active': id && is_primary
        })}
      >
        <Dropdown
          name={name}
          options={labels}
          disabled={disabled}
          defaultTitle={label}
          handleOnSelect={this.handleOnSelect}
        />
      </span>
    )
  }
}

export default Label
