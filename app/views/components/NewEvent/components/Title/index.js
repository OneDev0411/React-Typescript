import React from 'react'
import styled from 'styled-components'
import { Field } from 'react-final-form'

import { grey, red } from 'views/utils/colors'

const Container = styled.div`
  margin-bottom: 1em;

  > input {
    width: 100%;
    padding: 0;
    border-width: 0;
    font-size: 1.2rem;
    font-weight: 500;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${grey.A550};
    }
  }

  > .error {
    color: ${red.primary};
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
`

export function Title() {
  const validate = value => {
    if (typeof value !== 'string' || value.trim().length === 0) {
      return 'Title is required!'
    }
  }

  return (
    <Field
      name="title"
      validate={validate}
      render={({ input, meta }) => {
        const { error, touched } = meta

        return (
          <Container>
            <input
              {...input}
              type="text"
              autoComplete="off"
              data-test="add-task"
              placeholder="Add a title"
            />
            {error && touched && <div className="error">{error}</div>}
          </Container>
        )
      }}
    />
  )
}
