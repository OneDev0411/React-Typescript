import React from 'react'
import { Box, Typography } from '@material-ui/core'
import {
  withStyles,
  makeStyles,
  createStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import MuiListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { mdiCheckboxMarkedCircle } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

// TODO: Replace this new module with the already exisitng one in global components
import { ProgressBar } from '../../components/ProgressBar'

const ListItem = withStyles((theme: Theme) => ({
  root: {
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300],
    borderTop: '1px',
    borderBottom: '1px'
  }
}))(MuiListItem)

const styles = makeStyles(
  (theme: Theme) => ({
    heading: {
      padding: `0 ${theme.spacing(4)}px`,
      marginTop: theme.spacing(2)
    }
  }),
  { name: 'HappyPaths' }
)

export function HappyPaths() {
  const classes = styles()
  const theme = useTheme<Theme>()

  return (
    <>
      <Box p={4}>
        <Typography variant="body2">Your progress:</Typography>
        <ProgressBar value={14} determinate />
      </Box>
      <Typography variant="h6" className={classes.heading}>
        Learn how to build relationships
      </Typography>
      <List>
        <ListItem button>
          <ListItemIcon>
            <SvgIcon
              path={mdiCheckboxMarkedCircle}
              color={theme.palette.primary.main}
            />
          </ListItemIcon>
          <ListItemText primary="Creating an account" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SvgIcon
              path={mdiCheckboxMarkedCircle}
              color={theme.palette.grey[300]}
            />
          </ListItemIcon>
          <ListItemText primary="Tag your contacts for easier access" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SvgIcon
              path={mdiCheckboxMarkedCircle}
              color={theme.palette.grey[300]}
            />
          </ListItemIcon>
          <ListItemText primary="Import your contacts from Google/Outlook" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SvgIcon
              path={mdiCheckboxMarkedCircle}
              color={theme.palette.grey[300]}
            />
          </ListItemIcon>
          <ListItemText primary="Set birthday / home nniversary reminders" />
        </ListItem>
      </List>

      <Typography variant="h6" className={classes.heading}>
        Learn how to Impress Sellers
      </Typography>
      <List>
        <ListItem button>
          <ListItemIcon>
            <SvgIcon
              path={mdiCheckboxMarkedCircle}
              color={theme.palette.grey[300]}
            />
          </ListItemIcon>
          <ListItemText primary="Send stunning emails and reports" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SvgIcon
              path={mdiCheckboxMarkedCircle}
              color={theme.palette.grey[300]}
            />
          </ListItemIcon>
          <ListItemText primary="Promote listings on social media" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SvgIcon
              path={mdiCheckboxMarkedCircle}
              color={theme.palette.grey[300]}
            />
          </ListItemIcon>
          <ListItemText primary="Make professional tour prints" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SvgIcon
              path={mdiCheckboxMarkedCircle}
              color={theme.palette.grey[300]}
            />
          </ListItemIcon>
          <ListItemText primary="Get insights of how people are engaging" />
        </ListItem>
      </List>
    </>
  )
}
