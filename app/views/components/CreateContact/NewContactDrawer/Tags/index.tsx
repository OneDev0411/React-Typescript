import React, { useRef, forwardRef, useImperativeHandle } from 'react'

import { Field } from 'react-final-form'

import { Container, Label } from 'components/final-form-fields/styled'
import { TagSelectorTextField } from 'components/TagSelector'

export const Tags = forwardRef(({ onClear }: any, ref) => {
  const inputEl = useRef()

  useImperativeHandle(ref, () => ({
    clear: () => {
      console.log('inputEl', inputEl)

      if (inputEl && inputEl.current) {
        inputEl.current.value = ''
      }
    }
  }))

  return (
    <Container>
      <Label>Tags</Label>
      {/* <input ref={inputEl} /> */}
      <Field
        name="tags"
        ref={inputEl}
        render={({ input }) => (
          <TagSelectorTextField
            value={input.value}
            onChange={input.onChange}
            // textFieldProps={() => ({
            //   InputProps: {
            //     ref: inputEl
            //   }
            // })}
          />
        )}
      />
    </Container>
  )
})
