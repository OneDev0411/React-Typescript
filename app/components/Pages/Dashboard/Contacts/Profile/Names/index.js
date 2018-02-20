import React from 'react'
import Field from './Field'

const Names = ({ names, onChangeAttribute }) => (
  <div className="c-contact-profile-card">
    <h3 className="c-contact-profile-card__title">Names</h3>
    <div className="c-contact-profile-card__body">
      <ul className="u-unstyled-list">
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
  </div>
)

export default Names
