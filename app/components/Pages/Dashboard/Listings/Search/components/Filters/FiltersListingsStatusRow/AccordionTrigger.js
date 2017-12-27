import React from 'react'

const AccordionTrigger = ({ onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`c-filters-status__accordion-trigger ${active ? 'is-active' : ''}`}
  >
    <svg
      fill="#e9e9e9"
      height="40.5"
      viewBox="0 0 24 24"
      width="40.5"
      xmlns="http://www.w3.org/2000/svg"
      className="c-filters-status__accordion-trigger__icon"
    >
      <path d="M7 10l5 5 5-5z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  </button>
)

export default AccordionTrigger
