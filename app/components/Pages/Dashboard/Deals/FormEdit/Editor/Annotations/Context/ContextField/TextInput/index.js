import React, { useMemo, Fragment } from 'react'

import { FormattedInput, BasicInput } from './styled'

export function TextInput(props) {
  const formattedInputOptions = useMemo(() => {
    const { data_type, format } = props.context

    if (['Number', 'Numeric'].includes(data_type)) {
      return {
        numeral: true,
        numeralThousandsGroupStyle: format === 'Currency' ? 'thousand' : 'none',
        numeralPositiveOnly: format === 'Currency',
        // prefix: format === 'Currency' ? '$' : null,
        noImmediatePrefix: true,
        rawValueTrimPrefix: true
      }
    }

    return null
  }, [props.context])

  return (
    <Fragment>
      {formattedInputOptions ? (
        <FormattedInput
          value={props.defaultValue}
          options={formattedInputOptions}
          onChange={props.onChange}
        />
      ) : (
        <BasicInput
          defaultValue={props.defaultValue}
          onChange={props.onChange}
        />
      )}
    </Fragment>
  )
}
