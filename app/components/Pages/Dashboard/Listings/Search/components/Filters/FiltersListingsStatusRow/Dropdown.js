import React from 'react'
import pure from 'recompose/pure'

const Dropdown = ({ name, items, active }) =>
  <ul
    className={`c-filters-listings-status__dropdown ${active
      ? 'is-active'
      : ''}`}>
    {Object.keys(items).map(item => {
      const { title, checked } = items[item]
      return (
        <li
          key={`${name}_dropdown__${item}`}
          className="c-filters-listings-status__dropdown__item">
          <input
            id={`${name}_dropdown__${item}`}
            type="checkbox"
            defaultChecked={checked}
          />
          <label htmlFor={`${name}_dropdown__${item}`}>
            <svg
              fill="#2196f3"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {title}
          </label>
        </li>
      )
    })}
  </ul>

export default pure(Dropdown)
