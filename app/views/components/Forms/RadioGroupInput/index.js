import React, { Fragment } from 'react'
import { Field } from 'react-final-form'

import { RadioContainer, InputRadio, RadioLabel } from './styled'

export const RadioGroup = ({ name, selectedValue, options }) => (
  <RadioContainer>
    {options.map((option, index) => (
      <Fragment key={index}>
        <Field
          type="radio"
          name={name}
          render={({ input, ...rest }) => (
            <InputRadio
              {...input}
              value={option.name}
              checked={selectedValue === option.name}
              {...rest}
            />
          )}
        />

        <RadioLabel>{option.label}</RadioLabel>
      </Fragment>
    ))}
  </RadioContainer>
)
