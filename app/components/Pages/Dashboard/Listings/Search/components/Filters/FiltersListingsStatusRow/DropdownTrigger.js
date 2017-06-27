import React from 'react'
import pure from 'recompose/pure'

const DropdownTrigger = ({ onClick, active }) =>
  <button
    onClick={onClick}
    className={`c-filters-listings-status__dropdown-btn ${active
      ? 'is-active'
      : ''}`}>
    <svg
      fill="#e9e9e9"
      height="48"
      viewBox="0 0 24 24"
      width="48"
      xmlns="http://www.w3.org/2000/svg"
      className="c-filters-listings-status__dropdown-btn__icon">
      <path d="M7 10l5 5 5-5z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  </button>

export default pure(DropdownTrigger)
