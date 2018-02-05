import React from 'react'

export default ({
  id, name, value, onChange, isInvalid, placeholder
}) => (
  <div className={name} style={{ position: 'relative' }}>
    <input
      id={id}
      name={name}
      type="text"
      value={value || ''}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    />

    {isInvalid && (
      <span
        data-balloon-visible
        data-balloon-pos="up"
        data-balloon-length="large"
        className="c-field-balloon c-field-balloon--error"
        data-balloon="Please include only letters. You have added a number or special character."
      />
    )}
  </div>
)
