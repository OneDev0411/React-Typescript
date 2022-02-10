import { Box, Typography, Tooltip } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { mdiDotsHorizontal } from '@mdi/js'

import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { getActiveBrand } from 'utils/user-teams'

const useStyles = makeStyles(
  (theme: Theme) => ({
    dropdownToggleButton: {
      maxWidth: '100%',
      padding: theme.spacing(2, 2.5, 2, 3),
      justifyContent: 'space-between'
    },
    wrapper: {
      display: 'flex',
      width: `calc(100% - ${theme.spacing(3)}px)`,
      color: theme.palette.common.white,
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
      color: theme.palette.common.white,
      lineHeight: 1.3,
      '&:hover': {
        color: theme.palette.primary.main
      }
    },
    arrowIcon: {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(0.5),
      alignSelf: 'center'
    },
    tooltipArrow: {
      marginLeft: `${theme.spacing(-1.25)}px !important`
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
  const { display_name } = props.user

  const brandName = getActiveBrand(props.user)?.name ?? ''
  const tooltipTitle = `${display_name} ${brandName ? `(${brandName})` : ''}`

  return (
    <Tooltip
      placement="right"
      title={tooltipTitle}
      classes={{ arrow: classes.tooltipArrow }}
    >
      <DropdownToggleButton
        id={props.id}
        onClick={props.onClick}
        isActive={props.isOpen}
        classes={{
          arrowIcon: classes.arrowIcon,
          root: classes.dropdownToggleButton,
          rotated: classes.arrowIconRotated
        }}
        iconPath={mdiDotsHorizontal}
      >
        <Box className={classes.wrapper}>
          {/* <Avatar user={props.user} className={classes.avatar} /> */}
          <div className={classes.userDetails}>
            <Typography
              noWrap
              variant="body2"
              className={classes.userDisplayName}
            >
              {brandName}
            </Typography>
          </div>
        </Box>
      </DropdownToggleButton>
    </Tooltip>
  )
}
