import { Grid, MenuItem } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useStyles } from './styles'

export interface Props {
  title: string
  iconPath: string
  onClick: () => void
}

export function CreateMenuItem({ iconPath, onClick, title }: Props) {
  const classes = useStyles()

  return (
    <MenuItem onClick={onClick}>
      <Grid container className={classes.listItem}>
        <SvgIcon className={classes.listIcon} path={iconPath} />
        {title}
      </Grid>
    </MenuItem>
  )
}
