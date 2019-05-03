import React from 'react'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import RadioButton from 'components/RadioButton'

import { InputLabel, InputRequired } from '../styled'

export function RadioGroup(props) {
  return (
    <Flex column flexStart>
      <InputLabel>
        {props.label} <InputRequired>{props.isRequired && '*'}</InputRequired>
      </InputLabel>

      <Flex style={{ height: '2rem' }}>
        {props.options.map((option, index) => (
          <Field
            key={index}
            style={{ marginRight: '1rem' }}
            type="radio"
            name={props.name}
            render={({ input, ...rest }) => (
              <RadioButton
                caption={option.label}
                selected={props.selectedValue === option.name}
                onClick={() => input.onChange(option.name)}
                {...input}
                {...rest}
              />
            )}
          />
        ))}
      </Flex>
    </Flex>
  )
}
