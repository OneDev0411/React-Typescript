import React from 'react'

export default ({
  id,
  name,
  title,
  value,
  onChange,
  isInvalid,
  placeholder,
  isRequired = true,
  lableColorError
}) => (
  <div className={name} style={{ position: 'relative' }}>
    <label
      htmlFor={id}
      style={{
        display: 'block',
        cursor: 'pointer',
        color: lableColorError ? 'red' : undefined
      }}
    >
      {title} {isRequired && <sup>*</sup>}
    </label>

    {isInvalid && (
      <span
        data-balloon-visible
        data-balloon-pos="up"
        data-balloon-length="large"
        className="c-field-balloon c-field-balloon--error"
        data-balloon="Please include only letters. You have added a number or special character."
      />
    )}

    <input
      id={id}
      name={name}
      type="text"
      value={value || ''}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)
