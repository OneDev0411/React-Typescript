import React from 'react'
import Editable from '../Editable'

export default ({ companies, onChangeAttribute, onAddAttribute }) => (
  <div>
    {companies.map((item, key) => (
      <li key={`company_${key}`}>
        <div className="name">Company</div>
        <div className="data">
          <Editable
            type="company"
            id={item.id}
            showEdit
            showAdd
            text={item.company}
            onAdd={onAddAttribute}
            attributeName="companies"
            onChange={onChangeAttribute}
          />
        </div>
      </li>
    ))}

    {companies.length === 0 && (
      <li>
        <div className="name">Company</div>
        <div className="data">
          <Editable
            type="company"
            id={null}
            showEdit
            text="-"
            onChange={onChangeAttribute}
          />
        </div>
      </li>
    )}
  </div>
)
