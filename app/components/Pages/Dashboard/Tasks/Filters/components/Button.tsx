import { Button as BaseButton, ButtonProps } from '@material-ui/core'

import { noop } from '@app/utils/helpers'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

interface Props extends ButtonProps {
  title: string | React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  isActive: boolean
  startIconPath?: string
}

export function Button({
  title,
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
      {title}
    </BaseButton>
  )
}
