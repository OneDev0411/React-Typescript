import Masked from 'react-text-mask'

// TODO: There is a conflict with react-text-mask and @types/react-text-mask packages.
// Please remove the below it and import it from the package when the issue get fixed.
// import type { maskArray } from 'react-text-mask'
type maskArray = Array<string | RegExp> | false

interface Props {
  inputRef: (ref: HTMLInputElement | null) => void
  mask: maskArray | ((value: string) => maskArray)
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
