import React from 'react'

export default ({ onKeyPress, onClose, inputRef, ...props }) => {
  function onKeyPressed(e) {
    if (e.key === 'Enter') {
      onClose()
    }
  }

  return (
    <input type="text" onKeyPress={onKeyPressed} ref={inputRef} {...props} />
  )
}
