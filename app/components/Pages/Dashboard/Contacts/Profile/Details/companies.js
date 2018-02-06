import React from 'react'
import Editable from '../Editable'

export default ({
  companies,
  onChangeAttribute
}) => <div>
  {
    companies.map((item, key) => (
      <li key={`company_${key}`}>
        <div className="name">Company</div>
        <div className="data">
          <Editable
            type="company"
            id={item.id}
            showEdit
            showAdd={false}
            text={item.company}
            onChange={onChangeAttribute}
          />
        </div>
      </li>
    ))
  }

  {
    companies.length === 0 &&
      <li>
        <div className="name">Company</div>
        <div className="data">
          <Editable
            type="company"
            id={null}
            showEdit
            showAdd={false}
            text="-"
            onChange={onChangeAttribute}
          />
        </div>
      </li>
  }
</div>
