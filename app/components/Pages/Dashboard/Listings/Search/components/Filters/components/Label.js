import React from 'react'
import pure from 'recompose/pure'

const Label = ({
  label,
  children
}) => (
  <div style={{ marginBottom: '3rem' }}>
    <label className="c-filters-label">{label}</label>
    {children}
  </div>
)

export default pure(Label)