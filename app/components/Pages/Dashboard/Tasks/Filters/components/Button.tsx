import { Button as BaseButton, ButtonProps } from '@material-ui/core'

import { noop } from '@app/utils/helpers'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

type Props = ButtonProps & {
  text: React.ReactNode | JSX.Element | string
  isActive: boolean
  startIconPath?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function Button({
  text,
  onClick = noop,
  isActive = false,
  startIconPath,
  ...rest
}: Props) {
  return (
    <BaseButton
      onClick={onClick}
      color={isActive ? 'primary' : undefined}
      variant="outlined"
      size="medium"
      startIcon={
        startIconPath ? (
          <SvgIcon path={startIconPath} size={muiIconSizes.small} />
        ) : undefined
      }
      {...rest}
    >
      {text}
    </BaseButton>
  )
}
