import React from 'react'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'

import { Container, Title } from '../../styled-components/field'
import { TextField } from './components/Input'
import { Dropdown } from '../../../Dropdown'
import IconButton from '../../../Button/IconButton'
import AddIcon from '../../../SvgIcons/AddCircleOutline/IconAddCircleOutline'
import RemoveIcon from '../../../SvgIcons/RemoveCircleOutline/IconRemoveCircleOutline'

export function MultiField({ attribute, mutators, validate }) {
  const { attribute_def } = attribute
  let defaultOptions
  const newAttribute = {
    attribute_def,
    id: undefined,
    [attribute_def.data_type]: ''
  }
  const newMultiFieldWithoutLabel = {
    attribute: newAttribute,
    value: ''
  }
  const newMultiField = {
    attribute: newAttribute,
    label: {
      title: '-Select-',
      value: '-Select-'
    },
    value: ''
  }

  if (attribute_def.labels) {
    defaultOptions = attribute_def.labels.map(label => ({
      title: label,
      value: label
    }))
  }

  return (
    <FieldArray name={attribute_def.name}>
      {({ fields }) =>
        fields.map((field, index) => (
          <div
            key={field}
            style={{
              width: '100%',
              display: 'flex'
            }}
          >
            <Container withoutLabel={!defaultOptions} style={{ width: '30%' }}>
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
                width: '70%',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1em',
                borderWidth: '0 0 1px 1px',
                borderStyle: 'solid',
                borderColor: '#dde5ec'
              }}
            >
              <Field
                component={TextField}
                id={field}
                name={`${field}.value`}
                placeholder={attribute_def.label}
                validate={validate}
                parse={value => value || ''}
              />
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
                    onClick={() => {
                      if (defaultOptions) {
                        mutators.push(attribute_def.name, newMultiField)
                      } else {
                        mutators.push(
                          attribute_def.name,
                          newMultiFieldWithoutLabel
                        )
                      }
                    }}
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
