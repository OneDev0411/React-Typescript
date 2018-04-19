import React from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import { isEqual } from 'lodash'

import Label from './Label'
import Editable from '../../Editable'
import Loading from '../../../components/Loading'
import Contact, {
  getMostRecentlyAttribute
} from '../../../../../../../models/contacts'
import {
  deleteAttributes,
  upsertContactAttributes
} from '../../../../../../../store_actions/contacts'

const MultiFields = ({
  name,
  title,
  fields,
  labels,
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
  handleLabelOnChange,
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
            {labels ? (
              <Label
                name={name}
                field={item}
                labels={labels}
                disabled={isSaving}
                onChange={handleLabelOnChange}
              />
            ) : (
              <label
                className="c-contact-details-item--multi__label"
                style={{
                  fontWeight: item.id && item.is_primary ? 'bold' : 'normal'
                }}
              >
                {title}
              </label>
            )}
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
    {isSaving && <Loading />}
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
        is_primary: false,
        label: 'default'
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

        await upsertContactAttributes(contactId, attributes)
      } catch (error) {
        throw error
      } finally {
        setIsSaving(false)
      }
    }
  }),
  withHandlers({
    handleLabelOnChange: ({
      fields,
      contactId,
      setIsSaving,
      addNewfields,
      upsertContactAttributes
    }) => async field => {
      try {
        if (field.id) {
          setIsSaving(true)
          await upsertContactAttributes(contactId, [field])
        } else {
          const newFields = fields.filter(f => f.id)

          return addNewfields([...newFields, field])
        }
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
        await deleteAttributes(contactId, [field.id])
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
  const { name, type, contact, defaultLabel, isSingle } = props

  let fields

  if (!isSingle) {
    fields = Contact.get.attributes({
      type,
      name,
      contact
    })
  } else {
    const field = getMostRecentlyAttribute({ contact, attributeName: name })

    fields = field != null ? [field] : undefined
  }

  if (fields && Array.isArray(fields) && fields.length > 0) {
    return fields
  }

  return [
    {
      type,
      id: undefined,
      is_primary: true,
      label: defaultLabel
    }
  ]
}
