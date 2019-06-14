import { useState, ChangeEvent } from 'react'

// this useInput can gradually become more abstract and
// featured with support for formatters, parsers, mask, etc.
// This way we can even write things like useNumberInput
// on top of it.
interface Props {
  initialValue?: string | number
  pattern?: RegExp
}

export default function useInput({ initialValue = '', pattern }: Props) {
  const [value, setValue] = useState<typeof initialValue>(initialValue)

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value

    if (!pattern || pattern.test(newValue)) {
      setValue(newValue)
    }
  }

  return { value, onChange }
}
