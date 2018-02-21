import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import Editable from '../Editable'

const Companies = ({ fields, onChangeAttribute, handleAddNewField }) => (
  <ul className="u-unstyled-list">
    {fields.length > 0 ? (
      fields.map((item, key) => (
        <li key={`company_${key}`} className="c-contact-details-item">
          <label className="c-contact-details-item__label">Company</label>
          <span className="c-contact-details-item__field">
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
          </span>
        </li>
      ))
    ) : (
      <li className="c-contact-details-item">
        <label className="c-contact-details-item__label">Company</label>
        <span className="c-contact-details-item__field">
          <Editable
            type="company"
            id={null}
            showEdit
            text="-"
            onChange={onChangeAttribute}
          />
        </span>
      </li>
    )}
  </ul>
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
