import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import Editable from '../Editable'

const Jobs = ({ fields, onChangeAttribute, handleAddNewField }) => {
  if (!fields) {
    return null
  }

  return (
    <ul className="u-unstyled-list">
      {fields.length > 0 ? (
        fields.map((item, key) => (
          <li key={`job_${key}`} className="c-contact-details-item">
            <label className="c-contact-details-item__label">Job Title</label>
            <span className="c-contact-details-item__field">
              <Editable
                type="job_title"
                id={item.id}
                showEdit
                showAdd
                attributeName="job_titles"
                onAdd={handleAddNewField}
                text={item.job_title}
                onChange={onChangeAttribute}
              />
            </span>
          </li>
        ))
      ) : (
        <li className="c-contact-details-item">
          <label className="c-contact-details-item__label">Job Title</label>
          <span className="c-contact-details-item__field">
            <Editable
              type="job_title"
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
        type: 'job_title',
        job_title: 'Enter new job title'
      }

      addNewfields([...fields, newField])
    }
  }),
  withPropsOnChange(['items'], ({ items, addNewfields }) => {
    addNewfields(items)

    return {}
  })
)

export default enhance(Jobs)
