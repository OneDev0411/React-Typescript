import React from 'react'

import { useTheme, Theme } from '@material-ui/core'
import { Field } from 'react-final-form'

import { RadioGroup } from 'components/RadioGroup'

import { TYPE_PERSON, TYPE_COMPANY } from '../../../constants/role-types'

interface Props {
  label: string
  name: string
  selectedValue: 'Person' | 'Organization'
}

export function TypeInput(props: Props) {
  const theme = useTheme<Theme>()

  return (
    <Field
      name={props.name}
      render={({ input }) => (
        <RadioGroup
          defaultValue={TYPE_PERSON}
          options={[
            {
              label: 'Person',
              value: TYPE_PERSON
            },
            {
              label: 'Company / Trust',
              value: TYPE_COMPANY
            }
          ]}
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
          groupStyle={{
            width: `calc(50% - ${theme.spacing(1)}px)`
          }}
          onChange={input.onChange}
          {...props}
        />
      )}
    />
  )
}
