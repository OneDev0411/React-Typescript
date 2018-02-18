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
    <div>
      {fields.length > 0 ? (
        fields.map((item, key) => (
          <li key={`website_${key}`}>
            <div className="name">Website</div>
            <div className="data">
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
