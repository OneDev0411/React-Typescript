import { useSelector } from 'react-redux'

import { selectActiveBrandSettings } from '@app/selectors/brand'
import { IAppState } from 'reducers'

export function useActiveBrandSettings(
  includesParents: boolean = false
): ReturnType<typeof selectActiveBrandSettings> {
  const activeBrandSetting = useSelector((state: IAppState) =>
    selectActiveBrandSettings(state, includesParents)
  )

  return activeBrandSetting
}
