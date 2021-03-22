import React from 'react'
import Masked, { maskArray } from 'react-text-mask'

interface Props {
  inputRef: (ref: HTMLInputElement | null) => void
  mask: maskArray | ((value: string) => maskArray)
}

export function MaskedInput({ inputRef, ...rest }: Props) {
  return (
    <Masked
      {...rest}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null)
      }}
    />
  )
}
