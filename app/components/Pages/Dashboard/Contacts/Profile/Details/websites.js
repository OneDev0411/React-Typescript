import React from 'react'
import Editable from '../Editable'

export default ({ websites, onChangeAttribute, onAddAttribute }) => {
  if (!websites) {
    return null
  }

  return (
    <div>
      {websites.length > 0 ? (
        websites.map((item, key) => (
          <li key={`website_${key}`}>
            <div className="name">Website</div>
            <div className="data">
              <Editable
                type="website"
                id={item.id}
                showEdit
                showAdd
                attributeName="websites"
                onAdd={onAddAttribute}
                text={item.website}
                onChange={onChangeAttribute}
              />
            </div>
          </li>
        ))
      ) : (
        <li>
          <div className="name">Website</div>
          <div className="data">
            <Editable
              type="website"
              id={null}
              showEdit
              showAdd={false}
              text="-"
              onChange={onChangeAttribute}
            />
          </div>
        </li>
      )}
    </div>
  )
}
