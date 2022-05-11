import { Typography, Tooltip } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { mdiDotsVertical } from '@mdi/js'

import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'
import { useImpersonateUser } from '@app/hooks/use-impersonate-user'
import { DropdownToggleButton } from 'components/DropdownToggleButton'

const useStyles = makeStyles(
  (theme: Theme) => ({
    dropdownToggleButton: {
      justifyContent: 'space-between',
      maxWidth: '100%',
      padding: theme.spacing(2, 2.5, 2, 3),
      width: '100%'
    },
    wrapper: {
      display: 'flex',
      width: `calc(100% - ${theme.spacing(3)}px)`,
      color: theme.palette.grey[400],
      alignItems: 'center'
    },
    userDetails: {
      textAlign: 'left',
      width: '100%'
    },
    avatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      marginRight: theme.spacing(1)
    },
    userDisplayName: {
      color: theme.palette.grey[400],
      lineHeight: 1.3,
      '&:hover': {
        color: theme.navbar.background.contrastText
      }
    },
    arrowIcon: {
      color: theme.palette.grey[400],
      marginLeft: theme.spacing(0.5),
      alignSelf: 'center'
    },
    arrowIconRotated: {
      transform: 'rotateX(0)'
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

  const userName = impersonateUser?.display_name ?? display_name

  const tooltipTitle = `${userName} ${
    activeBrand?.name ? `(${activeBrand?.name})` : ''
  }`

  return (
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
              {activeBrand?.name ?? '[No Active Brand]'}
            </Typography>
          </div>
        </div>
      </DropdownToggleButton>
    </Tooltip>
  )
}
