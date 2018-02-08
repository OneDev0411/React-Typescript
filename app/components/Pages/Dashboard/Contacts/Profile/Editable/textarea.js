import React from 'react'

export default ({ value, placeholder, lines, inputRef, onChange, onBlur }) => (
  <textarea
    value={value}
    ref={inputRef}
    onBlur={onBlur}
    onChange={onChange}
    placeholder={placeholder}
    style={{ height: `${lines * 23}px` }}
  />
)
