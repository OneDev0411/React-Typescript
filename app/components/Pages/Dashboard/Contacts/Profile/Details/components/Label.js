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
    const { field, disabled, defaultLabel, labelTitles } = this.props

    return (
      <span
        className={cn('c-contact-details-item__field__label-select', {
          'is-active': field.id && field.is_primary
        })}
      >
        <Dropdown
          title={field.label}
          disabled={disabled}
          options={labelTitles}
          selectedItem={field.label}
          defaultTitle={defaultLabel}
          handleOnSelect={this.handleOnSelect}
        />
      </span>
    )
  }
}

export default Label
