import { Grid, IconButton, MenuItem, Typography } from '@material-ui/core'
import { mdiHelpCircleOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { muiIconSizes } from '../SvgIcons'

import { useStyles } from './styles'

export interface Props {
  title: string
  onClick: () => void
  icon: React.ReactNode
  disabled?: boolean
  helperLink?: string
}

export function AccountMenuItem({
  onClick,
  title,
  icon,
  disabled,
  helperLink
}: Props) {
  const classes = useStyles()

  return (
    <MenuItem onClick={onClick} disabled={disabled}>
      <Grid container className={classes.listItem}>
        {icon}
        <Typography className={classes.listText} variant="body1">
          {title}
        </Typography>
        {helperLink && (
          <Grid className={classes.listAction}>
            <IconButton
              edge="end"
              size="small"
              color="secondary"
              target="_blank"
              onClick={e => {
                e.stopPropagation()
              }}
              href={helperLink}
            >
              <SvgIcon
                className={classes.listActionIcon}
                size={muiIconSizes.small}
                path={mdiHelpCircleOutline}
              />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </MenuItem>
  )
}
