import { Typography } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { AccessButtonType } from '../../types.d'

interface Props {
  data: AccessButtonType
}

const styles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'inline-flex',
      margin: theme.spacing(0, 1, 1, 0),
      padding: theme.spacing(1.5),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.common.black,

      '&:hover': {
        color: theme.palette.common.black,
        backgroundColor: theme.palette.grey[200],
        cursor: 'pointer',
        textDecoration: 'none'
      }
    },
    label: {
      marginRight: theme.spacing(1)
    }
  }),
  { name: 'AccessButton' }
)

export function AccessButton({
  data: { access, action, icon, label, to = '' }
}: Props) {
  const classes = styles()

  return (
    <Link className={classes.container} onClick={action} to={to}>
      <SvgIcon path={icon} rightMargined color="grey" />
      <Typography className={classes.label} variant="body1">
        {label}
      </Typography>
    </Link>
  )
}
