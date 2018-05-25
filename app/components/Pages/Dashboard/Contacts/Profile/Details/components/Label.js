import React from 'react'
import cn from 'classnames'

import Dropdown from '../../../components/Dropdown'

export default function Label({ field, labels, onChange, ...props }) {
  const { id, label, is_primary } = field

  const handleOnSelect = async label => {
    try {
      await onChange({ ...field, label })
    } catch (error) {
      throw error
    }
  }

  return (
    <span
      className={cn('c-contact-details-item__field__label-select', {
        'is-active': id && is_primary
      })}
    >
      <Dropdown
        {...props}
        options={labels}
        defaultTitle={label}
        handleOnSelect={handleOnSelect}
      />
    </span>
  )
}
