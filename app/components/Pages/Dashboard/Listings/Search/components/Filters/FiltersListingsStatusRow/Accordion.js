import React from 'react'
import pure from 'recompose/pure'

const Accordion = ({ active, children }) =>
  <div
    className={`c-filters-listings-status__accordion-target ${active
      ? 'is-active'
      : ''}`}>
    {children}
  </div>

export default pure(Accordion)
