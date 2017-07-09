import React from 'react'
import pure from 'recompose/pure'

const MultiSelect = ({
  label,
  children
}) => (
  <div style={{ margninBottom: '3rem' }}>
    <label className="c-filters-label">{label}</label>
    {children}
  </div>
)

export default pure(MultiSelect)