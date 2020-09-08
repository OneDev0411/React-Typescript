import { useState } from 'react'

import type { LabeledSwitchInputProps } from 'components/LabeledSwitchInput/LabeledSwitchInput'

export default function useLabeledSwitchInputHandlers(
  checked: boolean | undefined,
  onChange: (checked: boolean) => Promise<void>
): Pick<LabeledSwitchInputProps, 'checked' | 'onChange'> {
  const [isChanging, setIsChanging] = useState(false)

  return {
    checked,
    onChange: async (event, newChecked) => {
      if (isChanging) {
        return
      }

      try {
        setIsChanging(true)
        await onChange(newChecked)
        setIsChanging(false)
      } catch (error) {
        // It's supposed to be handled within onChange, not here.
        console.error(error)
        setIsChanging(false)
      }
    }
  }
}
