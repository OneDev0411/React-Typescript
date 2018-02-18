import React from 'react'
import Editable from '../Editable'

export default ({
  name,
  type,
  items,
  title,
  placeholder,
  showAdd = true,
  onChangeAttribute
}) => {
  if (!Array.isArray(items)) {
    return null
  }

  let listItems = (
    <li>
      <div className="name">{title}</div>
      <div className="data">
        <Editable
          showEdit
          text="-"
          id={null}
          type={type}
          showAdd={false}
          onChange={onChangeAttribute}
        />
      </div>
    </li>
  )

  if (items.length > 0) {
    listItems = items.map((item, key) => (
      <li key={`CONTACT__${type}__${item.id}`}>
        <div className="name">{title}</div>
        <div className="data">
          <Editable
            showEdit
            type={type}
            id={item.id}
            showAdd={showAdd}
            text={item[type]}
            attributeName={name}
            placeholder={placeholder}
            onChange={onChangeAttribute}
          />
        </div>
      </li>
    ))
  }

  return listItems
}

// {ATTRIBUTES_LIST.map((props, index) => {
//   const { name, type } = props

//   return (
//     <Attribute
//       {...props}
//       key={`CONTACT__${type.toUpperCase()}`}
//       onAddAttribute={onAddAttribute}
//       onChangeAttribute={onChangeAttribute}
//       items={Contact.get.attribute({
//         name,
//         type,
//         contact
//       })}
//     />
//   )
// })}

const ATTRIBUTES_LIST = [
  {
    type: 'email',
    name: 'emails',
    title: 'Email'
  },
  {
    type: 'phone_number',
    name: 'phone_numbers',
    title: 'Phone'
  },
  {
    type: 'job_title',
    name: 'job_titles',
    title: 'Job'
  },
  {
    type: 'company',
    name: 'companies',
    title: 'Company'
  },
  {
    type: 'website',
    name: 'websites',
    title: 'Website'
  }
]
