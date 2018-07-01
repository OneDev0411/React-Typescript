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
import { getContactAttribute } from '../../../../../../../models/contacts/helpers'
import {
  deleteAttributes,
  upsertContactAttributes
} from '../../../../../../../store_actions/contacts'
import { selectDefinitionByName } from '../../../../../../../reducers/contacts/attributeDefs'

const MultiFields = ({
  fields,
  defaultLabels,
  isSaving,
  handleParse,
  handleFormat,
  handleOnDelete,
  handleAddNewField,
  handleLabelOnChange,
  handleOnChangePrimary,
  placeholder,
  showPrimary = true,
  showSuffix,
  upsertAttribute,
  validator,
  validationText
}) => (
  <ul className="c-contact-details u-unstyled-list">
    {fields.map((field, index) => {
      const { id, attribute_def, is_primary } = field
      const { name, singular, label, editable, data_type } = attribute_def

      const showAdd =
        id &&
        !singular &&
        fields.length > 0 &&
        fields.length === index + 1 &&
        fields.every(({ id }) => id)

      return (
        <li
          key={`${name}_${id}`}
          className={cn('c-contact-details-item', { disabled: isSaving })}
        >
          <span className="c-contact-details-item--multi__name-wrapper">
            {fields.length > 1 &&
              id &&
              showPrimary && (
                <input
                  type="radio"
                  name={`${name}`}
                  disabled={isSaving}
                  checked={is_primary}
                  onChange={() => handleOnChangePrimary(id)}
                  className="c-contact-details-item--multi__primary"
                  data-balloon-pos="right"
                  data-balloon={is_primary ? 'Primary' : 'Set Primary'}
                />
              )}
            {defaultLabels ? (
              <Label
                disabled={isSaving}
                field={field}
                labels={defaultLabels}
                onChange={handleLabelOnChange}
                name={name}
                showSuffix={showSuffix}
              />
            ) : (
              <label
                className="c-contact-details-item--multi__label"
                style={{
                  fontWeight:
                    id && is_primary && showPrimary ? 'bold' : 'normal'
                }}
              >
                {label}
              </label>
            )}
          </span>
          {editable ? (
            <span className="c-contact-details-item__field">
              <Editable
                disabled={isSaving}
                field={field}
                handleFormat={handleFormat}
                handleParse={handleParse}
                onAdd={handleAddNewField}
                onChange={upsertAttribute}
                onDelete={handleOnDelete}
                placeholder={placeholder}
                showAdd={showAdd}
                validator={validator}
                validationText={validationText}
              />
            </span>
          ) : (
            <span>{handleFormat(field[data_type])}</span>
          )}
        </li>
      )
    })}
    {isSaving && <Loading />}
  </ul>
)

function mapStateToProps(state, props) {
  let _fields = []
  const { contact, attributeName } = props
  const {
    contacts: { attributeDefs }
  } = state

  const attributeDef = selectDefinitionByName(attributeDefs, attributeName)

  if (attributeDef) {
    _fields = getContactAttribute(contact, attributeDef)

    if (_fields.length === 0) {
      _fields = defaultField(attributeDef)
    }
  }

  return { contactId: contact.id, _fields }
}

const enhance = compose(
  connect(
    mapStateToProps,
    {
      deleteAttributes,
      upsertContactAttributes
    }
  ),
  withState('isSaving', 'setIsSaving', false),
  withState('fields', 'addNewfields', ({ _fields }) => _fields),
  withHandlers({
    handleAddNewField: ({ addNewfields, fields }) => attribute_def => {
      const newField = {
        attribute_def,
        id: undefined,
        is_primary: false
      }

      if (attribute_def.labels) {
        newField.label = attribute_def.labels[0]
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
    }) => async attribute => {
      setIsSaving(true)

      try {
        if (fields.length === 1 && !fields[0].is_primary) {
          attribute = {
            ...attribute,
            is_primary: true
          }
        }

        await upsertContactAttributes(contactId, [attribute])
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
          await upsertContactAttributes(contactId, [
            {
              id: field.id,
              label: field.label
            }
          ])
        } else {
          const newFields = fields.filter(f => f.id)

          addNewfields([...newFields, field])
        }
      } catch (error) {
        throw error
      } finally {
        setIsSaving(false)
      }
    }
  }),
  withHandlers({
    handleOnDelete: ({
      contactId,
      setIsSaving,
      deleteAttributes
    }) => async field => {
      if (!field || !field.id) {
        throw new Error('Attribute is not valid.')
      }

      try {
        setIsSaving(true)
        await deleteAttributes(contactId, [field.id])
      } catch (error) {
        throw error
      } finally {
        setIsSaving(false)
      }
    }
  }),
  withHandlers({
    handleOnChangePrimary: ({
      contactId,
      fields,
      setIsSaving,
      upsertContactAttributes
    }) => async fieldId => {
      if (!fieldId) {
        throw new Error('Attribute id is required.')
      }

      try {
        const attributes = fields.filter(({ id }) => id).map(field => {
          if (field.id === fieldId) {
            return { id: field.id, is_primary: true }
          }

          return { id: field.id, is_primary: false }
        })

        setIsSaving(true)

        await upsertContactAttributes(contactId, attributes)
      } catch (error) {
        throw error
      } finally {
        setIsSaving(false)
      }
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

function defaultField(attribute_def) {
  return [
    {
      attribute_def,
      id: undefined,
      is_primary: true
    }
  ]
}
