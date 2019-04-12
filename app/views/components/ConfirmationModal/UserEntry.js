import React from 'react'

function UserEntry(props, ref) {
  if (props.isShow) {
    const sharedProps = {
      defaultValue: props.inputDefaultValue,
      placeholder: props.inputPlaceholder,
      ref
    }

    if (props.multilineEntry === false) {
      return <input {...sharedProps} className="confirmation-input textinput" />
    }

    return <textarea {...sharedProps} className="confirmation-input textarea" />
  }

  return null
}

export default React.forwardRef(UserEntry)
