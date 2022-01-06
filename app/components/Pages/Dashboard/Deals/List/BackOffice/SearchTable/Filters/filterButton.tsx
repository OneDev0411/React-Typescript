import { Button } from '@material-ui/core'

import { noop } from '@app/utils/helpers'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useStyles } from './styles'

interface Props {
  title: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  isActive: boolean
  startIconPath?: string
}

export const FilterButton = ({
  title,
  onClick = noop,
  isActive = false,
  startIconPath
}: Props) => {
  const classes = useStyles()

  return (
    <Button
      onClick={onClick}
      color={isActive ? 'primary' : undefined}
      variant="outlined"
      size="small"
      className={classes.button}
      startIcon={
        startIconPath ? (
          <SvgIcon path={startIconPath} size={muiIconSizes.small} />
        ) : undefined
      }
    >
      {title}
    </Button>
  )
}
