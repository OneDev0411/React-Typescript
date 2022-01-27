import { Typography, Tooltip } from '@material-ui/core'
import { makeStyles, alpha, Theme } from '@material-ui/core/styles'
import { mdiDotsVertical } from '@mdi/js'

import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'
import { useImpersonateUser } from '@app/hooks/use-impersonate-user'
import { DropdownToggleButton } from 'components/DropdownToggleButton'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(1.5, 2, 1.5, 3)
    },
    dropdownToggleButton: {
      width: '100%',
      justifyContent: 'space-between'
    },
    wrapper: {
      display: 'flex',
      width: `calc(100% - ${theme.spacing(3)}px)`,
      color: theme.palette.navbar.contrastText
    },
    userDetails: {
      textAlign: 'left',
      width: '100%'
    },
    userDisplayName: {
      color: theme.palette.navbar.contrastText
    },
    arrowIcon: {
      color: theme.palette.navbar.contrastText
    },
    arrowIconRotated: {
      transform: 'rotateX(0)'
    },
    impersonateUserContainer: {
      marginBottom: theme.spacing(1)
    },
    impersonateUserLabel: {
      display: 'block',
      marginBottom: theme.spacing(0.5),
      color: theme.palette.grey[500]
    },
    impersonateUserName: {
      padding: theme.spacing(1),
      background: alpha(theme.palette.common.white, 0.28),
      color: theme.palette.common.white,
      borderRadius: theme.shape.borderRadius
    }
  }),
  {
    name: 'UserMenuToggleButton'
  }
)

interface Props {
  onClick: (e) => void
  id: string
  isOpen: boolean
  user: IUser
}

export default function ToggleButton(props: Props) {
  const classes = useStyles()
  const activeBrand = useUnsafeActiveBrand()
  const impersonateUser = useImpersonateUser()

  const { display_name } = props.user

  const tooltipTitle = `${display_name} ${
    activeBrand?.name ? `(${activeBrand.name})` : ''
  }`

  return (
    <div className={classes.container}>
      {/* TODO: we should change this in the new sidebar design */}
      {impersonateUser && (
        <div className={classes.impersonateUserContainer}>
          <Typography
            noWrap
            variant="caption"
            className={classes.impersonateUserLabel}
          >
            Working On Behalf of
          </Typography>
          <Typography
            noWrap
            variant="body2"
            className={classes.impersonateUserName}
          >
            {impersonateUser.display_name}
          </Typography>
        </div>
      )}
      <Tooltip placement="right" title={tooltipTitle}>
        <DropdownToggleButton
          id={props.id}
          onClick={props.onClick}
          isActive={props.isOpen}
          classes={{
            arrowIcon: classes.arrowIcon,
            root: classes.dropdownToggleButton,
            rotated: classes.arrowIconRotated
          }}
          iconPath={mdiDotsVertical}
        >
          <div className={classes.wrapper}>
            <div className={classes.userDetails}>
              <Typography
                noWrap
                variant="body1"
                className={classes.userDisplayName}
              >
                {display_name ?? activeBrand?.name ?? 'Loading...'}
              </Typography>
            </div>
          </div>
        </DropdownToggleButton>
      </Tooltip>
    </div>
  )
}
