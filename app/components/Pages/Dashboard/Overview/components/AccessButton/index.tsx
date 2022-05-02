import { useCallback } from 'react'

import { Typography } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import Acl from 'views/components/Acl'

import { AccessButtonType } from '../../types.d'

interface Props {
  data: AccessButtonType
}

const styles = makeStyles(
  (theme: Theme) => ({
    container: {
      alignItems: 'center',
      backgroundColor: theme.palette.grey[100],
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: theme.spacing(2),
      color: theme.palette.grey.A400,
      cursor: 'pointer',
      display: 'inline-flex',
      height: '32px',
      justifyContent: 'center',
      margin: theme.spacing(1.5, 1.5, 1.5, 0),
      padding: theme.spacing(1.5),
      outline: 'none',
      overflow: 'hidden',
      userSelect: 'none',

      '&:hover, &:focus': {
        backgroundColor: theme.palette.grey[200],
        color: theme.palette.common.black,
        cursor: 'pointer',
        textDecoration: 'none'
      }
    },
    label: theme.typography.body2
  }),
  { name: 'AccessButton' }
)

export function AccessButton({
  data: { access, action, icon, label, to = '' }
}: Props) {
  const classes = styles()

  const AccessItem = useCallback(
    () => (
      <Link className={classes.container} onClick={action} to={to}>
        {icon && <SvgIcon path={icon} rightMargined color="grey" />}
        <Typography className={classes.label} variant="body1">
          {label}
        </Typography>
      </Link>
    ),
    [action, classes, icon, label, to]
  )

  if (access === undefined) {
    return <AccessItem />
  }

  return (
    <Acl access={access}>
      <AccessItem />
    </Acl>
  )
}
