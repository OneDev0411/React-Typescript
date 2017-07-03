import React from 'react'

export default ({
  value,
  placeholder,
  inputRef,
  onKeyPress,
  onChange,
  onBlur,
  onClose
}) => {
  function onKeyPressed(e) {
    if (e.key === 'Enter') {
      onClose()
    }
  }

  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      ref={inputRef}
      onKeyPress={onKeyPressed}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}
