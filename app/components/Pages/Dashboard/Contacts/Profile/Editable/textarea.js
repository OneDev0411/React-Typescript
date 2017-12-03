import React from 'react'

export default ({
  value,
  placeholder,
  lines,
  inputRef,
  onChange,
  onBlur
}) => (
  <textarea
    value={value}
    placeholder={placeholder}
    style={{ height: `${lines * 23}px` }}
    ref={inputRef}
    onChange={onChange}
    onBlur={onBlur}
  />
)
