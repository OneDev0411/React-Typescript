import React from 'react'
import { Field } from 'react-final-form'
import cn from 'classnames'

import { ErrorContainer } from './styled'

interface Props {
  /**
   * Final form field name
   */
  name: string
  /**
   * Optional classname to be added to root element. useful for using with
   * {@link styled()}
   */
  className?: string
  /**
   * By default error message are only shown when the filed is touched.
   * this prop can override it.
   */
  visible?: boolean

  /**
   * If false, it will take zero space when no error is shown. This can lead
   * into undesired layout jumps as errors come and go. So the default is true.
   */
  preserveSpace?: boolean
}

export function FieldError({ name, className = '', visible }: Props) {
  if (!name) {
    // for now there are some usages in js so that we cannot count on
    // strict null check.
    return null
  }

  return (
    <Field
      name={name}
      subscription={{ touched: true, error: true }}
      render={({ meta }) => {
        const hasError =
          (visible !== undefined ? visible : meta.touched) && meta.error

        const classNames = cn(className, {
          'has-error': hasError
        })

        return (
          <ErrorContainer className={classNames}>
            {hasError && meta.error}
          </ErrorContainer>
        )
      }}
    />
  )
}
