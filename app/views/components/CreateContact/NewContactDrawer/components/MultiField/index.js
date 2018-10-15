import React from 'react'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'

import { TextField } from './Input'
import { Dropdown } from '../../../../Dropdown'
import IconButton from '../../../..//Button/IconButton'
import AddIcon from '../../../../SvgIcons/AddCircleOutline/IconAddCircleOutline'
import RemoveIcon from '../../../../SvgIcons/RemoveCircleOutline/IconRemoveCircleOutline'

import { Container, Title } from './styled'

export function MultiField({
  defaultOptions,
  defaultSelectedItem,
  mutators,
  name,
  title,
  validate
}) {
  return (
    <FieldArray name={name}>
      {({ fields }) =>
        fields.map((field, index) => (
          <div
            key={field}
            style={{
              width: '100%',
              display: 'flex'
            }}
          >
            <Container style={{ width: '30%' }}>
              <Title>{title}</Title>
              <Field
                component={Dropdown}
                defaultSelectedItem={defaultSelectedItem}
                fullWidth
                items={defaultOptions}
                itemToString={({ title }) => title}
                name={`${field}.label`}
                style={{ width: '100%' }}
              />
            </Container>
            <div
              style={{
                width: '70%',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1em',
                borderWidth: '0 0 1px 1px',
                borderStyle: 'solid',
                borderColor: '#d4d4d4'
              }}
            >
              <Field
                name={`${field}.text`}
                component={TextField}
                placeholder={title}
                validate={validate}
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
                    isFit
                    type="button"
                    iconSize="large"
                    onClick={() =>
                      mutators.push(name, { label: defaultSelectedItem })
                    }
                  >
                    <AddIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    isFit
                    type="button"
                    iconSize="large"
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
