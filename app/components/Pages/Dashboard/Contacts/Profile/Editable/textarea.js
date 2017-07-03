import React from 'react'
import { Button } from 'react-bootstrap'

export default ({
  value,
  placeholder,
  lines,
  inputRef,
  onChange,
  onBlur
}) => (
  <div>
    <textarea
      value={value}
      placeholder={placeholder}
      style={{ height: (lines * 23) + 'px' }}
      ref={inputRef}
      onChange={onChange}
      onBlur={onBlur}
    />

    <div style={{ textAlign: 'right' }}>
      <Button
        bsStyle="primary"
        onClick={onBlur}
        bsSize="xsmall"
        style={{ fontSize: '12px' }}
      >
        Save
      </Button>
    </div>
  </div>
)
