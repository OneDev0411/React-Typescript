import React from 'react'

export default ({
  id, name, title, value, onChange, isInvalid, placeholder
}) => (
  <div className={name} style={{ position: 'relative' }}>
    <label htmlFor={id} style={{ display: 'block', cursor: 'pointer' }}>
      {title} <sup>*</sup>
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
      required="required"
      value={value || ''}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)
