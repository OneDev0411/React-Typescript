import React from 'react'

function UserEntry(props, ref) {
  const { isShow, inputDefaultValue, inputPlaceholder, multilineEntry } = props

  if (isShow) {
    const sharedProps = {
      defaultValue: inputDefaultValue,
      placeholder: inputPlaceholder,
      ref
    }

    if (multilineEntry === false) {
      return <input {...sharedProps} className="confirmation-input textinput" />
    }

    return <textarea {...sharedProps} className="confirmation-input textarea" />
  }

  return null
}

export default React.forwardRef(UserEntry)
