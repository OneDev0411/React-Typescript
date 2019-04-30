import React from 'react'

function Summary(props) {
  return (
    <ul>
      {props.items.map((item, i) => (
        <li key={i}>
          <div className="field-name">{item.name}</div>
          <div className="field-value">{item.value}</div>
        </li>
      ))}
    </ul>
  )
}

export default Summary
