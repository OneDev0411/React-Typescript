import React from 'react'

export default ({
  value,
  placeholder,
  inputRef,
  onChange,
  onBlur
}) => (
  <textarea
    value={value}
    placeholder={placeholder}
    ref={inputRef}
    onChange={onChange}
    onBlur={onBlur}
  />
)
