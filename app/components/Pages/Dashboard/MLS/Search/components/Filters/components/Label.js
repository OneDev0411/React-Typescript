import React from 'react'

const Label = ({ label, children }) => (
  <div style={{ marginBottom: '2rem' }}>
    <label className="c-filters-label">{label}</label>
    {children}
  </div>
)

export default Label
