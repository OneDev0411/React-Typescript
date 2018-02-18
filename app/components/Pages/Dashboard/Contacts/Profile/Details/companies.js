import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import Editable from '../Editable'

const Companies = ({ fields, onChangeAttribute, handleAddNewField }) => (
  <div>
    {fields.map((item, key) => (
      <li key={`company_${key}`}>
        <div className="name">Company</div>
        <div className="data">
          <Editable
            type="company"
            id={item.id}
            showEdit
            showAdd
            text={item.company}
            onAdd={handleAddNewField}
            attributeName="companies"
            onChange={onChangeAttribute}
          />
        </div>
      </li>
    ))}

    {fields.length === 0 && (
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

const enhance = compose(
  withState('errorIdItems', 'setErrorIdItem', []),
  withState('fields', 'addNewfields', ({ items }) => items),
  withHandlers({
    handleAddNewField: ({ addNewfields, fields }) => () => {
      const newField = {
        id: undefined,
        type: 'company',
        company: 'Enter new company'
      }

      addNewfields([...fields, newField])
    }
  }),
  withPropsOnChange(['items'], ({ items, addNewfields }) => {
    addNewfields(items)

    return {}
  })
)

export default enhance(Companies)
