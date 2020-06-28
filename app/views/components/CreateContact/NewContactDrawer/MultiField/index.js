import React from 'react'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import Flex from 'styled-flex-component'
import { mdiPlusCircleOutline, mdiMinusCircleOutline } from '@mdi/js'
import { useTheme } from '@material-ui/core/styles'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { Dropdown } from 'components/Dropdown'
import IconButton from 'components/Button/IconButton'
import { Select } from 'components/final-form-fields/Select'

import { TextField } from './Input'

export function MultiField({
  defaultOptions,
  defaultSelectedItem,
  mutators,
  name,
  title,
  validate
}) {
  const theme = useTheme()

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
            <Flex style={{ width: '30%', borderRight: '1em' }}>
              <Select
                label={title}
                component={Dropdown}
                defaultSelectedItem={defaultSelectedItem}
                fullWidth
                hasEmptyItem={false}
                items={defaultOptions}
                name={`${field}.label`}
              />
            </Flex>
            <div
              style={{
                width: '70%',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '0 1em',
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
                initialValue={
                  fields.initial && fields.initial[index]
                    ? fields.initial[index].initialValue
                    : undefined
                }
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginLeft: '1em',
                  marginBottom: '0.5em'
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
                    <SvgIcon
                      color={theme.palette.primary.main}
                      path={mdiPlusCircleOutline}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    isFit
                    type="button"
                    iconSize="large"
                    onClick={() => fields.remove(index)}
                  >
                    <SvgIcon
                      color={theme.palette.primary.main}
                      path={mdiMinusCircleOutline}
                    />
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
