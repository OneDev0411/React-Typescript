import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'

import { Container, Title } from '../styled'
import { TextField } from './TextField'
import { Dropdown } from '../../../../../../../../../../views/components/Dropdown'
import IconButton from '../../../../../../../../../../views/components/Button/IconButton'
import AddIcon from '../../../../../../../../../../views/components/SvgIcons/AddCircleOutline/IconAddCircleOutline'
import RemoveIcon from '../../../../../../../../../../views/components/SvgIcons/RemoveCircleOutline/IconRemoveCircleOutline'

MultiField.propTypes = {
  attribute: PropTypes.shape().isRequired,
  format: PropTypes.func,
  mutators: PropTypes.shape().isRequired,
  parse: PropTypes.func,
  placeholder: PropTypes.string,
  validate: PropTypes.func
}

MultiField.defaultProps = {
  placeholder: '',
  format: t => t,
  parse: t => t,
  validate: () => undefined
}

export function MultiField(props) {
  const { attribute_def } = props.attribute
  let defaultOptions
  const newAttribute = {
    attribute_def,
    id: undefined,
    [attribute_def.data_type]: ''
  }
  const newMultiFieldWithoutLabel = {
    attribute: newAttribute,
    value: attribute_def.enum_values
      ? {
          title: '-Select-',
          value: '-Select-'
        }
      : ''
  }
  const newMultiField = {
    attribute: newAttribute,
    label: {
      title: '-Select-',
      value: '-Select-'
    },
    value: attribute_def.enum_values
      ? {
          title: '-Select-',
          value: '-Select-'
        }
      : ''
  }

  if (attribute_def.labels) {
    defaultOptions = attribute_def.labels.map(label => ({
      title: label,
      value: label
    }))
  }

  function addNewField() {
    if (defaultOptions) {
      props.mutators.push(attribute_def.id, newMultiField)
    } else {
      props.mutators.push(attribute_def.id, newMultiFieldWithoutLabel)
    }
  }

  return (
    <FieldArray name={attribute_def.id}>
      {({ fields }) =>
        fields.map((field, index) => (
          <div
            key={field}
            style={{
              width: '100%',
              display: 'flex'
            }}
          >
            <Container withoutLabel={!defaultOptions} style={{ width: '40%' }}>
              <Title htmlFor={field}>{attribute_def.label}</Title>
              {defaultOptions && (
                <Field
                  component={Dropdown}
                  fullWidth
                  items={defaultOptions}
                  itemToString={({ title }) => title}
                  name={`${field}.label`}
                  style={{ width: '100%' }}
                />
              )}
            </Container>
            <div
              style={{
                width: '60%',
                display: 'flex',
                alignItems: 'flex-end',
                padding: attribute_def.enum_values ? '0.75em 1em' : '1em',
                borderWidth: '0 0 1px 1px',
                borderStyle: 'solid',
                borderColor: '#dde5ec'
              }}
            >
              {attribute_def.enum_values ? (
                <Field
                  component={Dropdown}
                  fullWidth
                  items={attribute_def.enum_values.map(value => ({
                    title: value,
                    value
                  }))}
                  itemToString={({ title }) => title}
                  name={`${field}.value`}
                  style={{ width: '100%' }}
                />
              ) : (
                <Field
                  component={TextField}
                  id={field}
                  format={props.format}
                  name={`${field}.value`}
                  parse={props.parse}
                  placeholder={props.placeholder}
                  readOnly={!attribute_def.editable}
                  validate={props.validate}
                />
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginLeft: '1em'
                }}
              >
                {index + 1 === fields.length ? (
                  <IconButton
                    type="button"
                    color="#2196f3"
                    onClick={addNewField}
                  >
                    <AddIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    type="button"
                    color="#2196f3"
                    onClick={() => fields.remove(index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              </div>
            </div>
          </div>
        ))
      }
    </FieldArray>
  )
}
