import Masked, { Mask } from 'react-text-mask'

interface Props {
  inputRef: (ref: HTMLInputElement | null) => void
  mask: Mask | ((value: string) => Mask)
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
