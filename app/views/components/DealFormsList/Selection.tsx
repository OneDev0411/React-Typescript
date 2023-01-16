import { memo, useEffect, useState } from 'react'

import { Checkbox } from '@material-ui/core'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
}

export const DealFormSelection = memo(({ checked, onChange }: Props) => {
  const [isChecked, setIsChecked] = useState(checked)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const handleChange = (checked: boolean) => {
    setIsChecked(checked)
    setTimeout(() => onChange(checked), 0)
  }

  return (
    <Checkbox
      checked={isChecked}
      color="primary"
      onChange={(_, checked) => handleChange(checked)}
    />
  )
})
