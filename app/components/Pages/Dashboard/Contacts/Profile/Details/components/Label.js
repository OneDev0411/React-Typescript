import React from 'react'
import cn from 'classnames'

import Dropdown from '../../../components/Dropdown'

export default function Label({ field, labels, onChange, ...props }) {
  const handleOnSelect = async label => {
    try {
      await onChange({ ...field, label })
    } catch (error) {
      throw error
    }
  }

  const getDefaultTitle = () => {
    const name = field.label || field.attribute_def.labels[0]

    if (field.attribute_def.labels.includes(field.attribute_def.label)) {
      return name
    }

    return `${name} ${field.attribute_def.label}`
  }

  return (
    <span
      className={cn('c-contact-details-item__field__label-select', {
        'is-active': field.id && field.is_primary
      })}
    >
      <Dropdown
        {...props}
        options={labels}
        defaultTitle={getDefaultTitle()}
        handleOnSelect={handleOnSelect}
      />
    </span>
  )
}
