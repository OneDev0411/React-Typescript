import React from 'react'
import cn from 'classnames'

import Dropdown from '../../../components/Dropdown'

export default function Label({
  field,
  labels,
  onChange,
  showSuffix = true,
  ...props
}) {
  const handleOnSelect = async label => {
    try {
      await onChange({ ...field, label })
    } catch (error) {
      throw error
    }
  }

  const getDefaultTitle = () => {
    const name = field.label || field.attribute_def.labels[0]

    if (
      !showSuffix ||
      field.attribute_def.labels.includes(field.attribute_def.label)
    ) {
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
        defaultTitle={getDefaultTitle()}
        handleOnSelect={handleOnSelect}
        options={labels}
        {...props}
      />
    </span>
  )
}
