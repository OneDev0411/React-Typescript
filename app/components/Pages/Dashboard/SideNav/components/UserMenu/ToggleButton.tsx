import { Box, Typography, Tooltip } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { mdiDotsVertical } from '@mdi/js'

import { Avatar } from 'components/Avatar'
import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { getActiveBrand } from 'utils/user-teams'

const useStyles = makeStyles(
  (theme: Theme) => ({
    dropdownToggleButton: {
      maxWidth: '100%',
      padding: theme.spacing(2, 2, 1.5),
      justifyContent: 'space-between',
      borderTop: `1px solid ${theme.palette.grey[800]}`
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
      color: theme.palette.common.white
    },
    arrowIcon: {
      color: theme.palette.navbar.contrastText
    },
    arrowIconRotated: {
      transform: 'rotateX(0)'
    },
    userInfo: {
      opacity: 0.7
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
  const { display_name } = props.user

  const brandName = getActiveBrand(props.user)?.name ?? ''
  const tooltipTitle = `${display_name} ${brandName ? `(${brandName})` : ''}`

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
        <Box className={classes.wrapper}>
          <Avatar user={props.user} />
          <div className={classes.userDetails}>
            <Typography
              noWrap
              variant="body1"
              className={classes.userDisplayName}
            >
              {display_name}
            </Typography>
          </div>
        </Box>
      </DropdownToggleButton>
    </Tooltip>
  )
}
