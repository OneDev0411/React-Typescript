import React from 'react'

const MultiSelect = ({
  label,
  children
}) => (
  <div style={{ margninBottom: '3rem' }}>
    <label className="c-filters-label">{label}</label>
    {children}
  </div>
)

export default MultiSelect