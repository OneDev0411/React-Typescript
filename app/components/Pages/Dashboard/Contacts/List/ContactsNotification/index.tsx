import {
  makeStyles,
  createStyles,
  Theme,
  Badge,
  Grid,
  MenuItem,
  useTheme,
  Divider
} from '@material-ui/core'
import { mdiAccountMultipleOutline } from '@mdi/js'

import { DropdownTab } from '@app/views/components/PageTabs'
import { SvgIcon, muiIconSizes } from 'components/SvgIcons'

import { OtherContactsBadge } from '../OtherContactsBadge'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      height: '42px',
      width: '42px',
      minWidth: 'unset',
      border: 'none',
      marginRight: theme.spacing(2)
    },
    badge: {
      backgroundColor: theme.palette.error.main,
      borderRadius: theme.spacing(0.5),
      right: theme.spacing(0.5)
    },
    buttonIcon: { marginTop: theme.spacing(1), color: theme.palette.grey[700] },
    dropdown: {
      width: 336
    }
  })
)

interface Props {
  parkedContactCount: number
  duplicateClusterCount: number
  onClickParkedContacts: () => void
  onClickDuplicateCluster: () => void
  disabled?: boolean
}

const MAX_COUNT = 20

export function ContactsNotification({
  parkedContactCount,
  duplicateClusterCount,
  onClickParkedContacts,
  onClickDuplicateCluster,
  disabled = false
}: Props) {
  const classes = useStyles()
  const theme = useTheme<Theme>()

  return (
    <DropdownTab
      buttonClassName={classes.button}
      buttonVariant="outlined"
      title={
        <Badge
          color="primary"
          classes={{ badge: classes.badge }}
          variant="standard"
          badgeContent={parkedContactCount + duplicateClusterCount}
          max={MAX_COUNT}
        >
          <SvgIcon
            size={muiIconSizes.medium}
            className={classes.buttonIcon}
            path={mdiAccountMultipleOutline}
          />
        </Badge>
      }
      popoverOptions={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        style: { zIndex: theme.zIndex.modal }
      }}
    >
      {({ toggleMenu }) => (
        <>
          {parkedContactCount && (
            <>
              <MenuItem onClick={toggleMenu}>
                <Grid container>
                  <OtherContactsBadge
                    disabled={disabled}
                    title="New contacts to review and add"
                    count={parkedContactCount}
                    onClick={onClickParkedContacts}
                  />
                </Grid>
              </MenuItem>
              <Divider />
            </>
          )}
          {duplicateClusterCount && (
            <MenuItem onClick={toggleMenu}>
              <Grid container>
                <OtherContactsBadge
                  disabled={disabled}
                  title="Duplicate Contacts"
                  count={duplicateClusterCount}
                  onClick={onClickDuplicateCluster}
                />
              </Grid>
            </MenuItem>
          )}
        </>
      )}
    </DropdownTab>
  )
}
