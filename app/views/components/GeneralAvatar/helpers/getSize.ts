import { Theme } from '@material-ui/core'

import { Props as AvatarProps } from '../type'

/**
 * return avatar size
 * @param theme
 * @param size
 */
interface AvatarSize {
  width: number
  height: number
}

export const getSize = (
  theme: Theme,
  size: AvatarProps['size']
): AvatarSize => {
  let imageSize: number = 5 // 40px

  switch (size) {
    case 'small':
      imageSize = 3 // 24px
      break
    case 'large':
      imageSize = 6 // 48px
      break
  }

  return {
    width: theme.spacing(imageSize),
    height: theme.spacing(imageSize)
  }
}
