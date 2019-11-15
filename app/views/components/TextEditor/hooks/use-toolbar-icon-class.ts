import classNames from 'classnames'

import { useIconStyles } from '../../../../styles/use-icon-styles'

export function useToolbarIconClass() {
  const iconClasses = useIconStyles()

  return classNames(
    iconClasses.small,
    iconClasses.smallMargins,
    iconClasses.currentColor
  )
}
