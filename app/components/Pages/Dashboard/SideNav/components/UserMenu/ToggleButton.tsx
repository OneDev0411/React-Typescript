import { Box, Typography, Tooltip } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { mdiDotsVertical } from '@mdi/js'

import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { useUnsafeActiveBrand } from 'hooks/brand/use-unsafe-active-brand'

const useStyles = makeStyles(
  (theme: Theme) => ({
    dropdownToggleButton: {
      maxWidth: '100%',
      padding: theme.spacing(1.5, 2, 1.5, 3),
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
  const { display_name } = props.user

  const tooltipTitle = `${display_name} ${
    activeBrand?.name ? `(${activeBrand.name})` : ''
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
        <Box className={classes.wrapper}>
          <div className={classes.userDetails}>
            <Typography
              noWrap
              variant="body1"
              className={classes.userDisplayName}
            >
              {display_name ?? activeBrand?.name ?? 'Loading...'}
            </Typography>
          </div>
        </Box>
      </DropdownToggleButton>
    </Tooltip>
  )
}
