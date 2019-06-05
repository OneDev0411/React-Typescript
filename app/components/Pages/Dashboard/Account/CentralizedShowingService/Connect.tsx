import React, { FunctionComponent } from 'react'
import Flex from 'styled-flex-component'
import { Form, Field } from 'react-final-form'

import { TextInput } from 'components/Forms/TextInput'
import { SelectInput } from 'components/Forms/SelectInput'
import ActionButton from 'components/Button/ActionButton'

import { MarketLocation } from './types'

const INPUT_STYLE = {
  width: '100%'
}

function validateInput(value: string = '', name: string): string | null {
  if (value.trim() === '') {
    return `Invalid ${name}`
  }

  return null
}

interface Props {
  marketLocations: MarketLocation[]
  onSubmit: (
    values: FormData,
    form: any,
    callback?: (errors?: object) => void
  ) => object | Promise<object | undefined> | undefined | void
}

export default function Connect({ marketLocations, onSubmit }: Props) {
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => {
        return (
          <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
            <Flex full>
              <Field
                validate={value => validateInput(value, 'market')}
                name="market"
                dropdownOptions={{
                  fullWidth: true
                }}
                label="Market"
                items={[
                  {
                    value: null,
                    label: 'Select a market'
                  },
                  ...marketLocations
                ]}
                autoComplete="off"
                style={{
                  ...INPUT_STYLE,
                  marginBottom: '1rem'
                }}
                component={SelectInput as FunctionComponent}
              />
            </Flex>
            <Flex full>
              <Field
                validate={value => validateInput(value, 'username')}
                name="username"
                label="Username"
                autoComplete="disable"
                style={INPUT_STYLE}
                component={TextInput as FunctionComponent}
              />
            </Flex>

            <Flex full>
              <Field
                validate={value => validateInput(value, 'password')}
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                style={INPUT_STYLE}
                component={TextInput as FunctionComponent}
              />
            </Flex>

            <Flex rowReverse>
              <ActionButton disabled={submitting} type="submit">
                {submitting ? 'Connecting' : 'Connect'}
              </ActionButton>
            </Flex>
          </form>
        )
      }}
    />
  )
}
