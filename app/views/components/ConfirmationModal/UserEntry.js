import React from 'react'

function UserEntry(props, ref) {
  if (!props.isShow) {
    return null
  }

  const sharedProps = {
    defaultValue: props.inputDefaultValue,
    placeholder: props.inputPlaceholder,
    ref
  }
  const baseClassName = 'confirmation-input'

  if (props.multilineEntry === false) {
    return <input {...sharedProps} className={`${baseClassName} textinput`} />
  }

  return <textarea {...sharedProps} className={`${baseClassName} textarea`} />
}

export default React.forwardRef(UserEntry)
