import { useState } from 'react'

import type { LabeledSwitchProps } from 'components/LabeledSwitch'

type LabeledSwitchHandlers = Pick<LabeledSwitchProps, 'checked' | 'onChange'>

export default function useLabeledSwitchHandlers(
  checked: boolean | undefined,
  onChange: (checked: boolean) => Promise<void>
): LabeledSwitchHandlers {
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
      } catch (error) {
        // It's usually supposed to be handled within onChange, not here.
        console.error(error)
      } finally {
        setIsChanging(false)
      }
    }
  }
}
