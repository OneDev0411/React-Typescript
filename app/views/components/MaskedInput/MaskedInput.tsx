import Masked from 'react-text-mask'
import type { Mask } from 'react-text-mask'

interface Props {
  inputRef: (ref: HTMLInputElement | null) => void
  mask: Mask
}

export default function MaskedInput({ inputRef, ...rest }: Props) {
  return (
    <Masked
      {...rest}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null)
      }}
    />
  )
}
