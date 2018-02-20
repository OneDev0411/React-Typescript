import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import Editable from '../Editable'

const Websites = ({ fields, onChangeAttribute, handleAddNewField }) => {
  if (!fields) {
    return null
  }

  return (
    <ul className="u-unstyled-list">
      {fields.length > 0 ? (
        fields.map((item, key) => (
          <li key={`website_${key}`} className="c-contact-detail-item">
            <label className="c-contact-detail-item__label">Website</label>
            <span className="c-contact-detail-item__field">
              <Editable
                type="website"
                id={item.id}
                showEdit
                showAdd
                attributeName="websites"
                onAdd={handleAddNewField}
                text={item.website}
                onChange={onChangeAttribute}
              />
            </span>
          </li>
        ))
      ) : (
        <li className="c-contact-detail-item">
          <label className="c-contact-detail-item__label">Website</label>
          <span className="c-contact-detail-item__field">
            <Editable
              type="website"
              id={null}
              showEdit
              showAdd={false}
              text="-"
              onChange={onChangeAttribute}
            />
          </span>
        </li>
      )}
    </ul>
  )
}

const enhance = compose(
  withState('fields', 'addNewfields', ({ items }) => items),
  withHandlers({
    handleAddNewField: ({ addNewfields, fields }) => () => {
      const newField = {
        id: undefined,
        type: 'website',
        website: 'Enter new website'
      }

      addNewfields([...fields, newField])
    }
  }),
  withPropsOnChange(['items'], ({ items, addNewfields }) => {
    addNewfields(items)

    return {}
  })
)

export default enhance(Websites)
