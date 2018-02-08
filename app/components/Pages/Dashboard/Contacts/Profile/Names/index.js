import React from 'react'
import Field from './Field'

const Names = ({ names, onChangeAttribute }) => (
  <div className="card details">
    <div className="title">Names</div>
    <ul className="table">
      {names &&
        names.map(field => (
          <Field
            field={field}
            key={`names_${field.name}`}
            onChange={onChangeAttribute}
          />
        ))}
    </ul>
  </div>
)

export default Names
