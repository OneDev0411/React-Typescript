import React from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import { isEqual } from 'lodash'

import Editable from '../../Editable'
import Contact from '../../../../../../../models/contacts'
import {
  deleteAttributes,
  upsertContactAttributes
} from '../../../../../../../store_actions/contacts'

const MultiFields = ({
  name,
  title,
  fields,
  isSingle,
  isSaving,
  validator,
  placeholder,
  handleParse,
  handleFormat,
  validationText,
  handelOnDelete,
  upsertAttribute,
  handleAddNewField,
  handelOnChangePrimary
}) => (
  <ul className="c-contact-details u-unstyled-list">
    {fields.map((item, index) => {
      const showAdd =
        item.id &&
        !isSingle &&
        fields.length > 0 &&
        fields.length === index + 1 &&
        fields.every(({ id }) => id)

      return (
        <li
          key={`${name}_${item.id}`}
          className={cn('c-contact-details-item', { disabled: isSaving })}
        >
          <span className="c-contact-details-item--multi__name-wrapper">
            {fields.length > 1 &&
              item.id && (
                <input
                  type="radio"
                  name={`${name}`}
                  disabled={isSaving}
                  checked={item.is_primary}
                  onChange={() => handelOnChangePrimary(item.id)}
                  className="c-contact-details-item--multi__primary"
                  data-balloon-pos="right"
                  data-balloon={item.is_primary ? 'Primary' : 'Set Primary'}
                />
              )}
            <label
              className="c-contact-details-item--multi__label"
              style={{
                fontWeight: item.id && item.is_primary ? 'bold' : 'normal'
              }}
            >
              {title}
            </label>
          </span>
          <span className="c-contact-details-item__field">
            <Editable
              showEdit
              field={item}
              disabled={isSaving}
              validator={validator}
              placeholder={placeholder}
              onAdd={handleAddNewField}
              onChange={upsertAttribute}
              showAdd={showAdd}
              onDelete={handelOnDelete}
              handleParse={handleParse}
              handleFormat={handleFormat}
              validationText={validationText}
            />
          </span>
        </li>
      )
    })}
    {isSaving && (
      <div className="c-contact-details__saving-cover">
        <span style={{ color: '#2196f3' }}>
          <i className="fa fa-spin fa-spinner" />
          {'  '}
          Saving ...
        </span>
      </div>
    )}
  </ul>
)

function mapStateToProps(state, props) {
  const { contact: { id: contactId } } = props
  const _fields = initializeFields(props)

  return { contactId, _fields }
}

const enhance = compose(
  connect(mapStateToProps, {
    deleteAttributes,
    upsertContactAttributes
  }),
  withState('isSaving', 'setIsSaving', false),
  withState('fields', 'addNewfields', ({ _fields }) => _fields),
  withHandlers({
    handleAddNewField: ({ addNewfields, fields, type }) => () => {
      const newField = {
        type,
        id: undefined,
        is_primary: false
      }

      addNewfields([...fields, newField])
    }
  }),
  withHandlers({
    upsertAttribute: ({
      fields,
      contactId,
      setIsSaving,
      upsertContactAttributes
    }) => async attributes => {
      setIsSaving(true)

      try {
        if (fields.length === 1 && !fields[0].is_primary) {
          let [field] = attributes

          field = { ...field, is_primary: true }
          attributes = [field]
        }

        await upsertContactAttributes({ contactId, attributes })
      } catch (error) {
        throw error
      } finally {
        setIsSaving(false)
      }
    }
  }),
  withHandlers({
    handelOnDelete: ({
      contactId,
      setIsSaving,
      deleteAttributes
    }) => async field => {
      setIsSaving(true)

      try {
        await deleteAttributes({ contactId, attributesIds: [field.id] })
      } catch (error) {
        throw error
      } finally {
        setIsSaving(false)
      }
    }
  }),
  withHandlers({
    handelOnChangePrimary: ({ upsertAttribute, fields }) => fieldId => {
      if (!fieldId) {
        return
      }

      const attributes = fields.filter(({ id }) => id).map(field => {
        if (field.id === fieldId) {
          return { ...field, is_primary: true }
        }

        return { ...field, is_primary: false }
      })

      upsertAttribute(attributes)
    }
  }),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props._fields, nextProps._fields),
    ({ _fields, addNewfields }) => {
      addNewfields(_fields)

      return {}
    }
  )
)

export default enhance(MultiFields)

function initializeFields(props) {
  const { name, type, contact } = props

  const fields = Contact.get.attribute({
    type,
    name,
    contact
  })

  if (Array.isArray(fields) && fields.length > 0) {
    return fields
  }

  return [
    {
      type,
      id: undefined,
      is_primary: true
    }
  ]
}
