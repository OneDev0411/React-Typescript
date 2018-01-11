import React from 'react'

const Accordion = ({ active, children }) => (
  <div className={`c-filters-status__accordion-target ${active ? 'is-active' : ''}`}>
    {children}
  </div>
)

export default Accordion
