import React from 'react'
import { connect } from 'react-redux'
import { Field, formValueSelector } from 'redux-form'
import { getObjectValues } from '../../../../../../../../store_actions/listings/search/filters/submit-filters-form'
import toggleAll from '../../../../../../../../store_actions/listings/search/filters/toggle-all'

const selector = formValueSelector('filters')

const arraysIsSame = (array1, array2) =>
  Array.isArray(array1) &&
  Array.isArray(array2) &&
  array1.length === array2.length &&
  array1.every((element, index) => element === array2[index])

const Tags = ({ name, label, fields, selectAllValue, toggleAll }) => (
  <div style={{ marginBottom: '3rem' }}>
    <div className="c-filters__tags__header clearfix">
      <span className="c-filters__tags__title">{label}</span>
      <div className="c-filters__tags__select-all">
        <label htmlFor={`select-all-${name}`} className="c-filters-tag">
          <input
            type="checkbox"
            checked={selectAllValue}
            id={`select-all-${name}`}
            className="c-filters__tag__input"
            onChange={event => {
              toggleAll(name, fields, event.target.checked)
            }}
          />
          <span className="c-filters__tag__text">
            {selectAllValue ? 'Deselect All' : 'Select All'}
          </span>
        </label>
      </div>
    </div>
    <div className="c-filters__tags__body clearfix">
      {Object.keys(fields).map(field => {
        const value = fields[field]
        const id = `${name}__${field}`

        return (
          <label key={id} htmlFor={id} className="c-filters__tag">
            <Field
              id={id}
              value={value}
              type="checkbox"
              component="input"
              name={`${name}.${field}`}
              className="c-filters__tag__input"
              normalize={v => (v ? value : null)}
            />
            <span className="c-filters__tag__text">{value}</span>
          </label>
        )
      })}
    </div>
  </div>
)

export default connect(
  (state, { name, fields }) => {
    const selectedTags = selector(state, name)
    const selectAllValue = arraysIsSame(
      getObjectValues(selectedTags),
      getObjectValues(fields)
    )

    return {
      selectedTags,
      selectAllValue
    }
  },
  { toggleAll }
)(Tags)
