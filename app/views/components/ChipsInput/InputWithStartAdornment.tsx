import { HTMLProps, ReactNode, Ref } from 'react'
import * as React from 'react'

import Flex from 'styled-flex-component'

/**
 * A component to be used as InputComponent in in InputProps
 * This is used for showing chips before the input, without using
 * startAdornment which may be used for other purposes such as inline label
 */
export const InputWithStartAdornment = ({
  adornment,
  inputRef,
  inputWrapperClassName,
  ...props
}: HTMLProps<HTMLInputElement> & {
  adornment: ReactNode
  inputWrapperClassName: string
} & {
  inputRef: Ref<HTMLInputElement>
}) => {
  return (
    <Flex wrap alignEnd className={inputWrapperClassName}>
      {adornment} <input ref={inputRef} {...props} />
    </Flex>
  )
}
