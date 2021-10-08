import Masked from 'react-text-mask'

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
